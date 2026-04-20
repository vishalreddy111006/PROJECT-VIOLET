# Project Violet - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

Register a new user and send OTP for verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "password123",
  "role": "customer" // customer, admin, or agent
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration initiated. Please verify OTP.",
  "userId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "phone": "+919876543210"
}
```

### 1.2 Verify OTP
**POST** `/auth/verify-otp`

Verify OTP and complete registration/login.

**Request Body:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "purpose": "registration" // registration, login, verification
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "customer",
    "isVerified": false,
    "verificationScore": 25
  }
}
```

### 1.3 Login
**POST** `/auth/login`

Login with phone/email and password, sends OTP.

**Request Body:**
```json
{
  "phone": "+919876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully. Please verify to login.",
  "userId": "64f5a1b2c3d4e5f6g7h8i9j0",
  "phone": "+919876543210"
}
```

### 1.4 Get Current User
**GET** `/auth/me`

Get current logged-in user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "customer",
    "isVerified": true,
    "verificationScore": 100
  }
}
```

### 1.5 Upload ID Document (Admin Only)
**POST** `/auth/upload-id`

Upload ID document for verification.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `idDocument`: File (image or PDF)

**Response:**
```json
{
  "success": true,
  "message": "ID document uploaded and verified",
  "verificationScore": 75,
  "verificationStatus": "approved",
  "extractedData": {
    "documentNumber": "1234-5678-9012",
    "name": "John Doe",
    "dateOfBirth": "1990-01-01"
  }
}
```

---

## 2. Billboard Endpoints

### 2.1 Get All Billboards
**GET** `/billboards`

Get all billboards with optional filters.

**Query Parameters:**
- `search`: Text search
- `type`: Billboard type (digital, static, led, backlit)
- `city`: City name
- `minPrice`: Minimum price per day
- `maxPrice`: Maximum price per day
- `trafficDensity`: Traffic density (low, medium, high, very-high)
- `status`: Status (active, inactive)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order (asc, desc)

**Example:**
```
GET /billboards?city=Delhi&type=digital&minPrice=1000&maxPrice=5000&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "billboards": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "title": "Prime Location Digital Billboard",
      "description": "High visibility billboard at main junction",
      "location": {
        "coordinates": [77.2090, 28.6139],
        "address": "Connaught Place, New Delhi",
        "city": "Delhi",
        "state": "Delhi"
      },
      "specifications": {
        "width": 20,
        "height": 10,
        "type": "digital",
        "illumination": "lit",
        "orientation": "landscape"
      },
      "pricing": {
        "pricePerDay": 2000,
        "pricePerWeek": 12000,
        "pricePerMonth": 45000,
        "currency": "INR"
      },
      "images": [
        {
          "url": "uploads/billboards/billboard-1234567890.jpg",
          "isPrimary": true
        }
      ],
      "verification": {
        "status": "approved",
        "score": 95
      },
      "visibility": {
        "views": 1250,
        "impressions": 50000,
        "trafficDensity": "very-high"
      },
      "ratings": {
        "average": 4.5,
        "count": 23
      }
    }
  ]
}
```

### 2.2 Create Billboard (Admin Only)
**POST** `/billboards`

Create a new billboard listing.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `title`: String (required)
- `description`: String (required)
- `location`: JSON string (required)
  ```json
  {
    "coordinates": [77.2090, 28.6139],
    "address": "Connaught Place, New Delhi",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  }
  ```
- `specifications`: JSON string (required)
  ```json
  {
    "width": 20,
    "height": 10,
    "type": "digital",
    "illumination": "lit",
    "orientation": "landscape"
  }
  ```
- `pricing`: JSON string (required)
  ```json
  {
    "pricePerDay": 2000,
    "pricePerWeek": 12000,
    "pricePerMonth": 45000
  }
  ```
- `billboardImages`: Files (multiple, max 5)
- `documents`: Files (multiple, max 3)
- `tags`: JSON array (optional)

**Response:**
```json
{
  "success": true,
  "message": "Billboard created successfully",
  "billboard": { /* Billboard object */ },
  "verificationScore": 85,
  "verificationStatus": "approved"
}
```

### 2.3 Get Billboard Recommendations
**POST** `/billboards/recommendations`

Get personalized billboard recommendations.

**Request Body:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "budget": 5000,
  "duration": 7,
  "startDate": "2024-01-01",
  "endDate": "2024-01-07",
  "radius": 10000,
  "trafficDensity": "high",
  "billboardType": "digital"
}
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "recommendations": [
    {
      /* Billboard object */
      "recommendationScore": 92,
      "scoringFactors": {
        "distance": {
          "value": 2500,
          "score": 75,
          "weight": 0.3
        },
        "budget": {
          "totalPrice": 14000,
          "difference": 1000,
          "score": 80,
          "weight": 0.25
        },
        "traffic": {
          "density": "very-high",
          "score": 100,
          "weight": 0.2
        }
      },
      "estimatedPrice": 14000
    }
  ]
}
```

