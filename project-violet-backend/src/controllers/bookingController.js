const BookingRequest = require('../models/BookingRequest');
const Billboard = require('../models/Billboard');
const Job = require('../models/Job');

// @desc    Create booking request (Multi-Billboard Campaign)
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      billboardIds, // Now accepting an array of IDs for the Campaign Cart 
      startDate,
      endDate,
      adContent,
      customerNotes
    } = req.body;

    if (!billboardIds || !Array.isArray(billboardIds) || billboardIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one billboard.' });
    }

    // Find all selected billboards
    const billboards = await Billboard.find({ _id: { $in: billboardIds } });

    if (billboards.length !== billboardIds.length) {
      return res.status(404).json({ success: false, message: 'One or more billboards not found.' });
    }

    // Validation Loop: Check Verification and Availability for all items in cart [cite: 11, 18]
    for (const board of billboards) {
      if (board.verification.status !== 'approved') {
        return res.status(400).json({
          success: false,
          message: `Billboard "${board.title}" is not verified yet.`
        });
      }

      if (!board.isAvailableForDates(startDate, endDate)) {
        return res.status(400).json({
          success: false,
          message: `"${board.title}" is unavailable for the selected dates.`
        });
      }
    }

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Calculate Total Campaign Cost
    let totalCampaignPrice = 0;
    const individualPricing = billboards.map(board => {
      let boardPrice = duration * board.pricing.pricePerDay;

      // Apply duration-based discounts per board
      if (duration >= 30 && board.pricing.pricePerMonth) {
        const months = Math.floor(duration / 30);
        const remainingDays = duration % 30;
        boardPrice = (months * board.pricing.pricePerMonth) + (remainingDays * board.pricing.pricePerDay);
      } else if (duration >= 7 && board.pricing.pricePerWeek) {
        const weeks = Math.floor(duration / 7);
        const remainingDays = duration % 7;
        boardPrice = (weeks * board.pricing.pricePerWeek) + (remainingDays * board.pricing.pricePerDay);
      }
      
      totalCampaignPrice += boardPrice;
      return { billboardId: board._id, price: boardPrice };
    });

    const parsedAdContent = typeof adContent === 'string' ? JSON.parse(adContent) : adContent;

    // Handle ad content file uploads
    if (req.files && req.files.adContent) {
      parsedAdContent.files = req.files.adContent.map(file => ({
        url: file.path,
        type: file.mimetype.startsWith('image') ? 'image' : 'video'
      }));
    }

    // Create multi-billboard booking request
    const booking = await BookingRequest.create({
      customerId: req.user.id,
      billboards: billboardIds, // Array reference
      ownerId: billboards[0].ownerId, // Assuming billboards in one cart belong to same owner for MVP
      bookingDetails: {
        startDate,
        endDate,
        duration,
        adContent: parsedAdContent
      },
      pricing: {
        totalPrice: totalCampaignPrice,
        breakdown: individualPricing,
        currency: billboards[0].pricing.currency
      },
      customerNotes
    });

    const populatedBooking = await BookingRequest.findById(booking._id)
      .populate('customerId', 'name email phone')
      .populate('billboards', 'title location images')
      .populate('ownerId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Campaign booking request created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept booking request & Create Field Agent Jobs 
exports.acceptBooking = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.ownerId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, message: 'Already processed' });

    // 1. Update Booking Status
    booking.status = 'accepted';
    booking.adminResponse = { status: 'accepted', message: adminNotes || 'Approved', respondedAt: new Date() };

    // 2. Process all billboards in the campaign 
    const createdJobs = [];
    for (const boardId of booking.billboards) {
      const billboard = await Billboard.findById(boardId);
      
      // Update Billboard Availability
      billboard.availability.bookedDates.push({
        startDate: booking.bookingDetails.startDate,
        endDate: booking.bookingDetails.endDate,
        bookingId: booking._id
      });
      await billboard.save();

      // Create a unique job for each billboard in the campaign 
      const job = await Job.create({
        bookingRequestId: booking._id,
        billboardId: boardId,
        customerId: booking.customerId,
        jobType: 'installation',
        location: billboard.location,
        scheduledDate: booking.bookingDetails.startDate,
        priority: 'high',
        description: `Install: ${booking.bookingDetails.adContent?.title || 'New Ad Campaign'}`,
        payment: { amount: (booking.pricing.totalPrice / booking.billboards.length) * 0.1 } 
      });
      createdJobs.push(job._id);
    }

    booking.jobIds = createdJobs; // Store array of job IDs
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Campaign accepted. ${createdJobs.length} installation jobs dispatched.`,
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all booking requests
exports.getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') query.customerId = req.user.id;
    else if (req.user.role === 'admin') query.ownerId = req.user.id;

    const { status, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await BookingRequest.find(query)
      .populate('customerId', 'name email phone')
      .populate('billboards', 'title location images pricing')
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
    res.status(500).json({ success: false, message: 'Failed to get bookings' });
  }
};

// @desc    Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('billboards')
      .populate('ownerId', 'name email phone')
      .populate('jobIds');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.customerId._id.toString() !== req.user.id && booking.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get booking' });
  }
};

// @desc    Reject booking request
exports.rejectBooking = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.ownerId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, message: 'Already processed' });

    booking.status = 'rejected';
    booking.adminResponse = { status: 'rejected', message: adminNotes || 'Rejected', respondedAt: new Date() };
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking rejected', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject booking' });
  }
};

// @desc    Cancel booking (Customer only)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, message: 'Cannot cancel active booking' });

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel' });
  }
};