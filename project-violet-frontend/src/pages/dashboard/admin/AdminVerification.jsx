import React, { useState } from 'react';
import { FiShield, FiCheckCircle, FiUploadCloud, FiXCircle, FiLoader } from 'react-icons/fi';
import Tesseract from 'tesseract.js';

const AdminVerification = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // In production, fetch this from your global auth context/store
  const registeredName = "Vishal Reddy"; 

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setVerificationResult(null); // Reset result when a new file is chosen
    }
  };

  const handleVerify = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setVerificationResult(null);
    
    try {
      // Client-side OCR processing for data privacy
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      console.log("OCR Extracted Text:", text);
      
      const isMatch = text.toLowerCase().includes(registeredName.toLowerCase());
      
      if (isMatch) {
        setVerificationResult({ 
          status: 'success', 
          message: 'VERIFIED: Identity matches document.' 
        });
        // TODO: Trigger API call to backend to update user.isVerified to true
      } else {
        setVerificationResult({ 
          status: 'error', 
          message: 'REJECTED: Registered name not found on document.' 
        });
      }
    } catch (error) {
      console.error("OCR Error:", error);
      setVerificationResult({ 
        status: 'error', 
        message: 'Error processing document. Please try a clearer image.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center w-full max-w-md space-y-6 animate-fade-in">
        
        {/* Header Section */}
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <FiShield className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-dark-900">Autonomous Security</h1>
          <p className="text-dark-500 text-sm">
            Project Violet uses client-side AI identity verification. Upload your PAN, DL, or Voter ID to securely verify your admin account locally.
          </p>
        </div>

        {/* Upload & Action Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          
          {/* Custom File Input */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                {file ? file.name : "Click to upload ID document"}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={isProcessing}
            />
          </label>

          <button 
            onClick={handleVerify}
            disabled={!file || isProcessing}
            className={`w-full py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-all ${
              !file || isProcessing 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
            }`}
          >
            {isProcessing && <FiLoader className="animate-spin" />}
            {isProcessing ? 'Scanning Document...' : 'Run Local AI Verification'}
          </button>
        </div>

        {/* Result Status Display */}
        {verificationResult && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-fade-in ${
            verificationResult.status === 'success' 
              ? 'bg-success/5 border border-success/10 text-success' 
              : 'bg-red-50 border border-red-100 text-red-600'
          }`}>
            {verificationResult.status === 'success' ? (
              <FiCheckCircle className="shrink-0 w-5 h-5" />
            ) : (
              <FiXCircle className="shrink-0 w-5 h-5" />
            )}
            <span className="text-left">{verificationResult.message}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminVerification;