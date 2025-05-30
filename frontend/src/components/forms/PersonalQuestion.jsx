// components/forms/DestinationQuestion.jsx
import React from 'react';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';

export const PersonalQuestion = ({ onNext, onBack, travelType, name, email, onNameChange, onEmailChange }) => {
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
          <h2 className="text-4xl font-bold mb-2">Personal Details</h2>
          <p className="text-lg opacity-90">Contact Information</p>
        </div>
        
        <div className="space-y-4">
          {travelType === 'flights' && (
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                autoFocus
              />
            </div>
          )}
          
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={"Email"}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              autoFocus={travelType === 'hotels'}
            />
          </div>
        </div>
        
        <button
          onClick={onNext}
          className="mt-8 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};