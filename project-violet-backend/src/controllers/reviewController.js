const Review = require('../models/Review');
const Job = require('../models/Job');
const BookingRequest = require('../models/BookingRequest');
const reliabilityService = require('../services/reliabilityService');

exports.submitFeedback = async (req, res) => {
  try {
    const { targetType, targetId, contextModel, contextId, rating, comment } = req.body;
    const reviewerId = req.user.id;
    const userRole = req.user.role;

    // 1. SCENARIO: Agent completed a job -> Admin or Customer reviews the Agent
    if (targetType === 'Agent' && contextModel === 'Job') {
      const job = await Job.findById(contextId);
      if (!job || job.status !== 'completed') {
        return res.status(400).json({ error: "Job must be completed before leaving feedback." });
      }
      // Ensure only the involved Admin (Billboard Owner) or Customer can review
      // Note: Assuming you populate or look up billboard owner here if needed
    }

    // 2. SCENARIO: Agent visits billboard -> Agent reviews the Billboard
    if (targetType === 'Billboard' && contextModel === 'Job') {
      if (userRole !== 'agent') return res.status(403).json({ error: "Only agents can leave this review." });
      const job = await Job.findById(contextId);
      if (job.assignedAgentId.toString() !== reviewerId) {
        return res.status(403).json({ error: "You were not assigned to this job." });
      }
    }

    // 3. SCENARIO: Campaign ends -> Customer reviews the Billboard
    if (targetType === 'Billboard' && contextModel === 'BookingRequest') {
      if (userRole !== 'customer') return res.status(403).json({ error: "Only customers can leave this review." });
      const booking = await BookingRequest.findById(contextId);
      if (!booking || booking.status !== 'completed') {
        return res.status(400).json({ error: "Campaign duration must be completed first." });
      }
    }

    // Create the review
    const newReview = await Review.create({
      reviewerId,
      targetType,
      targetId,
      contextModel,
      contextId,
      rating,
      comment
    });

    // Fire the Reliability Engine asynchronously
    if (targetType === 'Agent') {
      reliabilityService.processAgentFeedback(targetId, rating);
    } else if (targetType === 'Billboard') {
      reliabilityService.processBillboardFeedback(targetId, rating);
    }

    res.status(201).json({ success: true, message: "Feedback submitted successfully", review: newReview });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "You have already submitted feedback for this event." });
    }
    console.error("Review creation error:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};