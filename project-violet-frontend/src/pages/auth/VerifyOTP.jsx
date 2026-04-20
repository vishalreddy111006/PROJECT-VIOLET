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

  const { phone, purpose } = location.state || {};

  // Redirect if no phone number is present in state
  useEffect(() => {
    if (!phone) {
      toast.error("Session expired. Please login again.");
      navigate('/login');
    }
  }, [phone, navigate]);

  // Countdown Timer Logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    // Only take the last character entered
    const val = value.slice(-1);
    if (!/^\d*$/.test(val)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the full 6-digit code');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.verifyOTP({ phone, otp: otpString, purpose });
      
      // Update Global Auth State
      setAuth(response.user, response.token);
      
      toast.success('Identity verified!');
      
      // Redirect to the new Onboarding flow
      navigate('/onboarding');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await authService.resendOTP({ phone, purpose });
      toast.success('A new code has been sent!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0').focus();
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again later.');
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
        <div className="card text-center p-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-200">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </Link>
          
          <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">Verify OTP</h1>
          <p className="text-dark-600 mb-8">
            We've sent a 6-digit verification code to<br />
            <span className="font-bold text-dark-900">{phone}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-2 sm:gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 border-dark-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                  aria-label={`OTP Digit ${index + 1}`}
                />
              ))}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full py-4 text-lg shadow-lg shadow-primary-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : 'Verify & Continue'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-100">
            {countdown > 0 ? (
              <p className="text-dark-500 text-sm">
                Didn't receive the code? Resend in <span className="font-bold text-dark-900">{countdown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
              >
                {resending ? 'Sending Code...' : 'Resend Verification Code'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;