### 2.4 Search Nearby Billboards
**POST** `/billboards/search/nearby`

Search billboards near a location.

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "radius": 5000,
  "limit": 20
}
```

---

## 3. Booking Endpoints

### 3.1 Create Booking Request
**POST** `/bookings`

Create a new booking request.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `billboardId`: String (required)
- `startDate`: Date (required)
- `endDate`: Date (required)
- `adContent`: JSON string (required)
  ```json
  {
    "title": "New Product Launch",
    "description": "Advertisement for our new product"
  }
  ```
- `adContent`: Files (multiple, max 5)
- `customerNotes`: String (optional)

**Response:**
```json
{
  "success": true,
  "message": "Booking request created successfully",
  "booking": {
    "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
    "customerId": { /* User object */ },
    "billboardId": { /* Billboard object */ },
    "ownerId": { /* User object */ },
    "bookingDetails": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-07",
      "duration": 7,
      "adContent": {
        "title": "New Product Launch",
        "files": [
          {
            "url": "uploads/ads/ad-1234567890.jpg",
            "type": "image"
          }
        ]
      }
    },
    "pricing": {
      "basePrice": 2000,
      "totalPrice": 12000,
      "currency": "INR"
    },
    "status": "pending"
  }
}
```

### 3.2 Accept Booking (Admin Only)
**PUT** `/bookings/:id/accept`

Accept a booking request and create a job.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "adminNotes": "Booking approved. Job created for installation."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking accepted and job created",
  "booking": { /* Updated booking */ },
  "job": { /* Created job */ }
}
```

---

## 4. Job Endpoints

### 4.1 Get Nearby Jobs
**POST** `/jobs/nearby`

Get jobs near current location.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "radius": 20000
}
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "jobs": [
    {
      "_id": "64f5a1b2c3d4e5f6g7h8i9j0",
      "billboardId": { /* Billboard object */ },
      "customerId": { /* Customer object */ },
      "jobType": "installation",
      "location": {
        "coordinates": [77.2090, 28.6139],
        "address": "Connaught Place, New Delhi"
      },
      "scheduledDate": "2024-01-01",
      "priority": "high",
      "status": "pending",
      "payment": {
        "amount": 1200,
        "status": "pending"
      }
    }
  ]
}
```

### 4.2 Accept Job
**PUT** `/jobs/:id/accept`

Accept a job assignment.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Job accepted successfully",
  "job": { /* Updated job */ }
}
```

### 4.3 Complete Job
**PUT** `/jobs/:id/complete`

Complete a job with proof images.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `proofImages`: Files (multiple, required, max 5)
- `notes`: String (optional)

**Response:**
```json
{
  "success": true,
  "message": "Job completed successfully",
  "job": {
    /* Job object with completion details */
    "completion": {
      "completedAt": "2024-01-01T10:30:00Z",
      "proofImages": [
        {
          "url": "uploads/jobs/proof-1234567890.jpg",
          "uploadedAt": "2024-01-01T10:30:00Z"
        }
      ],
      "notes": "Installation completed successfully",
      "verificationStatus": "pending"
    },
    "status": "completed"
  }
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Exceeded requests will return `429 Too Many Requests`

---

## File Upload Limits

- Maximum file size: 10 MB
- Allowed file types: JPEG, JPG, PNG, PDF, GIF
- Maximum files per request: Varies by endpoint

---

## Notes

1. All dates should be in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`
2. Coordinates are in `[longitude, latitude]` format (GeoJSON standard)
3. All monetary amounts are in the specified currency (default: INR)
4. File paths in responses are relative to the server's base URL
