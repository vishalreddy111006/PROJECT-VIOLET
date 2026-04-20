const mongoose = require('mongoose');

const billboardSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
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
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  specifications: {
    width: {
      type: Number,
      required: true // in feet
    },
    height: {
      type: Number,
      required: true // in feet
    },
    type: {
      type: String,
      enum: ['digital', 'static', 'led', 'backlit'],
      required: true
    },
    illumination: {
      type: String,
      enum: ['lit', 'unlit', 'backlit'],
      default: 'lit'
    },
    orientation: {
      type: String,
      enum: ['landscape', 'portrait', 'square'],
      default: 'landscape'
    }
  },
  pricing: {
    pricePerDay: {
      type: Number,
      required: true
    },
    pricePerWeek: Number,
    pricePerMonth: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: Date,
    availableTo: Date,
    bookedDates: [{
      startDate: Date,
      endDate: Date,
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookingRequest'
      }
    }]
  },
  images: [{
    url: String,
    isPrimary: Boolean,
    uploadedAt: Date
  }],
  documents: [{
    type: {
      type: String,
      enum: ['ownership', 'permit', 'tax', 'other']
    },
    url: String,
    extractedData: mongoose.Schema.Types.Mixed,
    uploadedAt: Date
  }],
  verification: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    details: {
      imageValidation: {
        verified: Boolean,
        score: Number,
        message: String
      },
      locationConsistency: {
        verified: Boolean,
        score: Number,
        message: String
      },
      documentVerification: {
        verified: Boolean,
        score: Number,
        message: String
      }
    },
    verifiedAt: Date
  },
  visibility: {
    views: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0 // estimated daily impressions
    },
    trafficDensity: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium'
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'under-maintenance'],
    default: 'active'
  },
  tags: [String],
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
billboardSchema.index({ location: '2dsphere' });

// Index for search optimization
billboardSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Calculate verification score
billboardSchema.methods.calculateVerificationScore = function() {
  let totalScore = 0;
  const details = this.verification.details;
  
  if (details.imageValidation?.verified) totalScore += details.imageValidation.score || 35;
  if (details.locationConsistency?.verified) totalScore += details.locationConsistency.score || 30;
  if (details.documentVerification?.verified) totalScore += details.documentVerification.score || 35;
  
  this.verification.score = totalScore;
  
  // Auto-approve if score >= 70
  if (totalScore >= 70) {
    this.verification.status = 'approved';
    this.verification.verifiedAt = new Date();
  } else if (totalScore < 50) {
    this.verification.status = 'rejected';
  }
  
  return totalScore;
};

// Check if billboard is available for given dates
billboardSchema.methods.isAvailableForDates = function(startDate, endDate) {
  if (!this.availability.isAvailable) return false;
  
  // Check if dates are within availability range
  if (this.availability.availableFrom && new Date(startDate) < new Date(this.availability.availableFrom)) {
    return false;
  }
  if (this.availability.availableTo && new Date(endDate) > new Date(this.availability.availableTo)) {
    return false;
  }
  
  // Check for conflicts with booked dates
  for (const booking of this.availability.bookedDates) {
    const bookedStart = new Date(booking.startDate);
    const bookedEnd = new Date(booking.endDate);
    const reqStart = new Date(startDate);
    const reqEnd = new Date(endDate);
    
    // Check for overlap
    if (reqStart <= bookedEnd && reqEnd >= bookedStart) {
      return false;
    }
  }
  
  return true;
};

module.exports = mongoose.model('Billboard', billboardSchema);
