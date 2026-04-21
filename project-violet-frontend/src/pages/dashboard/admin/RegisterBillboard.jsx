import React, { useState } from 'react';
import { FiCamera, FiMapPin, FiUpload, FiCheckCircle, FiInfo, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { billboardService } from '../../../services/billboardService';

const RegisterBillboard = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerDay: '',
    pricePerMonth: '',
    type: 'digital',
    address: '',
    city: '',
    width: '',
    height: ''
  });

  // Files & Location State
  const [mapPin, setMapPin] = useState(null); // [lng, lat]
  const [staticImages, setStaticImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  // Security State (Live Capture)
  const [liveCapture, setLiveCapture] = useState({
    file: null,
    gps: null,
    timestamp: null
  });

  // 1. Precise GPS Pinning
  const handleDropPin = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // [Longitude, Latitude] for GeoJSON compliance
        setMapPin([position.coords.longitude, position.coords.latitude]);
        toast.success("GPS Location Synchronized");
      },
      (err) => toast.error('Please enable location services to drop a pin.'),
      { enableHighAccuracy: true }
    );
  };

  // 2. OS Intent Live Capture (Mandatory for Trust Score)
  const handleLiveCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLiveCapture({
          file: file,
          gps: { lat: position.coords.latitude, lng: position.coords.longitude },
          timestamp: Date.now()
        });
        toast.success("Live verification image secured.");
      },
      (error) => {
        toast.error("GPS required for Live Capture verification.");
        setLiveCapture({ file: null, gps: null, timestamp: null });
      },
      { enableHighAccuracy: true }
    );
  };

  // 3. Submit to AI & Visibility Pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety Validation
    if (!mapPin || !liveCapture.file || staticImages.length < 1) {
      toast.error("Missing requirements: Map Pin, Images, or Live Capture.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Basic Info
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      
      // Location Object (Strictly formatted for 2dsphere index)
      submitData.append('location', JSON.stringify({
        type: 'Point',
        coordinates: mapPin,
        address: formData.address,
        city: formData.city
      }));

      // Specifications & Pricing
      submitData.append('specifications', JSON.stringify({ 
        type: formData.type, 
        width: Number(formData.width), 
        height: Number(formData.height) 
      }));
      
      submitData.append('pricing', JSON.stringify({ 
        pricePerDay: Number(formData.pricePerDay),
        pricePerMonth: Number(formData.pricePerMonth || formData.pricePerDay * 25)
      }));

      // Append Static Images to 'billboardImages' key (Matches Backend Multer)
      Array.from(staticImages).forEach((file) => {
        submitData.append('billboardImages', file);
      });
      
      // Append Live Capture as the final 'billboardImages' entry
      submitData.append('billboardImages', liveCapture.file);

      // Append Ownership Documents
      Array.from(documents).forEach((file) => {
        submitData.append('documents', file);
      });

      // Submit to Backend
      const response = await billboardService.createBillboard(submitData);

      if (response.success) {
        toast.success(`Registered! Visibility Score: ${response.billboard.visibility.score}`);
        navigate('/dashboard/admin');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-violet-600 p-8 text-white">
          <h1 className="text-3xl font-black">Register New Asset</h1>
          <p className="opacity-80 mt-2">Initialize the AI Verification & Visibility Scoring pipeline.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          
          {/* STEP 1: Core Details */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm text-violet-700">1</span>
              Asset Specifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Billboard Title</label>
                <input type="text" placeholder="e.g. Downtown LED Plaza" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Price Per Day (₹)</label>
                <input type="number" placeholder="2500" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Address</label>
                <input type="text" placeholder="Street name, Landmark" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">City</label>
                <input type="text" placeholder="Roorkee" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              </div>
            </div>

            <button type="button" onClick={handleDropPin} className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${mapPin ? 'border-green-500 bg-green-50 text-green-700' : 'border-violet-200 hover:bg-violet-50 text-violet-500'}`}>
              <FiMapPin className={`w-8 h-8 ${mapPin ? 'animate-bounce' : ''}`} />
              <span className="font-black uppercase tracking-widest text-xs">{mapPin ? 'GPS Coordinates Synchronized' : 'Sync GPS Location (Required)'}</span>
              {mapPin && <span className="text-[10px] opacity-70">[{mapPin[1].toFixed(4)}, {mapPin[0].toFixed(4)}]</span>}
            </button>
          </section>

          {/* STEP 2: Media & Verification */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm text-violet-700">2</span>
              Media & Documentation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Static Gallery (Min 2)</label>
                <div className="relative">
                  <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setStaticImages(e.target.files)} required />
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
                    <FiUpload className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{staticImages.length > 0 ? `${staticImages.length} files selected` : 'Click to upload gallery'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Ownership Proof</label>
                <div className="relative">
                  <input type="file" accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setDocuments(e.target.files)} required />
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-500">
                    <FiUpload className="mx-auto mb-2" />
                    <span className="text-sm font-medium">{documents.length > 0 ? 'Document Ready' : 'Upload Permit/Lease'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: Mandatory Live Verification */}
          <section className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl text-white shadow-lg shadow-blue-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-xl">
                <FiInfo className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Anti-Fraud Live Capture</h2>
                <p className="text-blue-100 text-sm mt-1 leading-relaxed">
                  The Trust Engine requires a real-time photo taken at the physical site. 
                  Gallary uploads are disabled for this step to ensure location consistency.
                </p>
              </div>
            </div>
            
            <label className={`cursor-pointer w-full p-8 border-2 border-white/30 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${liveCapture.file ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}>
              {liveCapture.file ? <FiCheckCircle className="w-10 h-10 text-green-300" /> : <FiCamera className="w-10 h-10" />}
              <span className="font-black uppercase tracking-widest">{liveCapture.file ? 'Identity Verified' : 'Launch Secure Camera'}</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                onChange={handleLiveCapture} 
                required
              />
            </label>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="group relative w-full py-5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-2xl shadow-xl shadow-violet-100 transition-all disabled:bg-gray-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-violet-500 transition-transform duration-1000 ${isSubmitting ? 'translate-x-0' : '-translate-x-full'}`}></div>
            <span className="relative flex items-center justify-center gap-3 uppercase tracking-tighter text-lg">
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin" />
                  Running AI Trust Algorithm...
                </>
              ) : 'Submit to Global Inventory'}
            </span>
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterBillboard;