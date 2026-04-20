import { Link } from 'react-router-dom';
import { FiDollarSign, FiBriefcase, FiCheckCircle, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';

const AgentDashboard = () => {
  const stats = [
    { label: "Today's Earnings", value: '₹3,500', icon: FiDollarSign, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Active Tasks', value: '2', icon: FiBriefcase, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Completed (Month)', value: '45', icon: FiCheckCircle, color: 'text-accent-600', bg: 'bg-accent-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Agent Dashboard</h1>
        <p className="text-dark-500 mt-1">Welcome back! You have 2 pending tasks today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-dark-500">{stat.label}</p>
                <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Task Highlight */}
        <div className="card p-6 border-l-4 border-l-primary-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="badge badge-warning mb-2">UPCOMING TASK</span>
              <h2 className="text-xl font-bold text-dark-900">Vinyl Installation</h2>
            </div>
            <p className="font-bold text-primary-600 text-lg">₹1,500</p>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-dark-600">
              <FiMapPin className="w-4 h-4" />
              <span>Downtown Times Square LED</span>
            </div>
            <div className="flex items-center gap-2 text-dark-600">
              <FiClock className="w-4 h-4" />
              <span>Due today by 5:00 PM</span>
            </div>
          </div>
          <Link to="/dashboard/agent/jobs/1" className="btn btn-primary w-full">
            View Job Details
          </Link>
        </div>

        {/* Quick Action to Find Work */}
        <div className="card p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary-50 to-accent-50 border-none">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-600 mb-4">
            <FiMapPin className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-dark-900 mb-2">Looking for work?</h2>
          <p className="text-dark-500 mb-6">There are 12 unassigned jobs in your 10km radius.</p>
          <Link to="/dashboard/agent/nearby" className="btn btn-primary">
            Find Nearby Jobs <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;