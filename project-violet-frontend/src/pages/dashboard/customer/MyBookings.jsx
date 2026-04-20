import { FiCalendar, FiMapPin, FiDownload, FiExternalLink, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  // Dummy data simulating the customer's booking history
  const bookings = [
    {
      id: 'BKG-88392',
      billboardName: 'Downtown Times Square LED',
      location: '1540 Broadway, NY',
      startDate: 'Oct 15, 2026',
      endDate: 'Nov 15, 2026',
      status: 'Live',
      amount: '1,50,000',
      image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'BKG-88393',
      billboardName: 'Highway 66 Digital Board',
      location: 'Los Angeles, CA',
      startDate: 'Dec 01, 2026',
      endDate: 'Dec 31, 2026',
      status: 'Pending',
      amount: '75,000',
      image: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'BKG-88104',
      billboardName: 'Metro Transit Shelter #4',
      location: 'Chicago, IL',
      startDate: 'Jan 01, 2026',
      endDate: 'Jan 15, 2026',
      status: 'Completed',
      amount: '15,000',
      image: 'https://images.unsplash.com/photo-1555436169-20e9068b5a03?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Live': 
        return <span className="badge badge-success px-3 py-1 text-xs">🟢 Live Now</span>;
      case 'Completed': 
        return <span className="badge bg-dark-100 text-dark-700 px-3 py-1 text-xs">⚫ Completed</span>;
      case 'Pending': 
        return <span className="badge badge-warning px-3 py-1 text-xs flex items-center gap-1"><FiClock className="w-3 h-3"/> Awaiting Approval</span>;
      default: 
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">My Bookings</h1>
          <p className="text-dark-500 mt-1">View and manage your billboard advertising history</p>
        </div>
        {/* Simple Tab Filter (Visual only for now) */}
        <div className="bg-white p-1 rounded-xl border border-dark-200 inline-flex">
          <button className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium text-sm transition-colors">All</button>
          <button className="px-4 py-2 rounded-lg text-dark-600 hover:bg-dark-50 font-medium text-sm transition-colors">Active</button>
          <button className="px-4 py-2 rounded-lg text-dark-600 hover:bg-dark-50 font-medium text-sm transition-colors">Past</button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="card p-4 sm:p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center hover:border-primary-200 transition-colors">
            
            {/* Image & Basic Info */}
            <div className="flex items-center gap-4 w-full xl:w-2/5">
              <img 
                src={booking.image} 
                alt={booking.billboardName} 
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-dark-400 uppercase tracking-wider">{booking.id}</p>
                </div>
                <h3 className="font-bold text-lg text-dark-900 truncate">{booking.billboardName}</h3>
                <div className="flex items-center gap-1 text-sm text-dark-500 mt-1">
                  <FiMapPin className="w-4 h-4 shrink-0 text-primary-600" />
                  <span className="truncate">{booking.location}</span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex-1 flex flex-col sm:flex-row gap-6 w-full xl:px-6 xl:border-x border-dark-100">
              <div className="flex-1">
                <p className="text-xs text-dark-500 font-medium uppercase tracking-wider mb-1">Campaign Duration</p>
                <div className="flex items-center gap-2 text-dark-900 font-medium">
                  <FiCalendar className="w-4 h-4 text-primary-600" />
                  <span>{booking.startDate} <span className="text-dark-400 mx-1">→</span> {booking.endDate}</span>
                </div>
              </div>
            </div>

            {/* Status, Price, and Actions */}
            <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between w-full xl:w-1/4 gap-4">
              <div className="text-left xl:text-right flex flex-col items-start xl:items-end gap-2 w-full xl:w-auto">
                <div className="flex justify-between w-full xl:w-auto items-center gap-4">
                  {getStatusBadge(booking.status)}
                  <p className="font-bold text-xl text-dark-900">₹{booking.amount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
                <button className="flex-1 xl:flex-none btn btn-ghost text-primary-600 hover:bg-primary-50 px-3 py-2 text-sm flex items-center justify-center gap-2">
                  <FiDownload className="w-4 h-4" /> Invoice
                </button>
                <Link to="/billboards/1" className="flex-1 xl:flex-none btn btn-outline px-3 py-2 text-sm flex items-center justify-center gap-2">
                  <FiExternalLink className="w-4 h-4" /> View Ad
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;