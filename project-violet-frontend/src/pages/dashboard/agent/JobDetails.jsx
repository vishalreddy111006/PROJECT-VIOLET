import React, { useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiClock, FiFileText, FiCamera, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [jobStatus, setJobStatus] = useState('Available'); // 'Available', 'Claimed', 'Completed'
  const [proofPhoto, setProofPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  // MOCK DATA (In a real app, you'd fetch this based on the 'id')
  const job = {
    title: 'Vinyl Installation',
    payout: '1,500',
    location: '1540 Broadway, New York, NY 10036',
    deadline: 'Today, 5:00 PM',
    instructions: "Remove old vinyl carefully. Paste the new 'TechFlow' campaign poster. Ensure no air bubbles are visible. Take a clear photo of the board from across the street upon completion."
  };

  // --- ACTIONS ---

  const handleClaimJob = async () => {
    setIsSubmitting(true);
    setError('');
    
    // Simulate API Call to /api/jobs/:id/claim
    setTimeout(() => {
      // Here you would handle the "Hoarding Limit" error if it fails
      setJobStatus('Claimed');
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview URL for the captured photo
      setProofPhoto(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmitCompletion = async () => {
    if (!proofPhoto) {
      setError('You must capture a proof photo before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API Call to /api/jobs/:id/complete (Sending FormData)
    setTimeout(() => {
      setJobStatus('Completed');
      setIsSubmitting(false);
      // Redirect back to dashboard after a brief success message
      setTimeout(() => navigate('/dashboard/agent/my-jobs'), 1500);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/agent/jobs" className="p-2 text-dark-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
          <FiArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Job Details</h1>
          <p className="text-dark-500 mt-1">Task #{id || '101'}</p>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg flex items-center gap-2 animate-fade-in">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 bg-white border border-dark-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-start border-b border-dark-100 pb-4 mb-4">
              <div>
                {/* Dynamic Status Badge */}
                {jobStatus === 'Available' && <span className="badge bg-dark-100 text-dark-700 px-2 py-1 rounded mb-2 inline-block">Available</span>}
                {jobStatus === 'Claimed' && <span className="badge bg-warning/20 text-warning-700 px-2 py-1 rounded mb-2 inline-block font-medium">In Progress</span>}
                {jobStatus === 'Completed' && <span className="badge bg-success/20 text-success-700 px-2 py-1 rounded mb-2 inline-block font-medium">Completed</span>}
                
                <h2 className="text-2xl font-bold text-dark-900">{job.title}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-dark-500">Payout</p>
                <p className="text-2xl font-bold text-primary-600">₹{job.payout}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-dark-50 rounded-lg text-dark-500 mt-1"><FiMapPin /></div>
                <div>
                  <p className="font-semibold text-dark-900">Location</p>
                  <p className="text-dark-600">{job.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-dark-50 rounded-lg text-dark-500 mt-1"><FiClock /></div>
                <div>
                  <p className="font-semibold text-dark-900">Deadline</p>
                  <p className="text-dark-600">{job.deadline}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-dark-50 rounded-lg text-dark-500 mt-1"><FiFileText /></div>
                <div>
                  <p className="font-semibold text-dark-900">Instructions</p>
                  <p className="text-dark-600">{job.instructions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Proof Upload Area (Only shows if job is claimed) */}
          {jobStatus === 'Claimed' && (
            <div className="card p-6 bg-white border border-dark-200 rounded-xl shadow-sm animate-fade-in">
              <h3 className="font-bold text-lg text-dark-900 mb-4">Proof of Completion</h3>
              
              {/* Hidden File Input with Camera Intent */}
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef}
                onChange={handlePhotoCapture}
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group overflow-hidden relative ${proofPhoto ? 'border-primary-500 bg-dark-900' : 'border-dark-200 hover:border-primary-500 hover:bg-primary-50 min-h-[200px]'}`}
              >
                {proofPhoto ? (
                  <>
                    <img src={proofPhoto} alt="Proof Preview" className="w-full h-48 object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2"><FiCamera /> Retake Photo</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FiCamera className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-dark-900">Tap to open camera</p>
                    <p className="text-sm text-dark-500 mt-1">Upload clear visual proof of the completed task</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="card p-6 bg-white border border-dark-200 rounded-xl shadow-sm sticky top-6">
            <h3 className="font-bold text-dark-900 mb-4">Job Actions</h3>
            
            <div className="space-y-3">
              {jobStatus === 'Available' ? (
                <button 
                  onClick={handleClaimJob}
                  disabled={isSubmitting}
                  className="btn btn-primary w-full shadow-lg shadow-primary-200 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Processing...' : 'Claim This Job'}
                </button>
              ) : jobStatus === 'Claimed' ? (
                <button 
                  onClick={handleSubmitCompletion}
                  disabled={isSubmitting}
                  className="btn btn-primary w-full shadow-lg shadow-primary-200 bg-primary-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-700 disabled:opacity-50 transition-all"
                >
                  <FiCheckCircle className="w-5 h-5" /> 
                  {isSubmitting ? 'Uploading...' : 'Submit & Complete'}
                </button>
              ) : (
                <div className="bg-success/10 text-success-700 p-3 rounded-lg text-center font-bold flex items-center justify-center gap-2">
                  <FiCheckCircle className="w-5 h-5" /> Job Completed
                </div>
              )}

              {jobStatus !== 'Completed' && (
                <button className="btn w-full text-error border border-error/50 hover:bg-error/10 py-3 rounded-lg font-medium transition-colors">
                  Report Issue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;