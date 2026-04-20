# Project Violet - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Minimum required:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (any random string)
# - EMAIL_USER and EMAIL_PASSWORD (for OTP)
```

### Step 3: Create Upload Directories
```bash
mkdir -p uploads/{profiles,billboards,documents,ads,jobs}
```

### Step 4: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
# Or if installed as service:
sudo systemctl start mongod
```

### Step 5: Run the Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

Server will start at: `http://localhost:5000`

---

## 🧪 Test the API

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

### Test 2: Register a Customer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "password": "test123",
    "role": "customer"
  }'
```

Check your terminal/console for the OTP (in development mode, OTP is logged).

### Test 3: Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otp": "YOUR_OTP_FROM_CONSOLE",
    "purpose": "registration"
  }'
```

Save the token from the response!

### Test 4: Get Your Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 5: Browse Billboards
```bash
curl -X GET http://localhost:5000/api/billboards
```

---

## 📱 Test All User Flows

### Customer Flow
1. Register as customer → Verify OTP → Get token
2. Browse billboards → Search/filter
3. Get recommendations
4. Create booking request
5. Track booking status

### Admin (Billboard Owner) Flow
1. Register as admin → Verify OTP → Get token
2. Upload ID document for verification
3. Create billboard with images and documents
4. View booking requests
5. Accept/reject bookings

### Agent (Field Worker) Flow
1. Register as agent → Verify OTP → Get token
2. Update current location
3. View nearby jobs
4. Accept job
5. Complete job with proof images

---

## 🛠 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Solution: Make sure MongoDB is running
- Check: ps aux | grep mongod
- Start: sudo systemctl start mongod
- Or run: mongod
```

### Issue: OTP Not Sending
```
Solution: 
1. Check .env file has correct EMAIL_USER and EMAIL_PASSWORD
2. For Gmail, use App Password (not regular password)
3. Enable "Less secure app access" if needed
4. Check console logs - OTP is printed there in development
```

### Issue: Port Already in Use
```
Solution: Change PORT in .env file
- Default is 5000
- Change to any available port (e.g., 5001, 8000)
```

### Issue: File Upload Error
```
Solution: Make sure upload directories exist
- Run: mkdir -p uploads/{profiles,billboards,documents,ads,jobs}
- Check permissions: chmod 755 uploads
```

---

## 📊 Project Structure Overview

```
src/
├── config/         # Database configuration
├── controllers/    # Business logic
├── middleware/     # Auth, upload, error handling
├── models/         # Database schemas
├── routes/         # API endpoints
├── services/       # AI/ML and recommendations
├── utils/          # Helper functions
└── server.js       # Main entry point
```

---

## 🔑 Default Test Accounts

After setup, you can create these test accounts:

**Customer:**
```json
{
  "name": "John Customer",
  "email": "customer@test.com",
  "phone": "+911111111111",
  "password": "test123",
  "role": "customer"
}
```

**Admin (Billboard Owner):**
```json
{
  "name": "Jane Admin",
  "email": "admin@test.com",
  "phone": "+912222222222",
  "password": "test123",
  "role": "admin"
}
```

**Agent (Field Worker):**
```json
{
  "name": "Bob Agent",
  "email": "agent@test.com",
  "phone": "+913333333333",
  "password": "test123",
  "role": "agent"
}
```

---

## 📖 Next Steps

1. **Frontend Integration**: Connect with React/React Native frontend
2. **Testing**: Use Postman collection for comprehensive testing
3. **Deployment**: Deploy to production server
4. **Documentation**: Read full API documentation in API_DOCUMENTATION.md

---

## 💡 Tips

- Use Postman for easier API testing
- Check server logs for debugging
- OTPs are logged to console in development
- All uploaded files go to `uploads/` directory
- MongoDB data is in your configured database

---

## 🆘 Need Help?

Check these files:
- `README.md` - Full documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `.env.example` - All configuration options

Happy coding! 🚀
