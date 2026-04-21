import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { FiMapPin, FiNavigation, FiTarget, FiRefreshCw } from 'react-icons/fi';
import L from 'leaflet';
import { jobService } from '../../../services/jobService';

// Custom marker icon for billboards
const billboardIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991165.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const NearbyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [agentPos, setAgentPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNearbyJobs = async (lat, lng) => {
    setIsRefreshing(true);
    try {
      const response = await jobService.getNearbyJobs(lat, lng);
      
      console.log("RAW API RESPONSE:", response);

      let extractedJobs = [];
      
      if (Array.isArray(response)) {
        extractedJobs = response;
      } else if (response && Array.isArray(response.jobs)) {
        extractedJobs = response.jobs;
      } else if (response?.data && Array.isArray(response.data.jobs)) {
        extractedJobs = response.data.jobs; 
      } else if (response?.data?.data && Array.isArray(response.data.data.jobs)) {
        extractedJobs = response.data.data.jobs;
      }

      console.log("EXTRACTED JOBS ARRAY:", extractedJobs);
      
      setJobs(extractedJobs); 
      
    } catch (err) {
      console.error("Geospatial fetch failed:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setAgentPos([latitude, longitude]);
        fetchNearbyJobs(latitude, longitude);
      },
      (err) => console.error("GPS Access Denied", err),
      { enableHighAccuracy: true }
    );
  }, []);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p className="text-dark-500 font-medium italic">Initializing GPS Radar...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Agent Dispatch Map</h1>
          <p className="text-dark-500 mt-1">Maintenance tasks within your 6km active zone</p>
        </div>
        <button 
          onClick={() => fetchNearbyJobs(agentPos[0], agentPos[1])}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
          Refresh Radar
        </button>
      </div>

      <div className="w-full h-[450px] rounded-3xl overflow-hidden border border-dark-200 shadow-inner relative z-0">
        {agentPos && (
          <MapContainer center={agentPos} zoom={14} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={agentPos}>
              <Popup><b>Your Current Location</b><br/>Radar scanning active.</Popup>
            </Marker>

            <Circle 
              center={agentPos} 
              radius={6000} 
              pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.1, weight: 1 }} 
            />

            {jobs.map((job) => {
              const lat = job.location?.coordinates[1] || 0;
              const lng = job.location?.coordinates[0] || 0;
              const title = job.billboardId?.title || `${job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)} Task`;

              return (
                <Marker 
                  key={job._id} 
                  position={[lat, lng]}
                  icon={billboardIcon}
                >
                  <Popup>
                    <div className="p-1 text-center">
                      <p className="font-bold text-dark-900 mb-1">{title}</p>
                      <p className="text-xs text-primary-600 font-bold mb-2">₹{job.payment?.amount || 0} Payout</p>
                      <Link 
                        to={`/dashboard/agent/jobs/${job._id}`}
                        className="block w-full text-center bg-primary-600 text-white text-xs py-2 px-4 rounded font-bold hover:bg-primary-700"
                      >
                        Claim Job
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-dark-200 text-dark-400">
            <FiTarget className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No maintenance tasks found in your immediate vicinity.</p>
          </div>
        ) : (
          jobs.map((job) => {
            const title = job.billboardId?.title || `${job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)} Task`;
            const distanceKm = (job.distance / 1000).toFixed(2);

            return (
              <div key={job._id} className="card p-5 hover:shadow-xl transition-all border-l-4 border-l-primary-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="badge badge-primary uppercase tracking-wider text-xs">{job.jobType}</span>
                  <p className="font-bold text-dark-900 text-lg">₹{job.payment?.amount || 0}</p>
                </div>
                <h3 className="font-bold text-dark-900 text-lg mb-2">{title}</h3>
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-start gap-2 text-sm text-dark-500">
                    <FiMapPin className="text-primary-500 mt-1 flex-shrink-0" /> 
                    <span className="line-clamp-2">{job.location?.address || 'Location unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-dark-500 font-bold">
                    <FiNavigation className="text-success" /> {distanceKm} km away
                  </div>
                </div>
                <Link to={`/dashboard/agent/jobs/${job._id}`} className="btn btn-primary w-full shadow-lg shadow-primary-100 mt-auto">
                  Claim Task
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NearbyJobs;