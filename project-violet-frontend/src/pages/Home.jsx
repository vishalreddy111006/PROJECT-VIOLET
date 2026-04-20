import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiMapPin,
  FiTrendingUp,
  FiCheckCircle,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';

const Home = () => {
  const { user } = useAuthStore();

  const features = [
    {
      icon: FiSearch,
      title: 'Smart Search',
      description: 'Find the perfect billboard with AI-powered recommendations',
    },
    {
      icon: FiMapPin,
      title: 'Location-Based',
      description: 'Discover billboards near your target audience',
    },
    {
      icon: FiTrendingUp,
      title: 'Data-Driven',
      description: 'Make informed decisions with traffic and visibility data',
    },
    {
      icon: FiCheckCircle,
      title: 'Verified Listings',
      description: 'All billboards are verified with AI-assisted validation',
    },
    {
      icon: FiUsers,
      title: 'Agent Network',
      description: 'Professional field agents handle installations',
    },
    {
      icon: FiZap,
      title: 'Quick Booking',
      description: 'Book and manage your campaigns in minutes',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Search & Discover',
      description: 'Browse our verified billboard listings or get personalized recommendations',
    },
    {
      number: '02',
      title: 'Book Your Space',
      description: 'Select dates, upload your ad content, and send a booking request',
    },
    {
      number: '03',
      title: 'Get Approved',
      description: 'Billboard owners review and approve your request',
    },
    {
      number: '04',
      title: 'Go Live',
      description: 'Our field agents install your ad and you start reaching customers',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg4djE0aC04eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container-custom relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight mb-6">
                Transform Your
                <span className="block text-accent-300">Advertising Game</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                AI-powered billboard booking platform that connects advertisers with
                premium locations and professional installation services.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link
                    to={`/dashboard/${user.role}`}
                    className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
                      Get Started
                    </Link>
                    <Link to="/billboards" className="btn btn-lg btn-outline border-white text-white hover:bg-white/10">
                      Browse Billboards
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-primary-200 text-sm">Billboards</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">50+</div>
                  <div className="text-primary-200 text-sm">Cities</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">1000+</div>
                  <div className="text-primary-200 text-sm">Happy Clients</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-primary-600 rounded-3xl rotate-6 opacity-20"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <div className="bg-white/90 rounded-2xl p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-dark-900 font-semibold">Prime Location</span>
                      <span className="badge badge-success">Available</span>
                    </div>
                    <div className="h-40 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl mb-4"></div>
                    <div className="flex items-center justify-between text-dark-700">
                      <span className="text-sm">₹5,000/day</span>
                      <button className="text-primary-600 font-medium text-sm">View Details →</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/90 rounded-xl p-4">
                      <div className="text-2xl font-bold text-dark-900">AI</div>
                      <div className="text-sm text-dark-600">Verified</div>
                    </div>
                    <div className="bg-white/90 rounded-xl p-4">
                      <div className="text-2xl font-bold text-dark-900">24/7</div>
                      <div className="text-sm text-dark-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-display font-bold mb-4"
            >
              Why Choose Project Violet?
            </motion.h2>
            <p className="text-dark-600 text-lg max-w-2xl mx-auto">
              Experience the future of billboard booking with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card card-hover text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-dark-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-dark-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-display font-bold mb-4"
            >
              How It Works
            </motion.h2>
            <p className="text-dark-600 text-lg max-w-2xl mx-auto">
              Get your billboard campaign live in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="card text-center">
                  <div className="text-6xl font-display font-bold text-primary-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-dark-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-primary-200"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using Project Violet to amplify their message
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn btn-lg bg-white text-primary-700 hover:bg-primary-50">
                Create Free Account
              </Link>
              <Link to="/billboards" className="btn btn-lg btn-outline border-white text-white hover:bg-white/10">
                Explore Billboards
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
