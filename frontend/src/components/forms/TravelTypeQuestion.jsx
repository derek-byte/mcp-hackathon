// components/forms/TravelTypeQuestion.jsx
import React from 'react';
import { Plane, Hotel, ArrowLeft } from 'lucide-react';

export const TravelTypeQuestion = ({ onNext, onBack, value, onChange }) => {
  const options = [
    { id: 'flights', icon: Plane, label: 'Flights', description: 'Find the best airfare deals' },
    { id: 'hotels', icon: Hotel, label: 'Hotels', description: 'Discover amazing accommodations' }
  ];

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
          <h2 className="text-4xl font-bold mb-2">What are you looking for?</h2>
          <p className="text-lg opacity-90">Choose your travel type</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setTimeout(onNext, 300);
              }}
              className={`bg-white/10 backdrop-blur-md border-2 p-6 rounded-xl transition-all hover:scale-105 ${
                value === option.id ? 'border-white bg-white/20' : 'border-white/30 hover:border-white/60'
              }`}
            >
              <option.icon className="h-12 w-12 text-white mb-3 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-1">{option.label}</h3>
              <p className="text-white/80 text-sm">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};