const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const axios = require('axios');

// Image Validation - Check if image contains a billboard
const validateBillboardImage = async (imagePath) => {
  try {
    // In production, you would use a real ML model
    // For now, we'll do basic image checks
    
    const metadata = await sharp(imagePath).metadata();
    
    // Basic validation
    const isValid = metadata.width >= 300 && metadata.height >= 300;
    
    return {
      verified: isValid,
      score: isValid ? 35 : 10,
      message: isValid ? 'Image validated successfully' : 'Image quality too low',
      details: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      }
    };
  } catch (error) {
    console.error('Error validating image:', error);
    return {
      verified: false,
      score: 0,
      message: 'Failed to validate image'
    };
  }
};

// OCR - Extract text from documents
const extractTextFromDocument = async (documentPath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(documentPath, 'eng', {
      logger: m => console.log(m)
    });
    
    return {
      success: true,
      text: text.trim(),
      extracted: parseDocumentData(text)
    };
  } catch (error) {
    console.error('Error extracting text:', error);
    return {
      success: false,
      text: '',
      error: error.message
    };
  }
};

// Parse document data (extract name, DOB, etc.)
const parseDocumentData = (text) => {
  const data = {
    documentNumber: null,
    name: null,
    dateOfBirth: null,
    address: null
  };
  
  try {
    // Simple regex patterns - in production use more sophisticated parsing
    const lines = text.split('\n');
    
    for (const line of lines) {
      // Look for document number patterns
      if (/\d{4}\s?\d{4}\s?\d{4}/.test(line)) {
        data.documentNumber = line.match(/\d{4}\s?\d{4}\s?\d{4}/)[0];
      }
      
      // Look for DOB patterns
      if (/\d{2}[\/\-]\d{2}[\/\-]\d{4}/.test(line)) {
        data.dateOfBirth = line.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/)[0];
      }
      
      // Look for name (usually after "Name:" or similar)
      if (/name\s*[:]\s*(.+)/i.test(line)) {
        data.name = line.match(/name\s*[:]\s*(.+)/i)[1].trim();
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing document:', error);
    return data;
  }
};

// Verify ID Document
const verifyIDDocument = async (documentPath) => {
  try {
    const extraction = await extractTextFromDocument(documentPath);
    
    if (!extraction.success) {
      return {
        verified: false,
        score: 0,
        message: 'Failed to extract data from document',
        extractedData: null
      };
    }
    
    // Check if essential data is present
    const hasName = extraction.extracted.name !== null;
    const hasDocNumber = extraction.extracted.documentNumber !== null;
    
    let score = 0;
    if (hasName) score += 15;
    if (hasDocNumber) score += 10;
    
    const verified = score >= 15;
    
    return {
      verified,
      score: verified ? 25 : score,
      message: verified ? 'Document verified successfully' : 'Incomplete document data',
      extractedData: extraction.extracted,
      rawText: extraction.text
    };
  } catch (error) {
    console.error('Error verifying document:', error);
    return {
      verified: false,
      score: 0,
      message: 'Document verification failed',
      extractedData: null
    };
  }
};

// Simulate face matching (in production, use face recognition API)
const simulateFaceMatch = async (idImagePath, selfieImagePath) => {
  try {
    // In production, use a face recognition service like AWS Rekognition, Azure Face API, etc.
    // For now, we'll simulate with a random score
    
    const similarity = Math.random() * 100;
    const verified = similarity >= 70;
    
    return {
      verified,
      score: verified ? 25 : 10,
      message: verified ? 'Face match successful' : 'Face match failed',
      similarity: similarity.toFixed(2)
    };
  } catch (error) {
    console.error('Error in face matching:', error);
    return {
      verified: false,
      score: 0,
      message: 'Face matching failed'
    };
  }
};

// Simulate database verification (check against government database)
const simulateDatabaseVerification = async (documentData) => {
  try {
    // In production, this would call a real government API
    // For now, we simulate with basic validation
    
    const hasValidData = documentData.documentNumber && documentData.name;
    const verified = hasValidData && Math.random() > 0.3; // 70% success rate
    
    return {
      verified,
      score: verified ? 25 : 5,
      message: verified ? 'Database verification successful' : 'Database verification failed'
    };
  } catch (error) {
    console.error('Error in database verification:', error);
    return {
      verified: false,
      score: 0,
      message: 'Database verification failed'
    };
  }
};

// Verify location consistency
const verifyLocationConsistency = async (billboardLocation, documentLocation) => {
  try {
    // Simple check - in production, use geocoding and distance calculation
    // For now, just check if both locations are provided
    
    const hasLocation = billboardLocation && billboardLocation.coordinates;
    const verified = hasLocation;
    
    return {
      verified,
      score: verified ? 30 : 10,
      message: verified ? 'Location verified' : 'Location data missing'
    };
  } catch (error) {
    console.error('Error verifying location:', error);
    return {
      verified: false,
      score: 0,
      message: 'Location verification failed'
    };
  }
};

module.exports = {
  validateBillboardImage,
  extractTextFromDocument,
  verifyIDDocument,
  simulateFaceMatch,
  simulateDatabaseVerification,
  verifyLocationConsistency,
  parseDocumentData
};
