import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiSave, FiAlertCircle } from 'react-icons/fi';

const EditBillboard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This grabs the billboard ID from the URL!

  // We initialize with dummy data that simulates fetching the existing billboard
  const [formData, setFormData] = useState({
    name: 'Downtown Times Square LED',
    location: '1540 Broadway, NY',
    price: '5000',
    type: 'digital',
    dimensions: '14x48',
    description: 'Prime digital billboard in the heart of Times Square with 24/7 visibility.',
    status: 'active' // Added status for the edit page!
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Updating Billboard ID ${id} with data:`, formData);
    alert("Billboard updated locally! (Backend connection coming soon)");
    navigate('/dashboard/admin/billboards');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/dashboard/admin/billboards" 
          className="p-2 text-dark-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
        >
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Edit Billboard</h1>
          <p className="text-dark-500 mt-1">Editing Billboard #{id}</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Top Section: Status & Image */}
          <div className="flex flex-col md:flex-row gap-8 pb-6 border-b border-dark-100">
            {/* Current Image Preview */}
            <div className="w-full md:w-1/3 space-y-2">
              <label className="block text-sm font-medium text-dark-700">Current Image</label>
              <div className="relative rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800" 
                  alt="Billboard Preview" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <div className="text-white flex items-center gap-2 font-medium">
                    <FiUpload className="w-5 h-5" /> Change Image
                  </div>
                </div>
              </div>
            </div>

            {/* Status Warning & Selection */}
            <div className="w-full md:w-2/3 space-y-4">
              <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl flex gap-3 text-warning-700">
                <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">Changing the status to "Maintenance" will temporarily hide this billboard from public search results and pause new bookings.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-700">Billboard Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input appearance-none bg-white font-medium"
                >
                  <option value="active">🟢 Active (Visible to public)</option>
                  <option value="pending">🟡 Pending (Awaiting review)</option>
                  <option value="maintenance">🔴 Maintenance (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Billboard Name/Title</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} className="input" required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Exact Location</label>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange} className="input" required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Price per Day (₹)</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} className="input" required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Dimensions (ft)</label>
              <input 
                type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="input" required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-dark-700">Billboard Type</label>
              <select 
                name="type" value={formData.type} onChange={handleChange} className="input appearance-none bg-white"
              >
                <option value="digital">Digital LED</option>
                <option value="static">Static Vinyl</option>
                <option value="transit">Transit / Bus Shelter</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-dark-700">Description & Highlights</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} className="input min-h-[120px] resize-y"
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-100">
            <Link to="/dashboard/admin/billboards" className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              <FiSave className="w-5 h-5" />
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditBillboard;