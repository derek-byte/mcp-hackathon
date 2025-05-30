// components/forms/WelcomeScreen.jsx
import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';

export const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center text-white animate-fadeIn">
        <div className="mb-8">
          <Globe className="h-20 w-20 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl font-bold mb-4">Let's Find Your Perfect Travel Deal</h1>
          <p className="text-xl opacity-90">AI-powered search across 50+ platforms to get you the best prices</p>
        </div>
        
        <button
          onClick={onNext}
          className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl flex items-center mx-auto"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        
        <p className="mt-8 text-sm opacity-75">Takes only 2 minutes • Personalized results</p>
      </div>
    </div>
  );
};