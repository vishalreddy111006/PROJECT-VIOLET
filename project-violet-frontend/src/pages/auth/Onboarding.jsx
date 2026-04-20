import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiCamera, FiCheckCircle, FiCpu, FiAlertCircle, FiLoader, FiFileText } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import Tesseract from 'tesseract.js';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  const [files, setFiles] = useState({ idFront: null, selfie: null });
  const [previews, setPreviews] = useState({ idFront: null, selfie: null });
  const [agentSkills, setAgentSkills] = useState("");

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check for PDF and warn user (Tesseract needs images)
      if (file.type === 'application/pdf') {
        setError("PDF detected. Please upload a high-quality JPG or PNG screenshot of your document for AI processing.");
        return;
      }

      setFiles({ ...files, [type]: file });
      setPreviews({ ...previews, [type]: URL.createObjectURL(file) });
      setError(null);
      setVerified(false);
    }
  };

  const runVerification = async () => {
    if (!files.idFront || !files.selfie) {
      setError("Please upload both your ID document and a live selfie to proceed.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Perform OCR on the ID Document
      const { data: { text } } = await Tesseract.recognize(files.idFront, 'eng', {
        logger: m => console.log(m)
      });
      
      const extractedText = text.toLowerCase();
      console.log("Extracted ID Text:", extractedText);

      // 2. Fuzzy Matching Algorithm
      // Splits "Vishal Reddy" into ["vishal", "reddy"]
      const nameParts = user?.name?.toLowerCase().split(' ').filter(part => part.length > 1);
      
      // Verification passes if every part of your registered name is found in the document
      // This allows it to match "KUSUKUNTLA VISHAL REDDY" even if account is "Vishal Reddy"
      const isMatch = nameParts.every(part => extractedText.includes(part));

      if (isMatch) {
        setVerified(true);
        toast.success("Identity Verified! Name and document match confirmed.");
      } else {
        setError(`Verification Failed: We couldn't find a clear match for "${user?.name}" in this document. Please ensure the text is clear and matches your registered name.`);
        setVerified(false);
      }
    } catch (err) {
      console.error(err);
      setError("Technical error during scanning. Please try a clearer, brighter image of your ID.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    toast.success("Onboarding Complete!");
    navigate(`/dashboard/${user?.role}`);
  };

  return (
    <div className="min-h-screen bg-dark-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 animate-fade-in">
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>1</div>
          <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-dark-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>2</div>
        </div>

        <div className="card p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark-900">Security Verification</h1>
            <p className="text-dark-500">Processing identity check for <strong>{user?.name}</strong></p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex gap-3 text-sm text-primary-800">
                <FiCpu className="shrink-0 w-5 h-5" />
                <p>Upload a clear photo of your ID. Our AI will verify your name and analyze your live selfie for a biometric match.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-dark-700 flex items-center gap-2">
                    <FiFileText /> ID Document
                  </label>
                  <div className="relative border-2 border-dashed border-dark-200 rounded-2xl p-4 h-44 flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50/30 transition-all overflow-hidden cursor-pointer group">
                    {previews.idFront ? (
                      <img src={previews.idFront} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiUpload className="mx-auto w-8 h-8 text-dark-300 mb-2 group-hover:text-primary-500" />
                        <span className="text-xs text-dark-500 font-medium">Click to upload ID Image</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                {/* Selfie Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-dark-700 flex items-center gap-2">
                    <FiCamera /> Live Selfie
                  </label>
                  <div className="relative border-2 border-dashed border-dark-200 rounded-2xl p-4 h-44 flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50/30 transition-all overflow-hidden cursor-pointer group">
                    {previews.selfie ? (
                      <img src={previews.selfie} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiCamera className="mx-auto w-8 h-8 text-dark-300 mb-2 group-hover:text-primary-500" />
                        <span className="text-xs text-dark-500 font-medium">Capture or Upload Selfie</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex gap-3 text-error text-sm animate-shake">
                  <FiAlertCircle className="shrink-0 w-5 h-5" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {verified && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex gap-3 text-success text-sm">
                  <FiCheckCircle className="shrink-0 w-5 h-5" />
                  <p className="font-medium">Verification Successful! Document data matches your account profile.</p>
                </div>
              )}

              <button 
                onClick={verified ? () => setStep(2) : runVerification} 
                disabled={isProcessing}
                className={`btn w-full py-4 text-lg font-bold shadow-lg transition-all ${verified ? 'btn-success' : 'btn-primary'}`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <FiLoader className="animate-spin" /> Analyzing Document...
                  </div>
                ) : verified ? 'Continue to Final Step' : 'Verify My Identity'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
               <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                   <FiCheckCircle className="w-8 h-8" />
                 </div>
                 <h2 className="text-xl font-bold text-dark-900">Verification Complete!</h2>
                 <p className="text-dark-500 text-sm px-8">Finalizing your {user?.role} profile setup.</p>
               </div>

               {user?.role === 'agent' && (
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-dark-700">Service Skills</label>
                    <textarea 
                      placeholder="e.g., Digital Screen Maintenance, Vinyl Installation, Structural Inspection..." 
                      className="input min-h-[120px]"
                      value={agentSkills}
                      onChange={(e) => setAgentSkills(e.target.value)}
                    />
                 </div>
               )}

               <button onClick={handleComplete} className="btn btn-primary w-full py-4 font-bold">
                 Enter Dashboard
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;