const Job = require('../models/Job');
const User = require('../models/User');
const BookingRequest = require('../models/BookingRequest');
const geolib = require('geolib');
const reliabilityService = require('../services/reliabilityService');
// @desc    Get all jobs (for agents - nearby jobs)
// @route   GET /api/jobs
// @access  Private (Agent)
exports.getJobs = async (req, res) => {
  try {
    const {
      status,
      latitude,
      longitude,
      radius = 20000, // 20km default
      page = 1,
      limit = 20
    } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // Default: show available jobs for agents
      if (req.user.role === 'agent') {
        query.status = { $in: ['pending', 'assigned'] };
      }
    }

    // If agent is logged in and wants nearby jobs
    if (req.user.role === 'agent' && latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    // If agent, show unassigned or assigned to them
    if (req.user.role === 'agent') {
      query.$or = [
        { assignedAgentId: null },
        { assignedAgentId: req.user.id }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('billboardId', 'title location images')
      .populate('customerId', 'name phone')
      .populate('assignedAgentId', 'name phone rating')
      .sort({ priority: -1, scheduledDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get jobs'
    });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private (Agent or Admin)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('billboardId')
      .populate('customerId', 'name email phone')
      .populate('assignedAgentId', 'name email phone rating')
      .populate('bookingRequestId');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get job'
    });
  }
};

// @desc    Get my jobs (for agents)
// @route   GET /api/jobs/my/assignments
// @access  Private (Agent)
exports.getMyJobs = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { assignedAgentId: req.user.id };

    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .populate('billboardId', 'title location images')
      .populate('customerId', 'name phone')
      .sort({ scheduledDate: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get jobs'
    });
  }
};

// @desc    Accept job (Agent)
// @route   PUT /api/jobs/:id/accept
// @access  Private (Agent)
exports.acceptJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is available
    if (job.status !== 'pending' && job.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: `Job is already ${job.status}`
      });
    }

    // Check if already assigned to another agent
    if (job.assignedAgentId && job.assignedAgentId.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Job is already assigned to another agent'
      });
    }

    // Assign job to agent
    job.assignedAgentId = req.user.id;
    job.status = 'accepted';
    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate('billboardId', 'title location images')
      .populate('customerId', 'name phone')
      .populate('assignedAgentId', 'name phone rating');

    res.status(200).json({
      success: true,
      message: 'Job accepted successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept job'
    });
  }
};

// @desc    Reject job (Agent)
// @route   PUT /api/jobs/:id/reject
// @access  Private (Agent)

exports.rejectJob = async (req, res) => {
  try {
    const { reason } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if assigned to this agent
    if (job.assignedAgentId && job.assignedAgentId.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Not authorized to reject this job'
      });
    }

    job.status = 'rejected';
    job.agentNotes = reason;
    job.assignedAgentId = null;
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job rejected',
      job
    });
  } catch (error) {
    console.error('Reject job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject job'
    });
  }
};

// @desc    Start job (Agent)
// @route   PUT /api/jobs/:id/start
// @access  Private (Agent)
exports.startJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if assigned to this agent
    if (job.assignedAgentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this job'
      });
    }

    // Check if job is accepted
    if (job.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Job must be accepted first'
      });
    }

    job.status = 'in-progress';
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job started',
      job
    });
  } catch (error) {
    console.error('Start job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to start job'
    });
  }
};

// @desc    Complete job (Agent - upload proof)
// @route   PUT /api/jobs/:id/complete
// @access  Private (Agent)
exports.completeJob = async (req, res) => {
  try {
    const { notes } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if assigned to this agent
    if (job.assignedAgentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this job'
      });
    }

    // Check if job is in progress
    if (job.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Job must be in progress to complete'
      });
    }

    // Handle proof images upload
    if (!req.files || !req.files.proofImages || req.files.proofImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload proof images'
      });
    }

    const proofImages = req.files.proofImages.map(file => ({
      url: file.path,
      uploadedAt: new Date()
    }));

    job.completion = {
      completedAt: new Date(),
      proofImages,
      notes,
      verificationStatus: 'pending'
    };
    job.status = 'completed';
    await job.save();

    // 1. Update agent's completed jobs count
    const agent = await User.findById(req.user.id);
    agent.completedJobs = (agent.completedJobs || 0) + 1; // Safely increment
    await agent.save();

    // ==========================================
    // 2. TRIGGER PROJECT VIOLET RELIABILITY ENGINE
    // ==========================================
    
    // Boost Agent's reliability for finishing the job
    await reliabilityService.updateAgentReliability(
      req.user.id, 
      'JOB_COMPLETED_ON_TIME'
    );

    // Boost Billboard's reliability because an agent just physically verified it
    await reliabilityService.updateBillboardReliability(
      job.billboardId, 
      'AGENT_MAINTENANCE_VERIFIED'
    );
    // ==========================================

    // Update booking request status
    await BookingRequest.findByIdAndUpdate(job.bookingRequestId, {
      status: 'completed'
    });

    const updatedJob = await Job.findById(job._id)
      .populate('billboardId', 'title location')
      .populate('assignedAgentId', 'name phone rating completedJobs reliabilityScore');

    res.status(200).json({
      success: true,
      message: 'Job completed successfully. Trust scores updated.',
      job: updatedJob
    });
  } catch (error) {
    console.error('Complete job error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete job'
    });
  }
};

// @desc    Update agent location
// @route   PUT /api/jobs/agent/location
// @access  Private (Agent)
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const agent = await User.findById(req.user.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    agent.location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    await agent.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      location: agent.location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update location'
    });
  }
};

// @desc    Get nearby jobs (based on agent's current location)
// @route   GET /api/jobs/nearby
// @access  Private (Agent)
exports.getNearbyJobs = async (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const radius = req.query.radius || 6000; // 6km 

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const nearbyJobs = await Job.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "distance",
          maxDistance: parseInt(radius), 
          spherical: true,
          query: { status: 'pending' }
        }
      },
      {
        $lookup: {
          from: 'billboards', 
          localField: 'billboardId',
          foreignField: '_id',
          as: 'billboardId' 
        }
      },
      {
        $unwind: {
          path: '$billboardId',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { distance: 1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      count: nearbyJobs.length, 
      jobs: nearbyJobs         
    });
  } catch (error) {
    console.error('Get nearby jobs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get nearby jobs'
    });
  }
};

