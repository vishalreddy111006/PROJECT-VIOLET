/**
 * Trust Score Engine (WLC Algorithm)
 * Aggregates weighted inputs to output a final 0-100 Reliability Score.
 * Implements Algorithm 4 / Figure 4 from Design Document.
 */

const calculateTrustScore = (inputs) => {
  const {
    gpsMatchDistance = Infinity,
    isLiveCameraCapture = false,
    multiImageValid = false,
    imageConsistencySSIM = 0, // 0.0 to 1.0 scale
    ownershipType = 'None'
  } = inputs;

  let totalScore = 0;

  // 1. GPS Match (HIGH WEIGHT: Max 30 points)
  if (gpsMatchDistance <= 50) {
    totalScore += 30; // Perfect match
  } else if (gpsMatchDistance <= 100) {
    totalScore += 15; // Acceptable match, but flags lower trust
  }

  // 2. Live Camera Capture (HIGH WEIGHT: Max 30 points)
  // Critical anti-fraud control
  if (isLiveCameraCapture) {
    totalScore += 30;
  }

  // 3. Multi-Image Validity (MEDIUM WEIGHT: Max 15 points)
  if (multiImageValid) {
    totalScore += 15;
  }

  // 4. Image Consistency SSIM (MEDIUM WEIGHT: Max 15 points)
  // Edge case handle: Ensure SSIM is strictly bound between 0 and 1
  const safeSSIM = Math.max(0, Math.min(imageConsistencySSIM, 1));
  totalScore += (safeSSIM * 15);

  // 5. Document OCR Match / Ownership Type (CONDITIONAL MODIFIER: Max 10 points)
  if (ownershipType === 'Own') {
    totalScore += 10;
  } else if (ownershipType === 'Lease') {
    totalScore += 5;
  }

  // Safely round and cap the final score at 100
  const finalScore = Math.min(Math.round(totalScore), 100);

  // Decision Logic (Routing) based on Design Doc
  // >= 75: Auto-Approved
  // >= 50: Manual Queue (Low Trust)
  // < 50: Rejected
  let status = 'REJECTED';
  
  if (finalScore >= 75) {
    status = 'AUTO_APPROVED';
  } else if (finalScore >= 50) {
    status = 'APPROVED_LOW_TRUST';
  }

  return {
    score: finalScore,
    status: status,
    breakdown: {
      gpsDistance: gpsMatchDistance,
      liveCapture: isLiveCameraCapture,
      imageCountValid: multiImageValid,
      ssimScore: safeSSIM,
      ownership: ownershipType
    }
  };
};

module.exports = {
  calculateTrustScore
};