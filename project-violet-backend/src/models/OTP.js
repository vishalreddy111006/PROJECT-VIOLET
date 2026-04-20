const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'verification', 'password-reset'],
    default: 'registration'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - document auto-deletes after expiresAt
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model('OTP', otpSchema);
