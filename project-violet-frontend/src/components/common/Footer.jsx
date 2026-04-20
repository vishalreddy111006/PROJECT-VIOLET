import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Project Violet</h3>
                <p className="text-xs text-dark-400">Billboard Booking</p>
              </div>
            </div>
            <p className="text-dark-400 text-sm">
              AI-Assisted Digital Billboard Booking & Field Agent Coordination Platform
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/billboards" className="text-dark-400 hover:text-white transition-colors text-sm">
                  Browse Billboards
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-dark-400 hover:text-white transition-colors text-sm">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-dark-400 hover:text-white transition-colors text-sm">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div>
            <h4 className="font-semibold mb-4">For Business</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=admin" className="text-dark-400 hover:text-white transition-colors text-sm">
                  List Your Billboard
                </Link>
              </li>
              <li>
                <Link to="/register?role=agent" className="text-dark-400 hover:text-white transition-colors text-sm">
                  Become an Agent
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <FiMail className="w-4 h-4" />
                support@projectviolet.com
              </li>
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <FiPhone className="w-4 h-4" />
                +91 1234567890
              </li>
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <FiMapPin className="w-4 h-4" />
                India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 text-center">
          <p className="text-dark-400 text-sm">
            © {new Date().getFullYear()} Project Violet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
