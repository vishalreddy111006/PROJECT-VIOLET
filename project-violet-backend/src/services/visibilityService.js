const axios = require('axios');

const visibilityService = {
  calculateScore: async (lat, lng) => {
    // Fail-safe mock data for now
    const poiScore = 70; 
    const trafficScore = 65;
    const finalScore = Math.round((poiScore * 0.60) + (trafficScore * 0.40));

    return {
      totalScore: finalScore,
      breakdown: {
        poiScore,
        trafficScore,
        poiCounts: { malls: 3, hospitals: 2, schools: 4, transit_stations: 5 }
      }
    };
  }
};

module.exports = { visibilityService };