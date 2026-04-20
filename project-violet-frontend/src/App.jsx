import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import Onboarding from './pages/auth/Onboarding'; // New Onboarding Page
import BillboardsPage from './pages/billboards/BillboardsPage';
import BillboardDetails from './pages/billboards/BillboardDetails';
import SearchResults from './pages/billboards/SearchResults';

// Dashboard Pages
import CustomerDashboard from './pages/dashboard/customer/CustomerDashboard';
import MyBookings from './pages/dashboard/customer/MyBookings';
import Recommendations from './pages/dashboard/customer/Recommendations';

import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import MyBillboards from './pages/dashboard/admin/MyBillboards';
import CreateBillboard from './pages/dashboard/admin/CreateBillboard';
import EditBillboard from './pages/dashboard/admin/EditBillboard';
import BookingRequests from './pages/dashboard/admin/BookingRequests';
import AdminVerification from './pages/dashboard/admin/AdminVerification';

import AgentDashboard from './pages/dashboard/agent/AgentDashboard';
import MyJobs from './pages/dashboard/agent/MyJobs';
import NearbyJobs from './pages/dashboard/agent/NearbyJobs';
import JobDetails from './pages/dashboard/agent/JobDetails';

import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            
            {/* Onboarding Route - Accessible after Login/OTP but before Dashboard */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />

            <Route path="/billboards" element={<BillboardsPage />} />
            <Route path="/billboards/:id" element={<BillboardDetails />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>

          {/* Customer Dashboard */}
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Dashboard */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="billboards" element={<MyBillboards />} />
            <Route path="billboards/create" element={<CreateBillboard />} />
            <Route path="billboards/edit/:id" element={<EditBillboard />} />
            <Route path="booking-requests" element={<BookingRequests />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Agent Dashboard */}
          <Route
            path="/dashboard/agent"
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="jobs" element={<MyJobs />} />
            <Route path="nearby" element={<NearbyJobs />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;