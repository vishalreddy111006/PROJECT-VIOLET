const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  // origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  origin: '*',
  // credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/authRoutes');
const billboardRoutes = require('./routes/billboardRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const jobRoutes = require('./routes/jobRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/billboards', billboardRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/jobs', jobRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Project Violet API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      billboards: '/api/billboards',
      bookings: '/api/bookings',
      jobs: '/api/jobs'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║        🚀 PROJECT VIOLET API SERVER 🚀           ║
    ║                                                   ║
    ║  Server running in ${process.env.NODE_ENV || 'development'} mode                ║
    ║  Port: ${PORT}                                       ║
    ║  Database: Connected                              ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
  `);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
