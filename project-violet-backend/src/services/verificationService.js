// src/services/verificationService.js

exports.calculateTrustScore = (verificationInputs) => {
  let score = 0;

  // High Weight
  if (verificationInputs.gpsMatchDistance < 100) score += 35; // Haversine distance < 100m
  if (verificationInputs.isLiveCameraCapture) score += 35; // OS Intent camera, no gallery

  // Medium Weight
  if (verificationInputs.multiImageValid) score += 15; // 2-3 images, diff angles
  if (verificationInputs.imageConsistencySSIM > 0.8) score += 15;

  // Output Routing
  if (score >= 85) return { status: 'AUTO_APPROVED', score };
  if (score >= 50) return { status: 'APPROVED_LOW_TRUST', score };
  return { status: 'REJECTED', score };
};