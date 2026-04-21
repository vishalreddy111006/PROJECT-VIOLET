import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiChevronRight, FiAward, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const MyJobs = () => {
  // Dummy data representing current Agent performance from the Reliability Engine
  const agentStats = {
    reliabilityScore: 88, // 0-100 composite trust score [cite: 288]
    completedCount: 14,
    pendingRatings: 2
  };

  const jobs = [
    { 
      id: '1', 
      title: 'Vinyl Installation', 
      location: '1540 Broadway, NY', 
      date: 'Today, 5:00 PM', 
      status: 'In Progress', 
      payout: '1,500', 
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200' 
    },
    { 
      id: '2', 
      title: 'Electrical Inspection', 
      location: 'Highway 66 Board', 
      date: 'Tomorrow, 10:00 AM', 
      status: 'Pending', 
      payout: '800', 
      image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=200' 
    },
    { 
      id: '3', 
      title: 'Maintenance Check', 
      location: 'Metro Shelter #4', 
      date: 'Oct 12, 2026', 
      status: 'Completed', 
      payout: '500', 
      needsFeedback: true, // UX indicator for Algorithm 2 feedback loop [cite: 209]
      image: 'https://images.unsplash.com/photo-1555436169-20e9068b5a03?auto=format&fit=crop&q=80&w=200' 
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-success-600';
    if (score >= 70) return 'text-primary-600';
    return 'text-warning-600';
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Performance Hub - Reliability Engine Oversight  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-dark-900 to-dark-800 text-white border-none relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><FiAward size={100} /></div>
          <p className="text-dark-300 text-sm font-medium uppercase tracking-wider mb-1">Your Score</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold">{agentStats.reliabilityScore}</h2>
            <span className="text-dark-400 font-medium">/ 100</span>
          </div>
          <div className="mt-4 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${agentStats.reliabilityScore}%` }}
            ></div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-dark-200">
          <div className="p-3 bg-success/10 text-success-600 rounded-2xl"><FiCheckCircle size={24} /></div>
          <div>
            <p className="text-dark-500 text-sm">Completed Tasks</p>
            <p className="text-2xl font-bold text-dark-900">{agentStats.completedCount}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-dark-200">
          <div className="p-3 bg-warning/10 text-warning-600 rounded-2xl"><FiAlertCircle size={24} /></div>
          <div>
            <p className="text-dark-500 text-sm">Feedback Needed</p>
            <p className="text-2xl font-bold text-dark-900">{agentStats.pendingRatings}</p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-dark-900">Task Management</h1>
        <p className="text-dark-500 mt-1">Track and manage your active fieldwork</p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link 
            key={job.id} 
            to={`/dashboard/agent/jobs/${job.id}`} 
            className={`card p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-primary-300 transition-all group relative ${job.needsFeedback ? 'border-warning-300 bg-warning/5' : 'bg-white border-dark-200'}`}
          >
            {/* Urgent Feedback Indicator [cite: 209] */}
            {job.needsFeedback && (
              <div className="absolute -top-2 -left-2 bg-warning text-white text-[10px] font-black px-2 py-1 rounded shadow-sm flex items-center gap-1">
                <FiAlertCircle /> RATING REQUIRED
              </div>
            )}

            <img src={job.image} alt={job.title} className="w-full sm:w-24 h-48 sm:h-24 rounded-xl object-cover shadow-sm" />
            
            <div className="flex-1 min-w-0 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-dark-900 truncate group-hover:text-primary-600 transition-colors">{job.title}</h3>
                <span className={`badge ${
                  job.status === 'Completed' ? 'badge-success' : 
                  job.status === 'In Progress' ? 'badge-primary' : 'badge-warning'
                }`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-dark-500 font-medium">
                <div className="flex items-center gap-1.5"><FiMapPin className="text-primary-500" /> <span className="truncate">{job.location}</span></div>
                <div className="flex items-center gap-1.5"><FiClock className="text-dark-400" /> <span>{job.date}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:pl-6 sm:border-l border-dark-100">
              <div className="text-left sm:text-right">
                <p className="text-xs text-dark-400 font-bold uppercase tracking-tighter">Earnings</p>
                <p className="font-bold text-xl text-primary-600">₹{job.payout}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                <FiChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;