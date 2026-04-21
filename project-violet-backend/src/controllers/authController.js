const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { createOTP, verifyOTP } = require('../utils/otpService');
const aiService = require('../services/aiService');

// @desc    Register user (Step 1: Send OTP)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, lastName, email, phone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Create user (not verified yet)
    const user = await User.create({
      name,
      lastName,
      email,
      phone,
      password,
      role: role || 'customer',
      isVerified: false
    });

    // Send OTP
    const otpResult = await createOTP(phone, email, user._id, 'registration');

    if (!otpResult.success) {
      // Delete user if OTP fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration initiated. Please verify OTP.',
      userId: user._id,
      phone: phone
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// @desc    Verify OTP (Step 2: Complete Registration)
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, purpose } = req.body;

    // Verify OTP
    const result = await verifyOTP(phone, otp, purpose || 'registration');

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Get user
    const user = await User.findById(result.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update verification details
    user.verificationDetails = user.verificationDetails || {};
    user.verificationDetails.otp = {
      verified: true,
      score: 25
    };

    // ========================================================
    // NEW LOGIC: Role-Based Status Assignment
    // ========================================================
    if (user.role === 'admin') {
      // Admins require physical document verification next
      user.status = 'pending';
    } else {
      // Customers and Agents bypass document KYC
      user.status = 'active';
      user.isVerified = true; 
    }
    // ========================================================
    
    user.calculateVerificationScore();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status, // Sent to frontend for routing
        isVerified: user.isVerified,
        verificationScore: user.verificationScore
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed'
    });
  }
};

// @desc    Login user (Send OTP)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    // Find user
    const user = await User.findOne({
      $or: [{ phone }, { email }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Send OTP for login
    const otpResult = await createOTP(user.phone, user.email, user._id, 'login');

    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Please verify to login.',
      userId: user._id,
      phone: user.phone
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    // Find user
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send OTP
    const otpResult = await createOTP(user.phone, user.email, user._id, purpose || 'login');

    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend OTP'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user'
    });
  }
};

// @desc    Upload ID document for verification (Admin only)
// @route   POST /api/auth/upload-id
// @access  Private (Admin)
exports.uploadIDDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an ID document'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Save document path
    user.idDocument = req.file.path;

    // Verify document using AI
    const verificationResult = await aiService.verifyIDDocument(req.file.path);

    user.idDocumentData = verificationResult.extractedData || {};
    user.verificationDetails = user.verificationDetails || {};
    user.verificationDetails.idDocument = {
      verified: verificationResult.verified,
      score: verificationResult.score
    };

    // Simulate database verification
    if (verificationResult.extractedData) {
      const dbVerification = await aiService.simulateDatabaseVerification(verificationResult.extractedData);
      user.verificationDetails.database = {
        verified: dbVerification.verified,
        score: dbVerification.score
      };
    }

    // Calculate total verification score
    user.calculateVerificationScore();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'ID document uploaded and verified',
      verificationScore: user.verificationScore,
      verificationStatus: user.verificationStatus,
      extractedData: verificationResult.extractedData
    });
  } catch (error) {
    console.error('Upload ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload ID'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (data.name) user.name = data.name;
    if (data.lastName) user.lastName = data.lastName;
    if (data.email) user.email = data.email;
    if (data.phone) user.phone = data.phone;
    if (data.company) user.company = data.company;

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};
