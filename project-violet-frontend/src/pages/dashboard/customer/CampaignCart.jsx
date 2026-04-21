import React, { useState, useMemo } from 'react';
import { FiTrash2, FiMapPin, FiCheckCircle } from 'react-icons/fi';
// import { bookingService } from '../../../services/bookingService'; // You will need this for checkout

const CampaignCart = () => {
  // In a real app, you might want to use Zustand/Context for this state 
  // so you can add items from the SearchResults page.
  const [cart, setCart] = useState([
    // Mock data for UI testing - remove when connected to global state
    { _id: '1', title: 'Highway Mega Board', locationName: 'NH-44 Junction', pricePerDay: 5000, visibilityScore: 92 },
    { _id: '2', title: 'City Center Screen', locationName: 'MG Road Mall', pricePerDay: 8000, visibilityScore: 98 }
  ]);
  const [campaignDates, setCampaignDates] = useState({ start: '', end: '' });

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  // Calculate live totals [cite: 17, 67]
  const cartTotals = useMemo(() => {
    // Calculate number of days
    let days = 1;
    if (campaignDates.start && campaignDates.end) {
      const start = new Date(campaignDates.start);
      const end = new Date(campaignDates.end);
      const diffTime = Math.abs(end - start);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    }

    return cart.reduce((acc, board) => {
      acc.totalCost += board.pricePerDay * days; 
      acc.estimatedReach += board.visibilityScore * 1500; // Mock multiplier for reach
      return acc;
    }, { totalCost: 0, estimatedReach: 0, days });
  }, [cart, campaignDates]);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!campaignDates.start || !campaignDates.end) return alert("Please select campaign dates");

    const bookingPayload = {
      billboards: cart.map(b => b._id),
      startDate: campaignDates.start,
      endDate: campaignDates.end,
      totalCost: cartTotals.totalCost
    };

    console.log("Submitting Booking Payload:", bookingPayload);
    // TODO: Call backend API
    // await bookingService.createCampaign(bookingPayload);
    alert("Campaign booking submitted successfully!");
    setCart([]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Left Column: Cart Items */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Campaign Cart</h2>
        
        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
            Your cart is empty. Start adding billboards from the search page!
          </div>
        ) : (
          cart.map((board) => (
            <div key={board._id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{board.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <FiMapPin className="mr-1" /> {board.locationName}
                </div>
                <div className="text-violet-600 font-medium mt-2">
                  ₹{board.pricePerDay.toLocaleString()} / day
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(board._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Right Column: Checkout Summary */}
      <div className="w-full md:w-80 h-fit bg-white p-6 rounded-xl border shadow-sm sticky top-6">
        <h3 className="text-lg font-bold border-b pb-4 mb-4">Campaign Summary</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input 
              type="date" 
              className="w-full border rounded-lg p-2 text-sm"
              value={campaignDates.start}
              onChange={(e) => setCampaignDates(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input 
              type="date" 
              className="w-full border rounded-lg p-2 text-sm"
              value={campaignDates.end}
              onChange={(e) => setCampaignDates(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Selected Boards</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Campaign Duration</span>
              <span>{cartTotals.days} days</span>
            </div>
            <div className="flex justify-between text-sm text-violet-600 bg-violet-50 p-2 rounded">
              <span>Estimated Reach</span>
              <span className="font-semibold">{cartTotals.estimatedReach.toLocaleString()} views</span>
            </div>
          </div>

          <div className="pt-4 border-t mt-4">
            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-gray-800">Total Cost</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{cartTotals.totalCost.toLocaleString()}
              </span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
            >
              <FiCheckCircle />
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCart;