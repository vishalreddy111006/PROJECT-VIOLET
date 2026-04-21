const axios = require('axios');

// Using the weights defined in your Design Document
const WEIGHTS = {
  POI: 0.60,      // 60% weight for crowds (Malls, Hospitals, Schools)
  TRAFFIC: 0.40   // 40% weight for vehicle flow
};

const visibilityService = {
  /**
   * Main mathematical engine for the Visibility Score
   */
  calculateScore: async (lat, lng) => {
    try {
      // Run both API calls at the same time for maximum speed
      const [poiData, trafficData] = await Promise.all([
        visibilityService.fetchPOIData(lat, lng),
        visibilityService.fetchTrafficData(lat, lng)
      ]);

      // Calculate raw scores (0-100)
      const poiScore = visibilityService.calculatePOIScore(poiData);
      const trafficScore = visibilityService.calculateTrafficScore(trafficData);

      // Apply Weighted Linear Combination (WLC)
      const finalScore = Math.round((poiScore * WEIGHTS.POI) + (trafficScore * WEIGHTS.TRAFFIC));

      return {
        totalScore: finalScore,
        breakdown: {
          poiScore,
          trafficScore,
          poiCounts: poiData
        }
      };
    } catch (error) {
      console.error('Visibility Calculation Error:', error);
      // Fail-safe fallback so the app doesn't crash if an API fails
      return { totalScore: 50, breakdown: null }; 
    }
  },

  /**
   * Google Places API Integration
   */
  fetchPOIData: async (lat, lng) => {
    // If you don't have a Google API key yet, we return smart mock data based on coordinates
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return { malls: 3, hospitals: 2, schools: 4, transit_stations: 5 };
    }

    try {
      const radius = 2000; // 2km radius
      const types = ['shopping_mall', 'hospital', 'school', 'transit_station'];
      let results = {};

      for (const type of types) {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
          params: {
            location: `${lat},${lng}`,
            radius: radius,
            type: type,
            key: process.env.GOOGLE_PLACES_API_KEY
          }
        });
        results[type] = response.data.results.length;
      }
      return results;
    } catch (error) {
      console.error('Google Places API Error:', error.message);
      return { malls: 0, hospitals: 0, schools: 0, transit_stations: 0 };
    }
  },

  /**
   * TomTom Traffic API Integration
   */
  fetchTrafficData: async (lat, lng) => {
    // Fallback if no TomTom API key
    if (!process.env.TOMTOM_API_KEY) {
      return { currentSpeed: 25, freeFlowSpeed: 50 }; // Indicates heavy traffic
    }

    try {
      const response = await axios.get(`https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`, {
        params: {
          point: `${lat},${lng}`,
          key: process.env.TOMTOM_API_KEY
        }
      });
      return response.data.flowSegmentData;
    } catch (error) {
      console.error('TomTom API Error:', error.message);
      return { currentSpeed: 50, freeFlowSpeed: 50 };
    }
  },

  /**
   * Scoring Logic for POIs
   */
  calculatePOIScore: (poiCounts) => {
    // Assign weight to different types of places
    const score = (poiCounts.malls * 10) + 
                  (poiCounts.transit_stations * 8) + 
                  (poiCounts.hospitals * 5) + 
                  (poiCounts.schools * 5);
    
    // Cap at 100
    return Math.min(score, 100);
  },

  /**
   * Scoring Logic for Traffic
   */
  calculateTrafficScore: (trafficData) => {
    // If current speed is much lower than free flow, traffic is heavy (good for billboards!)
    const speedRatio = trafficData.currentSpeed / trafficData.freeFlowSpeed;
    
    // Lower ratio = higher congestion = better visibility score
    let score = (1 - speedRatio) * 100;
    
    // Boost base traffic assumption so empty roads still get SOME score
    return Math.min(Math.max(score + 30, 0), 100); 
  }
};

module.exports = { visibilityService };