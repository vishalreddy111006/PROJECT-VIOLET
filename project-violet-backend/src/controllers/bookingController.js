const BookingRequest = require('../models/BookingRequest');
const Billboard = require('../models/Billboard');
const Job = require('../models/Job');

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      billboardId,
      startDate,
      endDate,
      adContent,
      customerNotes
    } = req.body;

    // Find billboard
    const billboard = await Billboard.findById(billboardId);

    if (!billboard) {
      return res.status(404).json({
        success: false,
        message: 'Billboard not found'
      });
    }

    // Check if billboard is approved
    if (billboard.verification.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Billboard is not verified yet'
      });
    }

    // Check availability
    if (!billboard.isAvailableForDates(startDate, endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Billboard is not available for selected dates'
      });
    }

    // Calculate duration and pricing
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let totalPrice = duration * billboard.pricing.pricePerDay;

    // Apply discounts for longer durations
    if (duration >= 30 && billboard.pricing.pricePerMonth) {
      const months = Math.floor(duration / 30);
      const remainingDays = duration % 30;
      totalPrice = (months * billboard.pricing.pricePerMonth) + (remainingDays * billboard.pricing.pricePerDay);
    } else if (duration >= 7 && billboard.pricing.pricePerWeek) {
      const weeks = Math.floor(duration / 7);
      const remainingDays = duration % 7;
      totalPrice = (weeks * billboard.pricing.pricePerWeek) + (remainingDays * billboard.pricing.pricePerDay);
    }

    // Parse ad content if it's a string
    const parsedAdContent = typeof adContent === 'string' ? JSON.parse(adContent) : adContent;

    // Handle ad content file uploads
    if (req.files && req.files.adContent) {
      parsedAdContent.files = req.files.adContent.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('image') ? 'image' : 'video'
      }));
    }

    // Create booking request
    const booking = await BookingRequest.create({
      customerId: req.user.id,
      billboardId,
      ownerId: billboard.ownerId,
      bookingDetails: {
        startDate,
        endDate,
        duration,
        adContent: parsedAdContent
      },
      pricing: {
        basePrice: billboard.pricing.pricePerDay,
        totalPrice,
        currency: billboard.pricing.currency
      },
      customerNotes
    });

    const populatedBooking = await BookingRequest.findById(booking._id)
      .populate('customerId', 'name email phone')
      .populate('billboardId', 'title location images')
      .populate('ownerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking request'
    });
  }
};

// @desc    Get all booking requests (for customer or admin)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    // If customer, show their bookings
    if (req.user.role === 'customer') {
      query.customerId = req.user.id;
    }
    // If admin, show bookings for their billboards
    else if (req.user.role === 'admin') {
      query.ownerId = req.user.id;
    }

    const { status, page = 1, limit = 10 } = req.query;

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await BookingRequest.find(query)
      .populate('customerId', 'name email phone')
      .populate('billboardId', 'title location images pricing')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await BookingRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get bookings'
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('billboardId')
      .populate('ownerId', 'name email phone')
      .populate('jobId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (
      booking.customerId._id.toString() !== req.user.id &&
      booking.ownerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get booking'
    });
  }
};

// @desc    Accept booking request (Admin only)
// @route   PUT /api/bookings/:id/accept
// @access  Private (Admin - Owner)
exports.acceptBooking = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the owner
    if (booking.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this booking'
      });
    }

    // Check if already processed
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`
      });
    }

    // Update booking status
    booking.status = 'accepted';
    booking.adminResponse = {
      status: 'accepted',
      message: adminNotes || 'Booking accepted',
      respondedAt: new Date()
    };
    booking.adminNotes = adminNotes;

    // Get billboard details
    const billboard = await Billboard.findById(booking.billboardId);

    // Update billboard availability
    billboard.availability.bookedDates.push({
      startDate: booking.bookingDetails.startDate,
      endDate: booking.bookingDetails.endDate,
      bookingId: booking._id
    });
    await billboard.save();

    // Create job for field agent
    const job = await Job.create({
      bookingRequestId: booking._id,
      billboardId: booking.billboardId,
      customerId: booking.customerId,
      jobType: 'installation',
      location: billboard.location,
      scheduledDate: booking.bookingDetails.startDate,
      deadline: booking.bookingDetails.startDate,
      priority: 'high',
      description: `Install advertisement for ${booking.bookingDetails.adContent?.title || 'booking'}`,
      requirements: ['Installation tools', 'Ad materials'],
      payment: {
        amount: booking.pricing.totalPrice * 0.1 // 10% of booking price
      }
    });

    booking.jobId = job._id;
    await booking.save();

    const updatedBooking = await BookingRequest.findById(booking._id)
      .populate('customerId', 'name email phone')
      .populate('billboardId', 'title location')
      .populate('jobId');

    res.status(200).json({
      success: true,
      message: 'Booking accepted and job created',
      booking: updatedBooking,
      job
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept booking'
    });
  }
};

// @desc    Reject booking request (Admin only)
// @route   PUT /api/bookings/:id/reject
// @access  Private (Admin - Owner)
exports.rejectBooking = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the owner
    if (booking.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this booking'
      });
    }

    // Check if already processed
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}`
      });
    }

    // Update booking status
    booking.status = 'rejected';
    booking.adminResponse = {
      status: 'rejected',
      message: adminNotes || 'Booking rejected',
      respondedAt: new Date()
    };
    booking.adminNotes = adminNotes;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking rejected',
      booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject booking'
    });
  }
};

// @desc    Cancel booking (Customer only)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is the customer
    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Can only cancel pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending bookings'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};
