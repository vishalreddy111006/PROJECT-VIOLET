import { Link } from 'react-router-dom';
import { FiActivity, FiDollarSign, FiBookmark, FiCalendar, FiArrowRight, FiMapPin, FiSearch } from 'react-icons/fi';

const CustomerDashboard = () => {
  // Dummy data for customer stats
  const stats = [
    { label: 'Active Campaigns', value: '3', trend: 'Currently live', icon: FiActivity, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Spent', value: '₹1,25,000', trend: 'This year', icon: FiDollarSign, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Saved Boards', value: '12', trend: 'Ready to book', icon: FiBookmark, color: 'text-accent-600', bg: 'bg-accent-50' },
    { label: 'Pending Bookings', value: '1', trend: 'Awaiting approval', icon: FiCalendar, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  // Dummy data for active advertising campaigns
  const activeCampaigns = [
    { 
      id: 'BR-1042', 
      name: 'Downtown Times Square LED', 
      location: '1540 Broadway, NY', 
      endDate: 'Nov 15, 2026', 
      status: 'Live', 
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200' 
    },
    { 
      id: 'BR-1043', 
      name: 'Highway 66 Digital Board', 
      location: 'Los Angeles, CA', 
      endDate: 'Dec 31, 2026', 
      status: 'Live', 
      image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=200' 
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Customer Dashboard</h1>
          <p className="text-dark-500 mt-1">Welcome back! Here is an overview of your advertising campaigns.</p>
        </div>
        <Link to="/search" className="btn btn-primary">
          <FiSearch className="w-5 h-5" />
          Find Billboards
        </Link>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6 flex flex-col justify-between hover:border-primary-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-dark-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-dark-500 mb-1">{stat.label}</p>
                <p className="text-xs font-medium text-dark-400">{stat.trend}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Active Campaigns (Left Column) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-900">Your Live Campaigns</h2>
              <Link to="/dashboard/customer/bookings" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-dark-100 hover:border-primary-200 transition-colors">
                  <img 
                    src={campaign.image} 
                    alt={campaign.name} 
                    className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-success text-[10px] px-2 py-0.5">🟢 {campaign.status}</span>
                      <span className="text-xs font-bold text-dark-400">{campaign.id}</span>
                    </div>
                    <h3 className="font-bold text-dark-900 truncate">{campaign.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-dark-500 mt-1">
                      <FiMapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{campaign.location}</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-none border-dark-100 mt-2 sm:mt-0">
                    <p className="text-xs text-dark-500 uppercase font-medium">Ends On</p>
                    <p className="font-bold text-dark-900">{campaign.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations Hook (Right Column) */}
        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-primary-600 to-accent-600 text-white border-none relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20 backdrop-blur-sm">
                AI POWERED
              </span>
              <h2 className="text-2xl font-bold mb-2">Smart Recommendations</h2>
              <p className="text-primary-100 mb-6 text-sm leading-relaxed">
                Based on your previous bookings, our AI has found 4 high-traffic billboards that perfectly match your target audience.
              </p>
              <Link to="/dashboard/customer/recommendations" className="w-full btn bg-white text-primary-600 hover:bg-primary-50 border-none shadow-lg group">
                View Matches 
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;