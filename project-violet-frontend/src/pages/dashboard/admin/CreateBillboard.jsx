import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiSave } from 'react-icons/fi';

const CreateBillboard = () => {
  const navigate = useNavigate();
  // State to hold our form data (ready for when we connect the backend!)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    type: 'digital',
    dimensions: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data to send to backend:", formData);
    // For now, just simulate a save and go back to the list
    alert("Billboard saved locally! (Backend connection coming soon)");
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
          <h1 className="text-3xl font-bold text-dark-900">Add New Billboard</h1>
          <p className="text-dark-500 mt-1">Fill in the details to list a new billboard inventory</p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Image Upload Area (Visual Only for now) */}
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">Billboard Image</label>
            <div className="border-2 border-dashed border-dark-200 rounded-2xl p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FiUpload className="w-6 h-6" />
              </div>
              <p className="font-medium text-dark-900">Click to upload or drag and drop</p>
              <p className="text-sm text-dark-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Billboard Name/Title</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Times Square Premium Digital" 
                className="input"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Exact Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. 1540 Broadway, NY" 
                className="input"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Price per Day (₹)</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000" 
                className="input"
                required
              />
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-700">Dimensions (ft)</label>
              <input 
                type="text" 
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="e.g. 14x48" 
                className="input"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-dark-700">Billboard Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input appearance-none bg-white"
              >
                <option value="digital">Digital LED</option>
                <option value="static">Static Vinyl</option>
                <option value="transit">Transit / Bus Shelter</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-dark-700">Description & Highlights</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the visibility, traffic, and nearby landmarks..." 
                className="input min-h-[120px] resize-y"
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
              Save Billboard
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateBillboard;