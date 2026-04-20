import { FiTrendingUp, FiGrid, FiCalendar, FiUsers, FiArrowRight, FiActivity, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Dummy data for top stats
  const stats = [
    { label: 'Monthly Revenue', value: '₹4,50,000', trend: '+12.5% from last month', isGood: true, icon: FiTrendingUp, iconColor: 'text-success', bgColor: 'bg-success/10' },
    { label: 'Active Billboards', value: '45', trend: 'Out of 50 total boards', isGood: true, icon: FiGrid, iconColor: 'text-primary-600', bgColor: 'bg-primary-50' },
    { label: 'Pending Bookings', value: '12', trend: 'Needs your attention', isGood: false, icon: FiCalendar, iconColor: 'text-warning', bgColor: 'bg-warning/10' },
    { label: 'Total Advertisers', value: '128', trend: '+8 new this month', isGood: true, icon: FiUsers, iconColor: 'text-accent-600', bgColor: 'bg-accent-50' },
  ];

  // Dummy data for recent activity
  const recentActivity = [
    { id: 1, title: 'New booking request', desc: 'Sarah Jenkins requested Downtown LED', time: '2 hours ago', icon: FiClock, color: 'text-warning', bg: 'bg-warning/10' },
    { id: 2, title: 'Payment received', desc: '₹75,000 from Starlight Media', time: '5 hours ago', icon: FiCheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { id: 3, title: 'Billboard status changed', desc: 'Metro Transit #4 marked as Maintenance', time: '1 day ago', icon: FiActivity, color: 'text-primary-600', bg: 'bg-primary-50' },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Dashboard Overview</h1>
        <p className="text-dark-500 mt-1">Welcome back, Admin. Here is what is happening today.</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 flex flex-col justify-between hover:border-primary-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-dark-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-dark-500 mb-2">{stat.label}</p>
                <p className={`text-xs font-medium ${stat.isGood ? 'text-success' : 'text-warning'}`}>
                  {stat.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Quick Actions (Left/Main Column) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-dark-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/dashboard/admin/billboards/create" className="p-4 border-2 border-dashed border-primary-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                  <FiGrid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900">Add Billboard</h3>
                  <p className="text-xs text-dark-500 mt-1">List a new inventory</p>
                </div>
              </Link>
              
              <Link to="/dashboard/admin/booking-requests" className="p-4 border-2 border-dashed border-warning/30 rounded-xl hover:border-warning hover:bg-warning/10 transition-all flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning-700 group-hover:scale-110 transition-transform">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-dark-900">Review Bookings</h3>
                  <p className="text-xs text-dark-500 mt-1">12 pending requests</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity (Right Column) */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-dark-900">Recent Activity</h2>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-dark-900">{activity.title}</h4>
                    <p className="text-sm text-dark-500 mt-0.5">{activity.desc}</p>
                    <p className="text-xs text-dark-400 mt-1 font-medium">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;