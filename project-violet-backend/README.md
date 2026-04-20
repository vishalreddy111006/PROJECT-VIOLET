# Project Violet - Backend API

AI-Assisted Digital Billboard Booking & Field Agent Coordination Platform

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Verification System](#verification-system)
- [Testing](#testing)

## ✨ Features

### Core Features
- **Multi-role Authentication** (Customer, Admin, Agent)
- **OTP-based Login** (SMS & Email)
- **Billboard Marketplace** with search and filters
- **Smart Recommendation System** based on location, budget, and preferences
- **AI-Assisted Verification** for billboards and user documents
- **Booking Management** with approval workflow
- **Field Agent Job Assignment** with geolocation
- **Real-time Location Tracking** for agents

### AI/ML Features
- OCR for document data extraction
- Image validation for billboards
- Face matching (simulated)
- Database verification (simulated)
- Scoring system for automated approval

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + OTP
- **File Upload:** Multer
- **Image Processing:** Sharp
- **OCR:** Tesseract.js
- **Geolocation:** Geolib
- **Email:** Nodemailer
- **SMS:** Twilio (optional)

## 📁 Project Structure

```
project-violet-backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── billboardController.js   # Billboard management
│   │   ├── bookingController.js     # Booking requests
│   │   └── jobController.js         # Field agent jobs
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Global error handler
│   │   └── upload.js                # File upload configuration
│   ├── models/
│   │   ├── User.js                  # User model
│   │   ├── OTP.js                   # OTP model
│   │   ├── Billboard.js             # Billboard model
│   │   ├── BookingRequest.js        # Booking model
│   │   └── Job.js                   # Job model
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── billboardRoutes.js       # Billboard endpoints
│   │   ├── bookingRoutes.js         # Booking endpoints
│   │   └── jobRoutes.js             # Job endpoints
│   ├── services/
│   │   ├── aiService.js             # AI/ML verification
│   │   └── recommendationService.js # Billboard recommendations
│   ├── utils/
│   │   ├── jwt.js                   # JWT utilities
│   │   └── otpService.js            # OTP generation & sending
│   └── server.js                    # Main server file
├── uploads/                         # Uploaded files directory
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore file
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Steps

1. **Clone or extract the project**
   ```bash
   cd project-violet-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

5. **Create upload directories**
   ```bash
   mkdir -p uploads/profiles uploads/billboards uploads/documents uploads/ads uploads/jobs
   ```

## ⚙️ Configuration

Edit the `.env` file with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/project-violet

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d

# OTP
OTP_EXPIRY_MINUTES=10

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Twilio (Optional - for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Setting up Gmail for Email OTP

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → App Passwords
   - Generate password for "Mail"
3. Use this app password in `EMAIL_PASSWORD`

## 🏃‍♂️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/verify-otp` | Verify OTP | Public |
| POST | `/login` | Login user | Public |
| POST | `/resend-otp` | Resend OTP | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |
| POST | `/upload-id` | Upload ID document | Private (Admin) |

### Billboards (`/api/billboards`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all billboards | Public |
| GET | `/:id` | Get billboard by ID | Public |
| POST | `/` | Create billboard | Private (Admin) |
| PUT | `/:id` | Update billboard | Private (Owner) |
| DELETE | `/:id` | Delete billboard | Private (Owner) |
| GET | `/my/listings` | Get my billboards | Private (Admin) |
| POST | `/recommendations` | Get recommendations | Public |
| GET | `/:id/similar` | Get similar billboards | Public |
| POST | `/search/nearby` | Search nearby | Public |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create booking | Private (Customer) |
| GET | `/` | Get bookings | Private |
| GET | `/:id` | Get booking by ID | Private |
| PUT | `/:id/accept` | Accept booking | Private (Admin) |
| PUT | `/:id/reject` | Reject booking | Private (Admin) |
| PUT | `/:id/cancel` | Cancel booking | Private (Customer) |

### Jobs (`/api/jobs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all jobs | Private (Agent) |
| GET | `/:id` | Get job by ID | Private (Agent) |
| GET | `/my/assignments` | Get my jobs | Private (Agent) |
| PUT | `/:id/accept` | Accept job | Private (Agent) |
| PUT | `/:id/reject` | Reject job | Private (Agent) |
| PUT | `/:id/start` | Start job | Private (Agent) |
| PUT | `/:id/complete` | Complete job | Private (Agent) |
| PUT | `/agent/location` | Update location | Private (Agent) |
| POST | `/nearby` | Get nearby jobs | Private (Agent) |

## 👥 User Roles

### Customer
- Search and browse billboards
- Get personalized recommendations
- Create booking requests
- Track booking status
- Cancel pending bookings

### Admin (Billboard Owner)
- Register with OTP verification
- Upload ID documents for verification
- Add billboards with images and documents
- Manage billboard listings
- Accept/reject booking requests
- View booking history

### Agent (Field Worker)
- View nearby jobs
- Accept/reject job assignments
- Start and complete jobs
- Upload proof of completion
- Update location in real-time

## 🔐 Verification System

### User Verification (Admin)
1. **OTP Verification** (25 points)
2. **ID Document OCR** (25 points)
3. **Face Matching** (25 points - simulated)
4. **Database Check** (25 points - simulated)

**Total Score ≥ 75** → Auto-approved

### Billboard Verification
1. **Image Validation** (35 points)
2. **Location Consistency** (30 points)
3. **Document Verification** (35 points)

**Total Score ≥ 70** → Auto-approved

## 🧪 Testing

### Test the API using cURL or Postman

#### 1. Register a Customer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "password": "password123",
    "role": "customer"
  }'
```

#### 2. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otp": "123456",
    "purpose": "registration"
  }'
```

#### 3. Get Billboards
```bash
curl -X GET http://localhost:5000/api/billboards
```

#### 4. Get Recommendations
```bash
curl -X POST http://localhost:5000/api/billboards/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "budget": 5000,
    "duration": 7
  }'
```

## 📝 Notes

### Development Mode
- OTP is logged to console (check terminal)
- SMS OTP is simulated (check logs for OTP)
- Face matching is simulated with random scores
- Database verification is simulated

### Production Deployment
1. Set `NODE_ENV=production`
2. Use proper MongoDB connection string
3. Configure real Twilio credentials for SMS
4. Set up proper email service
5. Use environment-specific secrets
6. Enable HTTPS
7. Set up proper logging

## 🤝 Support

For issues or questions, please refer to the project documentation.

## 📄 License

This project is part of Project Violet - AI-Assisted Billboard Booking Platform.
