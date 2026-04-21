const axios = require('axios');

exports.visibilityService = {
  /**
   * Calculates a 0-100 visibility score based on coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} - The score breakdown
   */
  calculateScore: async (lat, lng) => {
    try {
      // 1. Fetch data from external APIs (Mocked here for the architecture)
      // In reality, you would use axios.get() to hit Google Places or Overpass API
      const nearbyData = await fetchMockPOIData(lat, lng);
      const trafficData = await fetchMockTrafficData(lat, lng);

      // 2. Calculate POI Score (Max 50)
      let poiScore = 0;
      poiScore += nearbyData.malls * 10;
      poiScore += nearbyData.transitStations * 10;
      poiScore += nearbyData.markets * 5;
      poiScore += nearbyData.shops * 2;
      
      // Cap POI score at 50
      poiScore = Math.min(poiScore, 50);

      // 3. Calculate Traffic Score (Max 50)
      let trafficScore = 0;
      switch (trafficData.roadType) {
        case 'highway': trafficScore = 50; break;
        case 'arterial': trafficScore = 35; break;
        case 'local_market': trafficScore = 25; break;
        case 'residential': trafficScore = 10; break;
        default: trafficScore = 15;
      }

      // 4. Final Calculation
      const finalScore = poiScore + trafficScore;

      return {
        totalScore: finalScore,
        breakdown: {
          poiScore,
          trafficScore,
          surroundings: nearbyData
        }
      };

    } catch (error) {
      console.error("Visibility calculation failed:", error);
      // Return a safe default so billboard registration doesn't crash
      return { totalScore: 40, breakdown: null }; 
    }
  }
};

// --- Helper Mock Functions (Replace these with real API calls later) ---
const fetchMockPOIData = async (lat, lng) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { malls: 1, transitStations: 1, markets: 3, shops: 12 };
};

const fetchMockTrafficData = async (lat, lng) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { roadType: 'arterial', density: 'high' };
};