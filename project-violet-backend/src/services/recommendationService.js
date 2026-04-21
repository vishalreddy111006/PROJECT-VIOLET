const Billboard = require('../models/Billboard');
const geolib = require('geolib');

// Get recommended billboards based on user preferences
const getRecommendations = async (preferences) => {
  try {
    const {
      location, // { latitude, longitude }
      budget,
      duration, // in days
      startDate,
      endDate,
      radius = 10000, // 10km default
      trafficDensity,
      billboardType
    } = preferences;

    // Build query
    let query = {
      'verification.status': 'approved',
      'availability.isAvailable': true,
      status: 'active'
    };
         
    // Add type filter
    if (billboardType) {
      query['specifications.type'] = billboardType;
    }

    // Add traffic density filter
    if (trafficDensity) {
      query['visibility.trafficDensity'] = trafficDensity;
    }

    let billboards;

    // If location provided, use geospatial query
    if (location && location.latitude && location.longitude) {
      billboards = await Billboard.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude]
            },
            $maxDistance: radius
          }
        }
      })
      .populate('ownerId', 'name email phone')
      .lean();
    } else {
      // Otherwise, get all matching billboards
      billboards = await Billboard.find(query)
        .populate('ownerId', 'name email phone')
        .lean();
    }

    // Filter by availability for dates
    if (startDate && endDate) {
      billboards = billboards.filter(billboard => {
        const billboardDoc = new Billboard(billboard);
        return billboardDoc.isAvailableForDates(startDate, endDate);
      });
    }

    // Calculate scores for each billboard
    const scoredBillboards = billboards.map(billboard => {
      let score = 0;
      const factors = {};

      // Distance score (if location provided)
      if (location && location.latitude && location.longitude) {
        const distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { 
            latitude: billboard.location.coordinates[1], 
            longitude: billboard.location.coordinates[0] 
          }
        );
        
        const distanceScore = Math.max(0, 100 - (distance / radius) * 100);
        score += distanceScore * 0.3; // 30% weight
        factors.distance = {
          value: distance,
          score: distanceScore,
          weight: 0.3
        };
      }

      // Budget score
      if (budget) {
        const totalPrice = calculatePrice(billboard.pricing, duration);
        const budgetDiff = Math.abs(budget - totalPrice);
        const budgetScore = Math.max(0, 100 - (budgetDiff / budget) * 100);
        score += budgetScore * 0.25; // 25% weight
        factors.budget = {
          totalPrice,
          difference: budgetDiff,
          score: budgetScore,
          weight: 0.25
        };
      }

      // Traffic density score
      const trafficScores = {
        'very-high': 100,
        'high': 75,
        'medium': 50,
        'low': 25
      };
      const trafficScore = trafficScores[billboard.visibility.trafficDensity] || 50;
      score += trafficScore * 0.2; // 20% weight
      factors.traffic = {
        density: billboard.visibility.trafficDensity,
        score: trafficScore,
        weight: 0.2
      };

      // Rating score
      const ratingScore = (billboard.ratings.average / 5) * 100;
      score += ratingScore * 0.15; // 15% weight
      factors.rating = {
        value: billboard.ratings.average,
        score: ratingScore,
        weight: 0.15
      };

      // Verification score
      score += billboard.verification.score * 0.1; // 10% weight
      factors.verification = {
        score: billboard.verification.score,
        weight: 0.1
      };

      return {
        ...billboard,
        recommendationScore: Math.round(score),
        scoringFactors: factors,
        estimatedPrice: budget ? calculatePrice(billboard.pricing, duration) : null
      };
    });

    // Sort by score
    scoredBillboards.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return {
      success: true,
      count: scoredBillboards.length,
      recommendations: scoredBillboards
    };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return {
      success: false,
      message: 'Failed to get recommendations',
      recommendations: []
    };
  }
};

// Calculate price based on duration
const calculatePrice = (pricing, duration) => {
  if (!duration) return pricing.pricePerDay;
  
  if (duration >= 30 && pricing.pricePerMonth) {
    const months = Math.floor(duration / 30);
    const remainingDays = duration % 30;
    return (months * pricing.pricePerMonth) + (remainingDays * pricing.pricePerDay);
  } else if (duration >= 7 && pricing.pricePerWeek) {
    const weeks = Math.floor(duration / 7);
    const remainingDays = duration % 7;
    return (weeks * pricing.pricePerWeek) + (remainingDays * pricing.pricePerDay);
  } else {
    return duration * pricing.pricePerDay;
  }
};

// Get similar billboards
const getSimilarBillboards = async (billboardId, limit = 5) => {
  try {
    const billboard = await Billboard.findById(billboardId);
    
    if (!billboard) {
      return {
        success: false,
        message: 'Billboard not found'
      };
    }

    // Find similar billboards
    const similar = await Billboard.find({
      _id: { $ne: billboardId },
      'specifications.type': billboard.specifications.type,
      'verification.status': 'approved',
      status: 'active',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: billboard.location.coordinates
          },
          $maxDistance: 20000 // 20km
        }
      }
    })
    .limit(limit)
    .populate('ownerId', 'name email phone')
    .lean();

    return {
      success: true,
      similar
    };
  } catch (error) {
    console.error('Error getting similar billboards:', error);
    return {
      success: false,
      message: 'Failed to get similar billboards'
    };
  }
};

module.exports = {
  getRecommendations,
  getSimilarBillboards,
  calculatePrice
};
