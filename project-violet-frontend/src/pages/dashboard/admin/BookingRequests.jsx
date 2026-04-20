import { useState } from 'react';
import { FiCheck, FiX, FiCalendar, FiUser, FiMapPin, FiClock } from 'react-icons/fi';

const BookingRequests = () => {
  // Dummy data simulating incoming booking requests
  const [requests, setRequests] = useState([
    {
      id: 'BR-1042',
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
      id: 'BR-1044',
      billboardName: 'Metro Transit Shelter #4',
      location: 'Chicago, IL',
      clientName: 'Emma Watson',
      clientCompany: 'Local Bakery Co.',
      startDate: 'Sep 01, 2026',
      endDate: 'Sep 15, 2026',
      amount: '15,000',
      status: 'rejected',
      image: 'https://images.unsplash.com/photo-1555436169-20e9068b5a03?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  // Functions to simulate approving/rejecting
  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
    // In the future, this is where we will tell the backend to update the database!
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge badge-success">Approved</span>;
      case 'rejected': return <span className="badge badge-error">Rejected</span>;
      default: return <span className="badge badge-warning flex items-center gap-1"><FiClock className="w-3 h-3"/> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Booking Requests</h1>
        <p className="text-dark-500 mt-1">Review and manage incoming billboard reservations</p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="card p-4 sm:p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center hover:border-primary-200 transition-colors">
            
            {/* Billboard Info & Image */}
            <div className="flex items-center gap-4 w-full xl:w-1/3">
              <img 
                src={request.image} 
                alt="Billboard" 
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary-600 mb-1">{request.id}</p>
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
                <p className="text-xs text-dark-500 font-medium uppercase tracking-wider">Client</p>
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-dark-400" />
                  <span className="font-medium">{request.clientName}</span>
                </div>
                <p className="text-sm text-dark-500 pl-6">{request.clientCompany}</p>
              </div>
              
              <div className="flex-1 space-y-1">
                <p className="text-xs text-dark-500 font-medium uppercase tracking-wider">Duration</p>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-dark-400" />
                  <span className="font-medium text-sm">{request.startDate}</span>
                </div>
                <p className="text-sm text-dark-500 pl-6">to {request.endDate}</p>
              </div>
            </div>

            {/* Price, Status & Actions */}
            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-auto xl:min-w-[150px] gap-4">
              <div className="text-left xl:text-right">
                <p className="text-xs text-dark-500 font-medium uppercase tracking-wider mb-1">Total Amount</p>
                <p className="font-bold text-lg text-dark-900">₹{request.amount}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {request.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors tooltip"
                      title="Reject Request"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="p-2 rounded-lg text-success hover:bg-success/10 bg-success/5 transition-colors tooltip"
                      title="Approve Request"
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                  </>
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