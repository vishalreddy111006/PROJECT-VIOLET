import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCamera, FiBriefcase, FiMapPin, FiSave } from 'react-icons/fi';
import { authService } from '../../services/authService';

const Profile = () => {
  // CHANGED: Initialized as a single object instead of an array
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    findMe();
  }, []);

  const findMe = async () => {
    const me = await authService.getMe();
    
    if (me.success) {
      const data = me?.user;
      // UPDATED: Standard object update logic
      setFormData({
            firstName: data.name || '',
            lastName: data.lastName || '', 
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || '',
            location: typeof data.location === 'object' 
                      ? "Location Set (Coordinates)" 
                      : data.location || '',
            bio: data.bio || ''
        });
    }
  };

  const handleChange = (e) => {
    // UPDATED: Standard object state update
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting updated profile data:", formData);
    await authService.updateProfile(formData);
    console.log("Updated Profile Data:", formData);
    alert("Profile updated locally! (Backend connection coming soon)");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">My Profile</h1>
        <p className="text-dark-500 mt-1">Manage your personal information and public details</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-full xl:w-1/3 space-y-6">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full bg-primary-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-700">VR</span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-dark-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border border-dark-100">
                <FiCamera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-dark-900">{formData.firstName} {formData.lastName}</h2>
            <p className="text-primary-600 font-medium text-sm mb-4">System Administrator</p>
            
            <div className="w-full pt-4 border-t border-dark-100 space-y-3 text-left text-sm">
              <div className="flex items-center gap-3 text-dark-600">
                <FiMapPin className="w-4 h-4 text-dark-400 shrink-0" />
                <span className="truncate">{formData.location}</span>
              </div>
              <div className="flex items-center gap-3 text-dark-600">
                <FiBriefcase className="w-4 h-4 text-dark-400 shrink-0" />
                <span className="truncate">{formData.company}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-2/3">
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-dark-900 mb-4 border-b border-dark-100 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-700">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input pl-11" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-700">Last Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input pl-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                        <FiMail className="w-4 h-4" />
                      </div>
                      {/* FIXED: Accessed as formData.email */}
                      <input type="email" name="email" value={formData.email} readOnly className="input pl-11 bg-dark-50 text-dark-500 cursor-not-allowed" />
                    </div>
                    <p className="text-xs text-dark-400 mt-1">Email cannot be changed.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dark-400">
                        <FiPhone className="w-4 h-4" />
                      </div>
                      {/* FIXED: Accessed as formData.phone */}
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input pl-11" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-dark-900 mb-4 border-b border-dark-100 pb-2">Professional Details</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-dark-700">Company / Organization</label>
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="input" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-dark-700">Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} className="input" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-700">Short Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="input min-h-[100px] resize-y" placeholder="Tell us a little about yourself..."></textarea>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-dark-100">
                <button type="button" className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <FiSave className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;