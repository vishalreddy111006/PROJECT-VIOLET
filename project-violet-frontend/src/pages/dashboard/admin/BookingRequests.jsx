import { useState } from 'react';
import { FiCheck, FiX, FiCalendar, FiUser, FiMapPin, FiClock, FiStar, FiCheckCircle } from 'react-icons/fi';
import FeedbackScale from '../../../components/common/FeedbackScale';

const BookingRequests = () => {
  // Updated Dummy data to include completed jobs for the Reliability Engine loop
  const [requests, setRequests] = useState([
    {
      id: 'BR-1042',
      agentId: 'AGT-772',
      billboardName: 'Downtown Times Square LED',
      location: '1540 Broadway, NY',
      clientName: 'Sarah Jenkins',
      clientCompany: 'TechFlow Inc.',
      startDate: 'Oct 15, 2026',
      endDate: 'Nov 15, 2026',
      amount: '150,000',
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'BR-1043',
      agentId: 'AGT-881',
      billboardName: 'Highway 66 Digital Board',
      location: 'Los Angeles, CA',
      clientName: 'Michael Chen',
      clientCompany: 'Starlight Media',
      startDate: 'Dec 01, 2026',
      endDate: 'Dec 31, 2026',
      amount: '75,000',
      status: 'approved',
      image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'BR-COMP-01',
      agentId: 'AGT-990',
      agentName: 'Vikram Singh',
      billboardName: 'Metro Transit Shelter #4',
      location: 'Chicago, IL',
      clientName: 'Emma Watson',
      clientCompany: 'Local Bakery Co.',
      startDate: 'Sep 01, 2026',
      endDate: 'Sep 15, 2026',
      amount: '15,000',
      status: 'completed',
      hasRatedAgent: false, // Prevents double-scoring in Reliability Engine
      image: 'https://images.unsplash.com/photo-1555436169-20e9068b5a03?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  const [activeReview, setActiveReview] = useState(null);

  // Reliability Engine Handler: Processes 1-10 rating for Field Agents
  const handleAgentRating = async (rating, comment) => {
    const payload = {
      targetType: 'Agent',
      targetId: activeReview.agentId,
      contextModel: 'Job',
      contextId: activeReview.id,
      rating: rating,
      comment: comment
    };

    console.log("Reliability Engine: Updating Agent Score...", payload);
    
    // Simulate API update
    setRequests(requests.map(req => 
      req.id === activeReview.id ? { ...req, hasRatedAgent: true } : req
    ));
    
    alert(`Feedback submitted! ${activeReview.agentName}'s Reliability Score has been adjusted.`);
    setActiveReview(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge badge-success px-3 py-1">Approved</span>;
      case 'rejected': return <span className="badge badge-error px-3 py-1">Rejected</span>;
      case 'completed': return <span className="badge bg-success/10 text-success-700 px-3 py-1 flex items-center gap-1 font-bold"><FiCheckCircle className="w-3 h-3"/> Maintenance Done</span>;
      default: return <span className="badge badge-warning px-3 py-1 flex items-center gap-1"><FiClock className="w-3 h-3"/> Pending Approval</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto relative">
      
      {/* Reliability Feedback Modal Overlay */}
      {activeReview && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="animate-scale-in w-full max-w-md">
            <FeedbackScale 
              targetName={`Agent ${activeReview.agentName}`} 
              onSubmit={handleAgentRating} 
            />
            <button 
              onClick={() => setActiveReview(null)}
              className="w-full mt-4 text-white/70 hover:text-white text-sm font-medium underline"
            >
              Close without rating
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Campaign Oversight</h1>
        <p className="text-dark-500 mt-1">Review reservations and audit completed maintenance tasks</p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className={`card p-4 sm:p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center transition-all ${request.status === 'completed' && !request.hasRatedAgent ? 'border-primary-300 bg-primary-50/30' : 'hover:border-primary-200'}`}>
            
            {/* Billboard Info & Image */}
            <div className="flex items-center gap-4 w-full xl:w-1/3">
              <img 
                src={request.image} 
                alt="Billboard" 
                className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary-600 mb-1 tracking-widest uppercase">{request.id}</p>
                <h3 className="font-bold text-dark-900 truncate">{request.billboardName}</h3>
                <div className="flex items-center gap-1 text-sm text-dark-500 mt-1">
                  <FiMapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{request.location}</span>
                </div>
              </div>
            </div>

            {/* Client & Date Info */}
            <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-1/2 xl:px-6 xl:border-x border-dark-100">
              <div className="flex-1 space-y-1">
                <p className="text-xs text-dark-500 font-bold uppercase tracking-tighter">Client</p>
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-dark-400" />
                  <span className="font-medium text-dark-800">{request.clientName}</span>
                </div>
                <p className="text-sm text-dark-400 pl-6">{request.clientCompany}</p>
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-xs text-dark-500 font-bold uppercase tracking-tighter">Timeline</p>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-dark-400" />
                  <span className="font-medium text-sm text-dark-800">{request.startDate}</span>
                </div>
                <p className="text-sm text-dark-400 pl-6">to {request.endDate}</p>
              </div>
            </div>

            {/* Price, Status & Actions */}
            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-auto xl:min-w-[180px] gap-4">
              <div className="text-left xl:text-right">
                <p className="text-xs text-dark-500 font-bold uppercase tracking-tighter mb-1">Contract Total</p>
                <p className="font-bold text-xl text-dark-900">₹{request.amount}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {request.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="p-2 rounded-lg text-error hover:bg-error/10 border border-transparent hover:border-error/20 transition-all"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="p-2 rounded-lg text-success hover:bg-success/10 border border-transparent hover:border-success/20 transition-all"
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                  </>
                ) : request.status === 'completed' && !request.hasRatedAgent ? (
                  <button 
                    onClick={() => setActiveReview(request)}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 shadow-md shadow-primary-200 transition-all"
                  >
                    <FiStar className="fill-white" /> Rate Agent
                  </button>
                ) : (
                  getStatusBadge(request.status)
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequests;