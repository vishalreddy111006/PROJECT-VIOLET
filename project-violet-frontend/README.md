# Project Violet - Frontend

Modern, responsive React frontend for the AI-Assisted Digital Billboard Booking Platform.

## 🎨 Features

### Design
- **Beautiful UI/UX** with Tailwind CSS and custom animations
- **Responsive Design** - works perfectly on mobile, tablet, and desktop
- **Modern Aesthetics** - gradient backgrounds, smooth transitions, glass morphism
- **Dark Mode Ready** - sophisticated color palette

### Functionality
- **Multi-Role Dashboards** - Customer, Admin (Billboard Owner), Agent (Field Worker)
- **Real-time Updates** with React Query
- **Map Integration** for billboard locations
- **File Uploads** with drag-and-drop
- **OTP Authentication** via SMS and Email
- **Smart Recommendations** based on location and preferences
- **Booking Management** with complete workflow
- **Job Assignment** for field agents

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend server running on http://localhost:5000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will start at http://localhost:3000

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared UI components
│   └── layouts/        # Layout components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── billboards/     # Billboard pages
│   └── dashboard/      # Dashboard pages
│       ├── customer/   # Customer dashboard
│       ├── admin/      # Admin dashboard
│       └── agent/      # Agent dashboard
├── services/           # API service functions
├── store/              # State management (Zustand)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎯 User Roles & Features

### Customer (Advertiser)
- Browse and search billboards
- Get AI-powered recommendations
- Create booking requests
- Track booking status
- View booking history

### Admin (Billboard Owner)
- Add and manage billboards
- Upload billboard images and documents
- Receive and manage booking requests
- Accept/reject bookings
- Track revenue and analytics
- AI-assisted verification

### Agent (Field Worker)
- View nearby jobs on map
- Accept/reject job assignments
- Update job status
- Upload completion proof
- Track earnings

## 🔧 Configuration

### Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### API Integration

The frontend is configured to work with the Project Violet backend:
- All API calls go through `/api` routes
- Automatic token management with Zustand
- Request/response interceptors for error handling

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with hero section
- **Billboards** (`/billboards`) - Browse all billboards
- **Search** (`/search`) - Advanced search with filters
- **Billboard Details** (`/billboards/:id`) - Detailed view
- **Login** (`/login`) - OTP-based login
- **Register** (`/register`) - User registration
- **Verify OTP** (`/verify-otp`) - OTP verification

### Customer Dashboard
- **Dashboard** - Overview and stats
- **My Bookings** - View all bookings
- **Recommendations** - Personalized suggestions
- **Profile** - Edit profile
- **Settings** - Account settings

### Admin Dashboard
- **Dashboard** - Analytics and overview
- **My Billboards** - Manage billboards
- **Add Billboard** - Create new listing
- **Edit Billboard** - Update billboard
- **Booking Requests** - Manage requests
- **Verification** - Upload ID documents
- **Profile** - Edit profile

### Agent Dashboard
- **Dashboard** - Job overview
- **My Jobs** - Assigned jobs
- **Nearby Jobs** - Available jobs on map
- **Job Details** - Complete jobs
- **Profile** - Edit profile

## 🎨 UI Components

### Common Components
- **Navbar** - Responsive navigation
- **Footer** - Site footer
- **Loading** - Loading spinner
- **EmptyState** - Empty state placeholders
- **Button** - Styled buttons
- **Input** - Form inputs
- **Card** - Content cards
- **Badge** - Status badges
- **Modal** - Dialog modals

### Form Components
- Text inputs with icons
- File upload with drag-and-drop
- Date pickers
- Select dropdowns
- Checkboxes and radios

## 🗺️ Map Integration

Billboard locations are displayed using Mapbox:
- Interactive map view
- Marker clustering
- Click for details
- Filter by location

## 📦 Key Dependencies

- **React 18** - UI library
- **React Router v6** - Routing
- **Zustand** - State management
- **React Query** - Server state
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Forms
- **React Hot Toast** - Notifications
- **React Icons** - Icons
- **Mapbox GL** - Maps
- **date-fns** - Date utilities

## 🔐 Authentication Flow

1. User registers with name, email, phone, password
2. OTP sent to phone/email
3. User verifies OTP
4. JWT token stored in localStorage
5. Token sent with all API requests
6. Auto-redirect on token expiry

## 📊 State Management

Using Zustand for:
- Authentication state
- User information
- Token management
- Persistent storage

## 🎯 Routing

Protected routes based on user role:
- `/dashboard/customer/*` - Customer only
- `/dashboard/admin/*` - Admin only
- `/dashboard/agent/*` - Agent only

Auto-redirect to login if not authenticated.

## 🌐 API Service Functions

All API calls organized by domain:
- `authService.js` - Authentication
- `billboardService.js` - Billboards
- `bookingService.js` - Bookings
- `jobService.js` - Jobs

## 💅 Styling

### Tailwind Configuration
- Custom color palette
- Custom fonts (Outfit, Inter)
- Custom animations
- Responsive breakpoints

### Component Styles
- Reusable utility classes
- Consistent spacing
- Smooth transitions
- Hover effects

## 🚨 Error Handling

- API error interceptors
- Toast notifications
- Form validation
- Empty states
- Loading states

## 📱 Responsive Design

Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Mobile-first approach with responsive:
- Navigation
- Grids and layouts
- Typography
- Spacing

## 🔄 Data Flow

1. User action (click, submit)
2. Service function called
3. API request sent
4. Response handled
5. State updated
6. UI re-renders
7. Toast notification

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build check
npm run build
```

## 📝 Development Tips

1. **Component Creation**
   - Use functional components
   - Add PropTypes for type checking
   - Export default at bottom

2. **Styling**
   - Use Tailwind utility classes
   - Follow naming conventions
   - Keep components modular

3. **State Management**
   - Use Zustand for global state
   - React Query for server state
   - useState for local state

4. **API Calls**
   - Always use service functions
   - Handle errors properly
   - Show loading states

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Make sure backend has CORS enabled for http://localhost:3000

### Issue: API Not Found
**Solution**: Check .env file and ensure backend is running

### Issue: OTP Not Received
**Solution**: Check backend logs - OTP is printed in development mode

### Issue: Images Not Loading
**Solution**: Check file paths and ensure backend uploads directory is accessible

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Deploy to Custom Server
1. Build the project
2. Copy `dist` folder to server
3. Configure nginx/apache
4. Set up SSL certificate

## 📄 License

Part of Project Violet - AI-Assisted Billboard Booking Platform

## 🤝 Contributing

This is a project submission. For educational purposes only.

## 📞 Support

Check the documentation files:
- Backend API: See backend/API_DOCUMENTATION.md
- Setup Guide: See backend/QUICK_START.md

---

**Built with ❤️ using React + Vite + Tailwind CSS**
