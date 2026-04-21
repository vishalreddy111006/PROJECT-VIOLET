const User = require('../models/User');
const Billboard = require('../models/Billboard');

/**
 * Project Violet Reliability Engine
 * Dynamically adjusts scores based on a Weighted Linear Combination feedback loop.
 */

/**
 * Converts a 1-10 rating into a score modifier.
 * 10/10 = +10 points
 * 5.5/10 = 0 points (Neutral)
 * 1/10 = -10 points
 */
const calculateRatingImpact = (ratingOutOf10) => {
  return (ratingOutOf10 - 5.5) * 2.22;
};

// ==========================================
// --- AGENT RELIABILITY LOGIC ---
// ==========================================

// 1. Handle automated system events
exports.updateAgentReliability = async (agentId, actionType, metadata = {}) => {
  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') return;

    // Initialize score if it doesn't exist (starts at a neutral 75)
    let currentScore = agent.reliabilityScore || 75;

    switch (actionType) {
      case 'JOB_COMPLETED_ON_TIME':
        currentScore += 2.5; // Small positive reinforcement
        break;
      case 'JOB_COMPLETED_LATE':
        currentScore -= 1.5; // Minor penalty
        break;
      case 'JOB_ABANDONED':
        currentScore -= 15.0; // Severe penalty for claiming and not finishing
        break;
    }

    // Clamp score between 0 and 100
    agent.reliabilityScore = Math.min(Math.max(currentScore, 0), 100);
    await agent.save();

    return agent.reliabilityScore;
  } catch (error) {
    console.error("Agent Reliability Update Error:", error);
  }
};

// 2. Handle manual 1-10 feedback from Admins/Customers
exports.processAgentFeedback = async (agentId, ratingOutOf10) => {
  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') return;

    let currentScore = agent.reliabilityScore || 75;
    const impact = calculateRatingImpact(ratingOutOf10);
    
    // Apply impact and clamp between 0 and 100
    agent.reliabilityScore = Math.min(Math.max(currentScore + impact, 0), 100);
    await agent.save();

    return agent.reliabilityScore;
  } catch (error) {
    console.error("Agent Feedback Error:", error);
  }
};


// ==========================================
// --- BILLBOARD RELIABILITY LOGIC ---
// ==========================================

// 1. Handle automated system events
exports.updateBillboardReliability = async (billboardId, actionType, metadata = {}) => {
  try {
    const billboard = await Billboard.findById(billboardId);
    if (!billboard) return;

    // Initialize with the verification score generated during onboarding
    let currentScore = billboard.verification?.score || 50;

    switch (actionType) {
      case 'AGENT_MAINTENANCE_VERIFIED':
        // Agent physically visited and uploaded proof
        currentScore += 5.0; 
        break;
      case 'CUSTOMER_COMPLAINT':
        // Direct admin trigger for severe real-world issues (e.g., structure damage)
        currentScore -= 10.0; 
        break;
      case 'SUCCESSFUL_CAMPAIGN_END':
        currentScore += 2.0;
        break;
    }

    // Clamp score between 0 and 100
    currentScore = Math.min(Math.max(currentScore, 0), 100);
    
    // Save back to the nested verification score
    billboard.verification.score = currentScore;
    await billboard.save();

    return currentScore;
  } catch (error) {
    console.error("Billboard Reliability Update Error:", error);
  }
};

// 2. Handle manual 1-10 feedback from Agents/Customers
exports.processBillboardFeedback = async (billboardId, ratingOutOf10) => {
  try {
    const billboard = await Billboard.findById(billboardId);
    if (!billboard) return;

    let currentScore = billboard.verification?.score || 50;
    const impact = calculateRatingImpact(ratingOutOf10);

    currentScore = Math.min(Math.max(currentScore + impact, 0), 100);
    billboard.verification.score = currentScore;
    
    await billboard.save();
    return currentScore;
  } catch (error) {
    console.error("Billboard Feedback Error:", error);
  }
};