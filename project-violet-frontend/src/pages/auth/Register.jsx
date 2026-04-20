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
              <label className="block text-sm font-medium mb-2">First Name</label>
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
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  placeholder="Doe"
                  {...register('lastName')}
                  className={`input pl-12 ${errors.lastName ? 'input-error' : ''}`}
                />
              </div>
              {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName.message}</p>}
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
