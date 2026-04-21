const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['Agent', 'Billboard'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  // What event triggered this review? (A specific maintenance job or an ad campaign)
  contextModel: { type: String, enum: ['Job', 'BookingRequest'], required: true },
  contextId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  rating: { type: Number, required: true, min: 1, max: 10 },
  comment: { type: String, trim: true }
}, { timestamps: true });

// CRITICAL ANTI-BUG: Prevent a user from leaving multiple reviews for the exact same job/campaign
reviewSchema.index({ reviewerId: 1, contextId: 1, targetType: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);