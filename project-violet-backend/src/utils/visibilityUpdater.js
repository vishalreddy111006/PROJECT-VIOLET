const cron = require('node-cron');
const Billboard = require('../models/Billboard');
const { visibilityService } = require('../services/visibilityService');

const startVisibilityCronJob = () => {
  // Runs at 2:00 AM every 3 days
  // Format: second minute hour day-of-month month day-of-week
  cron.schedule('0 2 */3 * *', async () => {
    console.log('🔄 [CRON] Starting periodic Visibility Score update...');
    
    try {
      // Find all active billboards
      const billboards = await Billboard.find({ status: 'active' });
      console.log(`Found ${billboards.length} billboards to update.`);

      let updatedCount = 0;

      for (const billboard of billboards) {
        if (!billboard.location || !billboard.location.coordinates) continue;

        // Extract coordinates safely (GeoJSON is [longitude, latitude])
        const lng = billboard.location.coordinates[0];
        const lat = billboard.location.coordinates[1];

        // Fetch fresh data
        const freshData = await visibilityService.calculateScore(lat, lng);

        // Update document
        billboard.visibility.score = freshData.totalScore;
        
        // Optionally update the string category based on the new traffic score
        if (freshData.breakdown.trafficScore >= 75) billboard.visibility.trafficDensity = 'very-high';
        else if (freshData.breakdown.trafficScore >= 50) billboard.visibility.trafficDensity = 'high';
        else if (freshData.breakdown.trafficScore >= 25) billboard.visibility.trafficDensity = 'medium';
        else billboard.visibility.trafficDensity = 'low';

        await billboard.save();
        updatedCount++;
      }

      console.log(`✅ [CRON] Successfully updated ${updatedCount} Visibility Scores.`);
    } catch (error) {
      console.error('❌ [CRON] Error updating visibility scores:', error);
    }
  });
};

module.exports = startVisibilityCronJob;