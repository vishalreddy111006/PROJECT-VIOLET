import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/dashboard/${user.role}`;
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-dark-100">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold gradient-text">
                Project Violet
              </h1>
              <p className="text-xs text-dark-500">Billboard Booking</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/billboards"
              className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Billboards
            </Link>
            <Link
              to="/search"
              className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
            >
              Search
            </Link>

            {token && user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="text-dark-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <Link
                    to={`${getDashboardPath()}/profile`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-dark-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl hover:bg-error/10 hover:text-error transition-colors"
                    title="Logout"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-dark-100"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-dark-100"
          >
            <div className="flex flex-col gap-3">
              <Link
                to="/billboards"
                className="px-4 py-2 rounded-xl hover:bg-dark-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Billboards
              </Link>
              <Link
                to="/search"
                className="px-4 py-2 rounded-xl hover:bg-dark-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>

              {token && user ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="px-4 py-2 rounded-xl hover:bg-dark-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={`${getDashboardPath()}/profile`}
                    className="px-4 py-2 rounded-xl hover:bg-dark-100 transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl hover:bg-error/10 hover:text-error transition-colors text-left flex items-center gap-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
