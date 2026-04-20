const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
  'uploads/profiles',
  'uploads/billboards',
  'uploads/documents',
  'uploads/ads',
  'uploads/jobs'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'profileImage') {
      uploadPath = 'uploads/profiles/';
    } else if (file.fieldname === 'billboardImages') {
      uploadPath = 'uploads/billboards/';
    } else if (file.fieldname === 'idDocument' || file.fieldname === 'documents') {
      uploadPath = 'uploads/documents/';
    } else if (file.fieldname === 'adContent') {
      uploadPath = 'uploads/ads/';
    } else if (file.fieldname === 'proofImages') {
      uploadPath = 'uploads/jobs/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|pdf|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'));
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
