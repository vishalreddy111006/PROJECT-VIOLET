const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a lastName'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'agent'],
    default: 'customer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Admin specific fields
  idDocument: {
    type: String, // Path to uploaded ID
  },
  idDocumentData: {
    documentNumber: String,
    name: String,
    dateOfBirth: Date,
    address: String,
    extractedText: String
  },
  faceImage: {
    type: String, // Path to extracted face from ID
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationDetails: {
    otp: { verified: Boolean, score: Number },
    idDocument: { verified: Boolean, score: Number },
    faceMatch: { verified: Boolean, score: Number },
    database: { verified: Boolean, score: Number }
  },
  // Agent specific fields
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // Common fields
  profileImage: String,
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
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate verification score
userSchema.methods.calculateVerificationScore = function() {
  let totalScore = 0;
  const details = this.verificationDetails;
  
  if (details.otp?.verified) totalScore += details.otp.score || 25;
  if (details.idDocument?.verified) totalScore += details.idDocument.score || 25;
  if (details.faceMatch?.verified) totalScore += details.faceMatch.score || 25;
  if (details.database?.verified) totalScore += details.database.score || 25;
  
  this.verificationScore = totalScore;
  
  // Auto-approve if score >= 75
  if (totalScore >= 75) {
    this.verificationStatus = 'approved';
    this.isVerified = true;
  } else if (totalScore < 50) {
    this.verificationStatus = 'rejected';
  }
  
  return totalScore;
};

module.exports = mongoose.model('User', userSchema);
