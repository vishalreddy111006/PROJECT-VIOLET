import { Link } from 'react-router-dom';
import { FiPlus, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi';

const MyBillboards = () => {
  // We are using dummy data here just so you can see the UI working immediately!
  // Later, we will connect this to your backend database to fetch real billboards.
  const dummyBillboards = [
    {
      id: 1,
      name: "Downtown Times Square LED",
      location: "New York City, NY",
      price: "5,000",
      status: "active",
      image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      name: "Highway 66 Digital Board",
      location: "Los Angeles, CA",
      price: "2,500",
      status: "pending",
      image: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">My Billboards</h1>
          <p className="text-dark-500 mt-1">Manage your billboard inventory and status</p>
        </div>
        <Link to="/dashboard/admin/billboards/create" className="btn btn-primary">
          <FiPlus className="w-5 h-5" />
          Add Billboard
        </Link>
      </div>

      {/* Billboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyBillboards.map((billboard) => (
          <div key={billboard.id} className="card card-hover overflow-hidden p-0 group">
            
            {/* Image Container */}
            <div className="h-48 overflow-hidden relative">
              <img 
                src={billboard.image} 
                alt={billboard.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <span className={`badge ${billboard.status === 'active' ? 'badge-success' : 'badge-warning'} capitalize`}>
                  {billboard.status}
                </span>
              </div>
            </div>
            
            {/* Content Container */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-bold truncate">{billboard.name}</h3>
                <div className="flex items-center gap-2 text-dark-500 mt-1">
                  <FiMapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate">{billboard.location}</span>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-100">
                <p className="font-semibold text-primary-600">₹{billboard.price} <span className="text-sm text-dark-400 font-normal">/day</span></p>
                <div className="flex gap-2">
                  <button className="p-2 text-dark-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-dark-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBillboards;