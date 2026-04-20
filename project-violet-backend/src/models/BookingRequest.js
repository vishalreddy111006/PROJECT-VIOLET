const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  billboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billboard',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDetails: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // in days
      required: true
    },
    adContent: {
      title: String,
      description: String,
      files: [{
        url: String,
        type: String // image, video
      }]
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  adminResponse: {
    status: String,
    message: String,
    respondedAt: Date
  },
  customerNotes: String,
  adminNotes: String,
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
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

// Calculate duration in days
bookingRequestSchema.pre('save', function(next) {
  if (this.bookingDetails.startDate && this.bookingDetails.endDate) {
    const start = new Date(this.bookingDetails.startDate);
    const end = new Date(this.bookingDetails.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.bookingDetails.duration = diffDays;
  }
  next();
});

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
