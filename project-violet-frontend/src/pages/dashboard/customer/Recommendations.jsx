import { Link } from 'react-router-dom';
import { FiZap, FiTarget, FiUsers, FiMapPin, FiEye, FiArrowRight, FiBookmark } from 'react-icons/fi';

const Recommendations = () => {
  // Dummy data simulating AI-matched billboards
  const recommendations = [
    {
      id: 'REC-01',
      name: 'Tech Hub Premium Digital',
      location: 'Silicon Valley, CA',
      matchScore: '98%',
      impressions: '120k/day',
      price: '8,500',
      audience: 'Tech Professionals, Commuters',
      reason: 'Historically high conversion rate for software products.',
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'REC-02',
      name: 'Downtown Financial District Board',
      location: 'Wall Street, NY',
      matchScore: '94%',
      impressions: '250k/day',
      price: '15,000',
      audience: 'Finance, High Net Worth',
      reason: 'Matches your previous successful campaign demographics.',
      image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'REC-03',
      name: 'Airport Approach LED',
      location: 'O\'Hare International, IL',
      matchScore: '89%',
      impressions: '300k/day',
      price: '12,000',
      audience: 'Business Travelers, Tourists',
      reason: 'Great visibility for B2B enterprise solutions.',
      image: 'https://images.unsplash.com/photo-1555436169-20e9068b5a03?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'REC-04',
      name: 'University Avenue Transit',
      location: 'Boston, MA',
      matchScore: '85%',
      impressions: '85k/day',
      price: '4,000',
      audience: 'Students, Young Adults',
      reason: 'Highly cost-effective for brand awareness pushes.',
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="card p-8 bg-gradient-to-br from-dark-900 to-dark-800 text-white border-none relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="text-accent-400 w-5 h-5" />
              <span className="text-accent-400 font-bold tracking-wider text-sm">VIOLET AI ENGINE</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Smart Match Results</h1>
            <p className="text-dark-300 max-w-xl">
              We analyzed your past campaigns and current market trends. Here are the top 4 billboard locations predicted to yield the highest ROI for your business.
            </p>
          </div>
          
          <div className="flex gap-4 text-sm font-medium">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
              <p className="text-dark-400 text-xs mb-1">Targeting</p>
              <div className="flex items-center gap-2"><FiTarget /> B2B Tech</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
              <p className="text-dark-400 text-xs mb-1">Budget focus</p>
              <div className="flex items-center gap-2"><FiUsers /> High Conversion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((board) => (
          <div key={board.id} className="card p-0 overflow-hidden flex flex-col group hover:border-primary-300 transition-colors">
            {/* Image & Match Score */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img 
                src={board.image} 
                alt={board.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-dark-900/80 to-transparent"></div>
              
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-dark-900 px-3 py-1.5 rounded-lg font-bold shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  {board.matchScore} Match
                </span>
              </div>

              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-xs font-bold text-primary-300 tracking-wider mb-1">{board.id}</p>
                <h3 className="text-xl font-bold">{board.name}</h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-dark-100">
                <div>
                  <p className="text-xs text-dark-500 uppercase font-medium mb-1 flex items-center gap-1"><FiMapPin className="w-3 h-3"/> Location</p>
                  <p className="font-medium text-dark-900">{board.location}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-500 uppercase font-medium mb-1 flex items-center gap-1"><FiEye className="w-3 h-3"/> Daily Traffic</p>
                  <p className="font-medium text-dark-900">{board.impressions}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-dark-500 uppercase font-medium mb-1 flex items-center gap-1"><FiTarget className="w-3 h-3"/> Primary Audience</p>
                  <p className="font-medium text-dark-900">{board.audience}</p>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="mb-6 flex-1 bg-primary-50 p-4 rounded-xl text-sm border border-primary-100">
                <p className="font-bold text-primary-700 mb-1 flex items-center gap-2">
                  <FiZap className="w-4 h-4"/> Why it's a match
                </p>
                <p className="text-primary-900/80">{board.reason}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-sm text-dark-500">Estimated Cost</p>
                  <p className="text-xl font-bold text-dark-900">₹{board.price} <span className="text-sm text-dark-400 font-normal">/day</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-ghost px-3 text-dark-500 hover:text-primary-600 tooltip" title="Save for later">
                    <FiBookmark className="w-5 h-5" />
                  </button>
                  <Link to={`/billboards/${board.id}`} className="btn btn-primary px-6">
                    Book Now <FiArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;