import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiUser, 
  FiMaximize, 
  FiStar, 
  FiEye, 
  FiShoppingCart, 
  FiArrowLeft 
} from 'react-icons/fi';
import { billboardService } from '../../services/billboardService'; 

const BillboardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billboard, setBillboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real data from GET /api/billboards/:id
  useEffect(() => {
    const fetchBillboard = async () => {
      try {
        const response = await billboardService.getBillboardById(id);
        // Your controller returns { success: true, billboard: {...} }
        setBillboard(response.billboard);
      } catch (error) {
        console.error("Error fetching billboard details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboard();
  }, [id]);

  const handleAddToCart = () => {
    // TODO: Connect this to your global cart state (Zustand/Context)
    alert(`${billboard.title} has been added to your Campaign Cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!billboard) {
    return <div className="p-10 text-center text-red-500">Billboard not found.</div>;
  }

  // Safely extract nested properties based on your Mongoose Schema
  const price = billboard.pricing?.pricePerDay || 0;
  const ownerName = billboard.ownerId?.name || 'Unknown Owner';
  const size = billboard.specifications?.size || 'Standard Specs';
  const locationText = billboard.location?.city || billboard.location?.address || 'Location Details Pending';
  const imageUrl = billboard.images && billboard.images.length > 0 
    ? billboard.images[0].url 
    : 'https://images.unsplash.com/photo-1559144490-832815e9e03f?auto=format&fit=crop&w=1200&q=80';

  // Phase 2 Metric Placeholders (to be updated when the Trust Engine is fully integrated)
  // For now, mapping Reliability to the existing verification score from your controller
  const reliabilityScore = billboard.verification?.score || 85; 
  const visibilityScore = 92; // Placeholder until TomTom/Google Places API integration

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-violet-600 transition-colors mb-6 font-medium"
      >
        <FiArrowLeft className="mr-2" /> Back to Results
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md bg-gray-100 border">
            <img 
              src={imageUrl} 
              alt={billboard.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">{billboard.title}</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${billboard.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {billboard.status?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
            <p className="flex items-center text-gray-600 mt-2 text-lg">
              <FiMapPin className="mr-2 text-violet-600" /> {locationText}
            </p>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">About this location</h3>
            <p className="text-gray-600 leading-relaxed">
              {billboard.description || 'No description provided by the owner.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center text-gray-500 mb-1">
                <FiUser className="mr-2" /> Owner
              </div>
              <p className="font-semibold text-gray-900">{ownerName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center text-gray-500 mb-1">
                <FiMaximize className="mr-2" /> Dimensions
              </div>
              <p className="font-semibold text-gray-900">{size}</p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scores & Checkout Action */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
            <h3 className="font-bold text-gray-900 border-b pb-3">Platform Intelligence</h3>
            
            {/* Visibility Score Placeholder */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center text-gray-700 font-medium">
                  <FiEye className="mr-2 text-violet-600" /> Visibility Score
                </span>
                <span className="font-bold text-violet-600">{visibilityScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${visibilityScore}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Pending TomTom Traffic Integration.</p>
            </div>

            {/* Reliability Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center text-gray-700 font-medium">
                  <FiStar className="mr-2 text-amber-500" /> Reliability Score
                </span>
                <span className="font-bold text-amber-500">{reliabilityScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${reliabilityScore}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on maintenance history & AI verification.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-6">
            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-1">Estimated Base Cost</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
                <span className="text-gray-500 ml-2">/ day</span>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex justify-center items-center gap-2 mb-3"
            >
              <FiShoppingCart className="w-5 h-5" />
              Add to Campaign Cart
            </button>
            
            <p className="text-center text-sm text-gray-500">
              You can select campaign dates in your cart.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillboardDetails;