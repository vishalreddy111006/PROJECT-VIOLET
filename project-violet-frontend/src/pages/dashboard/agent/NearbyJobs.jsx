import { Link } from 'react-router-dom';
import { FiMapPin, FiNavigation } from 'react-icons/fi';

const NearbyJobs = () => {
  const availableJobs = [
    { id: '101', title: 'Vinyl Teardown', location: 'Central Park West', distance: '1.2 km away', payout: '1,200', type: 'Labor' },
    { id: '102', title: 'Screen Calibration', location: 'Times Square Screen 5', distance: '2.5 km away', payout: '2,000', type: 'Technical' },
    { id: '103', title: 'Photo Verification', location: 'Brooklyn Bridge Board', distance: '4.1 km away', payout: '300', type: 'Quick Task' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Nearby Jobs</h1>
          <p className="text-dark-500 mt-1">Available tasks in your area ready to be claimed</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-dark-200 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <span className="text-sm font-medium text-dark-700">Live Tracking On</span>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-64 bg-dark-100 rounded-2xl border border-dark-200 flex flex-col items-center justify-center text-dark-400">
        <FiMapPin className="w-8 h-8 mb-2" />
        <p>Interactive Map Integration Here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableJobs.map((job) => (
          <div key={job.id} className="card p-5 hover:shadow-xl transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className="badge bg-dark-100 text-dark-700">{job.type}</span>
              <p className="font-bold text-primary-600 text-lg">₹{job.payout}</p>
            </div>
            <h3 className="font-bold text-dark-900 text-lg mb-2">{job.title}</h3>
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <FiMapPin className="w-4 h-4" /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-500">
                <FiNavigation className="w-4 h-4" /> {job.distance}
              </div>
            </div>
            <Link to={`/dashboard/agent/jobs/${job.id}`} className="btn btn-outline w-full">
              View & Claim
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyJobs;