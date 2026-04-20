#!/bin/bash

echo "========================================="
echo "  Project Violet Frontend File Generator"
echo "========================================="
echo ""

# Create Register page
cat > src/pages/auth/Register.jsx << 'REGEOF'
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { authService } from '@/services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const defaultRole = searchParams.get('role') || 'customer';

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: defaultRole }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.register(data);
      toast.success('Registration successful! OTP sent.');
      navigate('/verify-otp', {
        state: {
          phone: data.phone,
          email: data.email,
          purpose: 'registration',
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-accent-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
            </Link>
            <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
            <p className="text-dark-600">Join Project Violet today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                  className={`input pl-12 ${errors.name ? 'input-error' : ''}`}
                />
              </div>
              {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  className={`input pl-12 ${errors.email ? 'input-error' : ''}`}
                />
              </div>
              {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^\+?[\d\s-()]+$/, message: 'Invalid phone' },
                  })}
                  className={`input pl-12 ${errors.phone ? 'input-error' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className={`input pl-12 ${errors.password ? 'input-error' : ''}`}
                />
              </div>
              {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">I am a</label>
              <select {...register('role')} className="input">
                <option value="customer">Customer (Advertiser)</option>
                <option value="admin">Admin (Billboard Owner)</option>
                <option value="agent">Agent (Field Worker)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
REGEOF

echo "✓ Created Register.jsx"

# Create VerifyOTP page
cat > src/pages/auth/VerifyOTP.jsx << 'OTPEOF'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const { phone, email, purpose } = location.state || {};

  useEffect(() => {
    if (!phone) navigate('/login');
  }, [phone, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.verifyOTP({ phone, otp: otpString, purpose });
      setAuth(response.user, response.token);
      toast.success('Verified successfully!');
      navigate(`/dashboard/${response.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await authService.resendOTP({ phone, purpose });
      toast.success('OTP sent successfully!');
      setCountdown(60);
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-accent-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">Verify OTP</h1>
          <p className="text-dark-600 mb-8">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold">{phone}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-dark-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                />
              ))}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6">
            {countdown > 0 ? (
              <p className="text-dark-600">Resend OTP in {countdown}s</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
OTPEOF

echo "✓ Created VerifyOTP.jsx"

# Create placeholder pages
cat > src/pages/billboards/BillboardsPage.jsx << 'EOF'
import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';

const BillboardsPage = () => {
  return (
    <div className="container-custom py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-display font-bold mb-8">Browse Billboards</h1>
        <div className="card text-center py-20">
          <FiGrid className="w-16 h-16 mx-auto mb-4 text-primary-600" />
          <h2 className="text-2xl font-semibold mb-2">Billboards Page</h2>
          <p className="text-dark-600">Billboard listing and filtering coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
};
export default BillboardsPage;
EOF

cat > src/pages/billboards/BillboardDetails.jsx << 'EOF'
const BillboardDetails = () => <div className="container-custom py-12"><h1 className="text-4xl font-bold">Billboard Details</h1></div>;
export default BillboardDetails;
EOF

cat > src/pages/billboards/SearchResults.jsx << 'EOF'
const SearchResults = () => <div className="container-custom py-12"><h1 className="text-4xl font-bold">Search Results</h1></div>;
export default SearchResults;
EOF

# Create dashboard pages
cat > src/pages/dashboard/customer/CustomerDashboard.jsx << 'EOF'
const CustomerDashboard = () => <div><h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1><p>Welcome to your dashboard!</p></div>;
export default CustomerDashboard;
EOF

cat > src/pages/dashboard/customer/MyBookings.jsx << 'EOF'
const MyBookings = () => <div><h1 className="text-3xl font-bold mb-6">My Bookings</h1></div>;
export default MyBookings;
EOF

cat > src/pages/dashboard/customer/Recommendations.jsx << 'EOF'
const Recommendations = () => <div><h1 className="text-3xl font-bold mb-6">Recommendations</h1></div>;
export default Recommendations;
EOF

cat > src/pages/dashboard/admin/AdminDashboard.jsx << 'EOF'
const AdminDashboard = () => <div><h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1></div>;
export default AdminDashboard;
EOF

cat > src/pages/dashboard/admin/MyBillboards.jsx << 'EOF'
const MyBillboards = () => <div><h1 className="text-3xl font-bold mb-6">My Billboards</h1></div>;
export default MyBillboards;
EOF

cat > src/pages/dashboard/admin/CreateBillboard.jsx << 'EOF'
const CreateBillboard = () => <div><h1 className="text-3xl font-bold mb-6">Create Billboard</h1></div>;
export default CreateBillboard;
EOF

cat > src/pages/dashboard/admin/EditBillboard.jsx << 'EOF'
const EditBillboard = () => <div><h1 className="text-3xl font-bold mb-6">Edit Billboard</h1></div>;
export default EditBillboard;
EOF

cat > src/pages/dashboard/admin/BookingRequests.jsx << 'EOF'
const BookingRequests = () => <div><h1 className="text-3xl font-bold mb-6">Booking Requests</h1></div>;
export default BookingRequests;
EOF

cat > src/pages/dashboard/admin/AdminVerification.jsx << 'EOF'
const AdminVerification = () => <div><h1 className="text-3xl font-bold mb-6">Verification</h1></div>;
export default AdminVerification;
EOF

cat > src/pages/dashboard/agent/AgentDashboard.jsx << 'EOF'
const AgentDashboard = () => <div><h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1></div>;
export default AgentDashboard;
EOF

cat > src/pages/dashboard/agent/MyJobs.jsx << 'EOF'
const MyJobs = () => <div><h1 className="text-3xl font-bold mb-6">My Jobs</h1></div>;
export default MyJobs;
EOF

cat > src/pages/dashboard/agent/NearbyJobs.jsx << 'EOF'
const NearbyJobs = () => <div><h1 className="text-3xl font-bold mb-6">Nearby Jobs</h1></div>;
export default NearbyJobs;
EOF

cat > src/pages/dashboard/agent/JobDetails.jsx << 'EOF'
const JobDetails = () => <div><h1 className="text-3xl font-bold mb-6">Job Details</h1></div>;
export default JobDetails;
EOF

cat > src/pages/dashboard/Profile.jsx << 'EOF'
const Profile = () => <div><h1 className="text-3xl font-bold mb-6">Profile</h1></div>;
export default Profile;
EOF

cat > src/pages/dashboard/Settings.jsx << 'EOF'
const Settings = () => <div><h1 className="text-3xl font-bold mb-6">Settings</h1></div>;
export default Settings;
EOF

echo "✓ Created all page components"
echo ""
echo "========================================="
echo "  All Files Generated Successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. npm install"
echo "2. cp .env.example .env"
echo "3. npm run dev"
echo ""
