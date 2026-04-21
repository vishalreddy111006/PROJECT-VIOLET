import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FiHome,
  FiGrid,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiBriefcase,
  FiShoppingCart 
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { path: '', icon: FiHome, label: 'Dashboard', end: true },
      { path: 'profile', icon: FiUser, label: 'Profile' },
      { path: 'settings', icon: FiSettings, label: 'Settings' },
    ];

    if (user?.role === 'customer') {
      return [
        { path: '', icon: FiHome, label: 'Dashboard', end: true },
        { path: 'bookings', icon: FiCalendar, label: 'My Bookings' },
        { path: 'recommendations', icon: FiGrid, label: 'Recommendations' },
        { path: 'cart', icon: FiShoppingCart, label: 'Campaign Cart' },
        ...baseItems.slice(1),
      ];
    }

    if (user?.role === 'admin') {
      return [
        { path: '', icon: FiHome, label: 'Dashboard', end: true },
        { path: 'billboards', icon: FiGrid, label: 'My Billboards' },
        { path: 'billboards/create', icon: FiPlusCircle, label: 'Add Billboard' },
        { path: 'booking-requests', icon: FiCalendar, label: 'Booking Requests' },
        // Verification removed as onboarding is now fully autonomous
        ...baseItems.slice(1),
      ];
    }

    if (user?.role === 'agent') {
      return [
        { path: '', icon: FiHome, label: 'Dashboard', end: true },
        { path: 'jobs', icon: FiBriefcase, label: 'My Jobs' },
        { path: 'nearby', icon: FiMapPin, label: 'Nearby Jobs' },
        ...baseItems.slice(1),
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();
  const basePath = `/dashboard/${user?.role}`;

  const isActive = (path, end = false) => {
    if (end) {
      return location.pathname === `${basePath}${path ? `/${path}` : ''}`;
    }
    return location.pathname.startsWith(`${basePath}/${path}`);
  };

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-dark-200">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-dark-100"
          >
            {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-display font-bold text-lg">Project Violet</span>
          </Link>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-30 h-screen
            w-72 bg-white border-r border-dark-200
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 p-6 border-b border-dark-200">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">Project Violet</h2>
                <p className="text-xs text-dark-500 capitalize">{user?.role} Dashboard</p>
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-dark-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{user?.name}</h3>
                  <p className="text-sm text-dark-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto scrollbar-custom">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.end);

                  return (
                    <li key={item.path}>
                      <Link
                        to={`${basePath}${item.path ? `/${item.path}` : ''}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl
                          font-medium transition-all duration-200
                          ${
                            active
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-dark-700 hover:bg-dark-100'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-dark-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 font-medium transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;