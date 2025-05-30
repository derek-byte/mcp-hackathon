// components/forms/TravelersQuestion.jsx
import React from 'react';
import { Users, ArrowLeft, ArrowRight } from 'lucide-react';

export const TravelersQuestion = ({ onNext, onBack, guests, onGuestsChange }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-slideIn">
        <button
          onClick={onBack}
          className="text-white mb-8 flex items-center hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        
        <div className="text-white mb-8">
          <h2 className="text-4xl font-bold mb-2">How many travelers?</h2>
          <p className="text-lg opacity-90">Tell us about your group</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-white mr-3" />
              <span className="text-white text-lg">Number of travelers</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                -
              </button>
              <span className="text-white text-2xl font-semibold w-8 text-center">{guests}</span>
              <button
                onClick={() => onGuestsChange(guests + 1)}
                className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={onNext}
          className="mt-8 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl flex items-center"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};