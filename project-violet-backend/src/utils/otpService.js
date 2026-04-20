const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
const sendEmailOTP = async (email, otp) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email options
    const mailOptions = {
      from: `"Project Violet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Project Violet',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Project Violet - OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email OTP sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return false;
  }
};

// Send OTP via SMS (using Twilio - optional)
const sendSMSOTP = async (phone, otp) => {
  try {
    // Note: This requires Twilio account setup
    // Uncomment when Twilio credentials are available
    
    /*
    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Your Project Violet OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */

    console.log(`SMS OTP would be sent to ${phone}: ${otp}`);
    // For development, just log the OTP
    console.log(`OTP for ${phone}: ${otp}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    return false;
  }
};

// Create and save OTP
const createOTP = async (phone, email, userId, purpose = 'registration') => {
  try {
    const otp = generateOTP();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
    
    // Delete any existing OTPs for this phone/email
    await OTP.deleteMany({ 
      $or: [{ phone }, { email }],
      purpose 
    });

    // Create new OTP
    const otpDoc = await OTP.create({
      userId,
      phone,
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000)
    });

    // Send OTP
    if (email) {
      await sendEmailOTP(email, otp);
    }
    
    // Send SMS OTP
    await sendSMSOTP(phone, otp);

    return {
      success: true,
      message: 'OTP sent successfully',
      otpId: otpDoc._id
    };
  } catch (error) {
    console.error('Error creating OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP'
    };
  }
};

// Verify OTP
const verifyOTP = async (phone, otp, purpose = 'registration') => {
  try {
    const otpDoc = await OTP.findOne({ phone, purpose, verified: false });

    if (!otpDoc) {
      return {
        success: false,
        message: 'OTP not found or already verified'
      };
    }

    // Check if expired
    if (otpDoc.isExpired()) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return {
        success: false,
        message: 'OTP has expired'
      };
    }

    // Check attempts
    if (otpDoc.attempts >= 5) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return {
        success: false,
        message: 'Maximum verification attempts exceeded'
      };
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return {
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 5 - otpDoc.attempts
      };
    }

    // Mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    return {
      success: true,
      message: 'OTP verified successfully',
      userId: otpDoc.userId
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: 'Failed to verify OTP'
    };
  }
};

module.exports = {
  generateOTP,
  sendEmailOTP,
  sendSMSOTP,
  createOTP,
  verifyOTP
};
