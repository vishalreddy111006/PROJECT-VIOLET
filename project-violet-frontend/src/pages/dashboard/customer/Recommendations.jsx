import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiTarget, FiUsers, FiMapPin, FiEye, FiArrowRight, FiBookmark } from 'react-icons/fi';
import { billboardService } from '../../../services/billboardService'; // Adjust path based on your folder structure

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Calls the POST /api/billboards/recommendations route
        // You can pass targeting parameters in the body if needed
        const response = await billboardService.getRecommendations({});
        
        // Assuming your backend returns { success: true, recommendations: [...] }
        setRecommendations(response.recommendations || response.billboards || []);
      } catch (error) {
        console.error("Failed to load recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="card p-8 bg-gradient-to-br from-dark-900 to-dark-800 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="text-violet-400 w-5 h-5" />
              <span className="text-violet-400 font-bold tracking-wider text-sm">VIOLET AI ENGINE</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Smart Match Results</h1>
            <p className="text-gray-300 max-w-xl">
              We analyzed your past campaigns and current market trends. Here are the top billboard locations predicted to yield the highest ROI.
            </p>
          </div>
          
          <div className="flex gap-4 text-sm font-medium">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
              <p className="text-gray-400 text-xs mb-1">Targeting</p>
              <div className="flex items-center gap-2"><FiTarget /> AI Matched</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.length === 0 ? (
          <p className="text-gray-500 p-4">No recommendations available at this time.</p>
        ) : (
          recommendations.map((board) => (
            <div key={board._id} className="card p-0 overflow-hidden flex flex-col group hover:border-violet-300 transition-colors bg-white shadow-sm rounded-xl border">
              {/* Image & Match Score */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img 
                  // safely access the first image URL from the Mongoose array
                  src={board.images?.[0]?.url || 'https://via.placeholder.com/800x400?text=No+Image'} 
                  alt={board.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1.5 rounded-lg font-bold shadow-lg flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {board.matchScore || '95%'} Match
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{board.title}</h3>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1 flex items-center gap-1"><FiMapPin className="w-3 h-3"/> Location</p>
                    {/* Assuming location is stored as an object with a city property */}
                    <p className="font-medium text-gray-900">{board.location?.city || 'Location TBA'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1 flex items-center gap-1"><FiEye className="w-3 h-3"/> Type</p>
                    <p className="font-medium text-gray-900">{board.specifications?.type || 'Digital'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-sm text-gray-500">Estimated Cost</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{board.pricing?.pricePerDay?.toLocaleString() || 'N/A'} <span className="text-sm text-gray-400 font-normal">/day</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-colors">
                      <FiBookmark className="w-5 h-5" />
                    </button>
                    <Link to={`/billboards/${board._id}`} className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 flex items-center">
                      View Details <FiArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;