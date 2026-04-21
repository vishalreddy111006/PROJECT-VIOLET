const Billboard = require('../models/Billboard');
const aiService = require('../services/aiService');
const { getRecommendations, getSimilarBillboards } = require('../services/recommendationService');
const verificationService = require('../services/verificationService');
const { visibilityService } = require('../services/visibilityService'); // 🟢 NEW: Import Visibility Service

// @desc    Create new billboard
// @route   POST /api/billboards
// @access  Private (Admin only)
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

    // 1. Safe Parsing for Multipart/FormData
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const parsedPricing = typeof pricing === 'string' ? JSON.parse(pricing) : pricing;
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];

    // Ensure coordinates are Floats for MongoDB Geospatial Indexing
    const lng = parseFloat(parsedLocation.coordinates[0]);
    const lat = parseFloat(parsedLocation.coordinates[1]);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates provided.' });
    }

    // 2. Run Visibility Algorithm (OSM Query)
    const visibilityData = await visibilityService.calculateScore(lat, lng);

    // 3. Initialize Verification State
    let images = [];
    let documents = [];
    let imageVerification = { verified: false, score: 0, message: 'Pending' };
    let docVerification = { verified: false, score: 0, message: 'Pending', extractedData: null };
    let locationVerification = { verified: false, score: 0, message: 'Pending' };

    // 4. Process Uploaded Files
    if (req.files) {
      // Handle Images
      if (req.files.billboardImages) {
        images = req.files.billboardImages.map((file, index) => ({
          url: file.path,
          isPrimary: index === 0,
          uploadedAt: new Date()
        }));
        
        if (images.length > 0) {
          try {
            imageVerification = await aiService.validateBillboardImage(images[0].url);
          } catch (e) { console.error("AI Image Validation failed", e); }
        }
      }

      // Handle Documents
      if (req.files.documents) {
        documents = req.files.documents.map(file => ({
          type: 'ownership',
          url: file.path,
          uploadedAt: new Date()
        }));
        
        if (documents.length > 0) {
          try {
            docVerification = await aiService.verifyIDDocument(documents[0].url);
          } catch (e) { console.error("AI OCR Validation failed", e); }
        }
      }
    }

    // 5. Run Location Consistency
    try {
      locationVerification = await aiService.verifyLocationConsistency(
        parsedLocation,
        docVerification.extractedData
      );
    } catch (e) { console.error("Location consistency check failed", e); }

    // 6. Execute WLC Trust Engine Logic
    const trustResult = verificationService.calculateTrustScore({
      gpsMatchDistance: locationVerification.score > 80 ? 50 : 250, 
      isLiveCameraCapture: true,
      multiImageValid: images.length >= 2,
      imageConsistencySSIM: (imageVerification.score || 0) / 100,
      ownershipType: documents.length > 0 ? 'Own' : 'None'
    });

    // 7. Assemble and Save (Using 'new' to prevent partial creation crashes)
    const billboard = new Billboard({
      ownerId: req.user.id,
      title,
      description,
      location: {
        ...parsedLocation,
        coordinates: [lng, lat] // Re-inserting cleaned floats
      },
      specifications: parsedSpecifications,
      pricing: parsedPricing,
      availability: availability || { isAvailable: true },
      tags: parsedTags,
      images,
      documents,
      visibility: {
        score: visibilityData.totalScore || 40,
        trafficDensity: visibilityData.trafficDensity || 'medium',
        insights: visibilityData.breakdown
      },
      verification: {
        status: trustResult.status.includes('APPROVED') ? 'approved' : 'pending',
        score: trustResult.score,
        details: {
          imageValidation: imageVerification,
          locationConsistency: locationVerification,
          documentVerification: docVerification
        },
        verifiedAt: trustResult.status.includes('APPROVED') ? new Date() : null
      }
    });

    await billboard.save();

    const populatedBillboard = await Billboard.findById(billboard._id)
      .populate('ownerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Billboard registered and verified successfully',
      billboard: populatedBillboard
    });

  } catch (error) {
    console.error('Create billboard crash averted:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server encountered an error during registration'
    });
  }
};

// @desc    Get all billboards with filters
// @route   GET /api/billboards
// @access  Public
exports.getBillboards = async (req, res) => {
  try {
    const { search, type, city, minPrice, maxPrice, trafficDensity, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = {};
    if (search) query.$text = { $search: search };
    if (type) query['specifications.type'] = type;
    if (city) query['location.city'] = new RegExp(city, 'i');
    
    if (minPrice || maxPrice) {
      query['pricing.pricePerDay'] = {};
      if (minPrice) query['pricing.pricePerDay'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.pricePerDay'].$lte = parseFloat(maxPrice);
    }

    if (trafficDensity) query['visibility.trafficDensity'] = trafficDensity;

    // Visibility rules
    query.status = status || 'active';
    if (!req.user || req.user.role !== 'admin') {
      query['verification.status'] = 'approved';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const billboards = await Billboard.find(query)
      .populate('ownerId', 'name email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Billboard.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      billboards
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve billboards' });
  }
};

// @desc    Get billboard by ID
// @route   GET /api/billboards/:id
// @access  Public
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

// @desc    Update billboard
// @route   PUT /api/billboards/:id
// @access  Private (Owner only)
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

// @desc    Delete billboard
// @route   DELETE /api/billboards/:id
// @access  Private (Owner only)
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

// @desc    Get my billboards
// @route   GET /api/billboards/my/listings
// @access  Private (Admin only)
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

// @desc    Get billboard recommendations
// @route   POST /api/billboards/recommendations
// @access  Public
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

// @desc    Get similar billboards
// @route   GET /api/billboards/:id/similar
// @access  Public
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

// @desc    Search billboards by location
// @route   POST /api/billboards/search/nearby
// @access  Public
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