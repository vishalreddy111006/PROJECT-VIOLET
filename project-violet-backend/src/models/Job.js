const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  bookingRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookingRequest',
    required: true
  },
  billboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billboard',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  jobType: {
    type: String,
    enum: ['installation', 'removal', 'maintenance', 'inspection'],
    default: 'installation'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  deadline: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'accepted', 'in-progress', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  description: String,
  requirements: [String],
  payment: {
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending'
    }
  },
  completion: {
    completedAt: Date,
    proofImages: [{
      url: String,
      uploadedAt: Date
    }],
    notes: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  agentNotes: String,
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
jobSchema.index({ location: '2dsphere' });

// Index for status and date queries
jobSchema.index({ status: 1, scheduledDate: 1 });

module.exports = mongoose.model('Job', jobSchema);
