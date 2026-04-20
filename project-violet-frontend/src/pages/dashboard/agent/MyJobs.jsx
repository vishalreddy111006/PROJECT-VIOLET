import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiChevronRight } from 'react-icons/fi';

const MyJobs = () => {
  const jobs = [
    { id: '1', title: 'Vinyl Installation', location: '1540 Broadway, NY', date: 'Today, 5:00 PM', status: 'In Progress', payout: '1,500', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200' },
    { id: '2', title: 'Electrical Inspection', location: 'Highway 66 Board', date: 'Tomorrow, 10:00 AM', status: 'Pending', payout: '800', image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=200' },
    { id: '3', title: 'Maintenance Check', location: 'Metro Shelter #4', date: 'Oct 12, 2026', status: 'Completed', payout: '500', image: 'https://images.unsplash.com/photo-1555436169-20e9068b5a03?auto=format&fit=crop&q=80&w=200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">My Jobs</h1>
        <p className="text-dark-500 mt-1">Manage your active and completed tasks</p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link key={job.id} to={`/dashboard/agent/jobs/${job.id}`} className="card p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-primary-300 transition-colors group">
            <img src={job.image} alt={job.title} className="w-full sm:w-24 h-48 sm:h-24 rounded-xl object-cover" />
            
            <div className="flex-1 min-w-0 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-dark-900 truncate">{job.title}</h3>
                <span className={`badge ${job.status === 'Completed' ? 'badge-success' : job.status === 'In Progress' ? 'badge-primary' : 'badge-warning'}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-dark-500">
                <div className="flex items-center gap-1"><FiMapPin /> <span className="truncate">{job.location}</span></div>
                <div className="flex items-center gap-1"><FiClock /> <span>{job.date}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:pl-6 sm:border-l border-dark-100">
              <div className="text-left sm:text-right">
                <p className="text-xs text-dark-400 font-medium uppercase">Payout</p>
                <p className="font-bold text-lg text-primary-600">₹{job.payout}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dark-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
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