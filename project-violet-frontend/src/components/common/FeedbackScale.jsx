import React, { useState } from 'react';

const FeedbackScale = ({ onSubmit, targetName }) => {
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(rating, comment);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm w-full max-w-md space-y-4">
      <h3 className="font-bold text-lg text-gray-900">
        How reliable was {targetName || 'this'}?
      </h3>
      
      {/* 1 to 10 Number Row */}
      <div className="flex justify-between gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => setRating(num)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm font-bold transition-all ${
              rating === num 
                ? 'bg-violet-600 text-white shadow-md transform scale-110' 
                : 'bg-gray-100 text-gray-600 hover:bg-violet-100'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 font-medium">
        <span>1 - Very Poor</span>
        <span>10 - Excellent</span>
      </div>

      <textarea
        className="w-full p-3 border rounded-lg text-sm mt-4 focus:ring-2 focus:ring-violet-600 outline-none"
        placeholder="Leave a comment (Optional)"
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors disabled:bg-violet-300"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
};

export default FeedbackScale;