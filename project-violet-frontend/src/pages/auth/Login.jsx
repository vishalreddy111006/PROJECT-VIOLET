import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { authService } from '@/services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      
      toast.success('OTP sent successfully!');
      navigate('/verify-otp', {
        state: {
          phone: data.phone,
          email: data.email,
          purpose: 'login',
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
            </Link>
            <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
            <p className="text-dark-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex rounded-xl border-2 border-dark-200 p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-600 hover:bg-dark-50'
                }`}
              >
                Phone
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  loginMethod === 'email'
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-600 hover:bg-dark-50'
                }`}
              >
                Email
              </button>
            </div>

            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\+?[\d\s-()]+$/,
                        message: 'Invalid phone number',
                      },
                    })}
                    className={`input pl-12 ${errors.phone ? 'input-error' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-error text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`input pl-12 ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`input pl-12 ${errors.password ? 'input-error' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-primary-600 to-accent-600 p-12">
        <div className="h-full flex flex-col items-center justify-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="text-5xl">📱</span>
              </div>
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">
              Secure OTP Login
            </h2>
            <p className="text-primary-100 text-lg max-w-md">
              We'll send you a one-time password to verify your identity and keep your account secure.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
