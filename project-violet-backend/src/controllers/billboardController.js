const Billboard = require('../models/Billboard');
const aiService = require('../services/aiService');
const { getRecommendations, getSimilarBillboards } = require('../services/recommendationService');

// @desc    Create new billboard
// @route   POST /api/billboards
// @access  Private (Admin only)
exports.createBillboard = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      specifications,
      pricing,
      availability,
      tags
    } = req.body;

    // Parse location if it's a string
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const parsedPricing = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;

    // Create billboard
    const billboard = await Billboard.create({
      ownerId: req.user.id,
      title,
      description,
      location: parsedLocation,
      specifications: parsedSpecifications,
      pricing: parsedPricing,
      availability,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : []
    });

    // Handle image uploads
    if (req.files && req.files.billboardImages) {
      const images = req.files.billboardImages.map((file, index) => ({
        url: file.path,
        isPrimary: index === 0,
        uploadedAt: new Date()
      }));
      billboard.images = images;

      // Verify first image
      if (images.length > 0) {
        const imageVerification = await aiService.validateBillboardImage(images[0].url);
        billboard.verification.details.imageValidation = {
          verified: imageVerification.verified,
          score: imageVerification.score,
          message: imageVerification.message
        };
      }
    }

    // Handle document uploads
    if (req.files && req.files.documents) {
      const documents = req.files.documents.map(file => ({
        type: 'ownership',
        url: file.path,
        uploadedAt: new Date()
      }));
      billboard.documents = documents;

      // Verify first document
      if (documents.length > 0) {
        const docVerification = await aiService.verifyIDDocument(documents[0].url);
        billboard.verification.details.documentVerification = {
          verified: docVerification.verified,
          score: docVerification.score,
          message: docVerification.message
        };
        billboard.documents[0].extractedData = docVerification.extractedData;
      }
    }

    // Verify location consistency
    const locationVerification = await aiService.verifyLocationConsistency(
      parsedLocation,
      billboard.documents[0]?.extractedData
    );
    billboard.verification.details.locationConsistency = {
      verified: locationVerification.verified,
      score: locationVerification.score,
      message: locationVerification.message
    };

    // Calculate verification score
    billboard.calculateVerificationScore();
    await billboard.save();

    const populatedBillboard = await Billboard.findById(billboard._id)
      .populate('ownerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Billboard created successfully',
      billboard: populatedBillboard,
      verificationScore: billboard.verification.score,
      verificationStatus: billboard.verification.status
    });
  } catch (error) {
    console.error('Create billboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create billboard'
    });
  }
};

// @desc    Get all billboards with filters
// @route   GET /api/billboards
// @access  Public
exports.getBillboards = async (req, res) => {
  try {
    const {
      search,
      type,
      city,
      minPrice,
      maxPrice,
      trafficDensity,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (type) {
      query['specifications.type'] = type;
    }

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (minPrice || maxPrice) {
      query['pricing.pricePerDay'] = {};
      if (minPrice) query['pricing.pricePerDay'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.pricePerDay'].$lte = parseFloat(maxPrice);
    }

    if (trafficDensity) {
      query['visibility.trafficDensity'] = trafficDensity;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = 'active'; // Default: only show active billboards
    }

    // Only show approved billboards to non-owners
    if (!req.user || req.user.role !== 'admin') {
      query['verification.status'] = 'approved';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const billboards = await Billboard.find(query)
      .populate('ownerId', 'name email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Billboard.countDocuments(query);

    res.status(200).json({
      success: true,
      count: billboards.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      billboards
    });
  } catch (error) {
    console.error('Get billboards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get billboards'
    });
  }
};

// @desc    Get billboard by ID
// @route   GET /api/billboards/:id
// @access  Public
exports.getBillboardById = async (req, res) => {
  try {
    const billboard = await Billboard.findById(req.params.id)
      .populate('ownerId', 'name email phone rating');

    if (!billboard) {
      return res.status(404).json({
        success: false,
        message: 'Billboard not found'
      });
    }

    // Increment views
    billboard.visibility.views += 1;
    await billboard.save();

    res.status(200).json({
      success: true,
      billboard
    });
  } catch (error) {
    console.error('Get billboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get billboard'
    });
  }
};

// @desc    Update billboard
// @route   PUT /api/billboards/:id
// @access  Private (Owner only)
exports.updateBillboard = async (req, res) => {
  try {
    let billboard = await Billboard.findById(req.params.id);

    if (!billboard) {
      return res.status(404).json({
        success: false,
        message: 'Billboard not found'
      });
    }

    // Check ownership
    if (billboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this billboard'
      });
    }

    // Update fields
    const allowedUpdates = [
      'title',
      'description',
      'specifications',
      'pricing',
      'availability',
      'tags',
      'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        billboard[field] = req.body[field];
      }
    });

    // Handle new image uploads
    if (req.files && req.files.billboardImages) {
      const newImages = req.files.billboardImages.map((file, index) => ({
        url: file.path,
        isPrimary: billboard.images.length === 0 && index === 0,
        uploadedAt: new Date()
      }));
      billboard.images.push(...newImages);
    }

    await billboard.save();

    const updatedBillboard = await Billboard.findById(billboard._id)
      .populate('ownerId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Billboard updated successfully',
      billboard: updatedBillboard
    });
  } catch (error) {
    console.error('Update billboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update billboard'
    });
  }
};

// @desc    Delete billboard
// @route   DELETE /api/billboards/:id
// @access  Private (Owner only)
exports.deleteBillboard = async (req, res) => {
  try {
    const billboard = await Billboard.findById(req.params.id);

    if (!billboard) {
      return res.status(404).json({
        success: false,
        message: 'Billboard not found'
      });
    }

    // Check ownership
    if (billboard.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this billboard'
      });
    }

    await billboard.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Billboard deleted successfully'
    });
  } catch (error) {
    console.error('Delete billboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete billboard'
    });
  }
};

// @desc    Get my billboards
// @route   GET /api/billboards/my/listings
// @access  Private (Admin only)
exports.getMyBillboards = async (req, res) => {
  try {
    const billboards = await Billboard.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: billboards.length,
      billboards
    });
  } catch (error) {
    console.error('Get my billboards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get billboards'
    });
  }
};

// @desc    Get billboard recommendations
// @route   POST /api/billboards/recommendations
// @access  Public
exports.getRecommendations = async (req, res) => {
  try {
    const result = await getRecommendations(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get recommendations'
    });
  }
};

// @desc    Get similar billboards
// @route   GET /api/billboards/:id/similar
// @access  Public
exports.getSimilar = async (req, res) => {
  try {
    const result = await getSimilarBillboards(req.params.id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json({
      success: true,
      count: result.similar.length,
      billboards: result.similar
    });
  } catch (error) {
    console.error('Get similar billboards error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get similar billboards'
    });
  }
};

// @desc    Search billboards by location
// @route   POST /api/billboards/search/nearby
// @access  Public
exports.searchNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10000, limit = 20 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const billboards = await Billboard.find({
      'verification.status': 'approved',
      status: 'active',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    })
    .limit(parseInt(limit))
    .populate('ownerId', 'name email phone')
    .lean();

    res.status(200).json({
      success: true,
      count: billboards.length,
      billboards
    });
  } catch (error) {
    console.error('Search nearby error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search nearby billboards'
    });
  }
};
