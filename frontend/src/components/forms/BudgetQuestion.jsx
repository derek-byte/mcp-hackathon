// components/forms/BudgetQuestion.jsx
import React from 'react';
import { DollarSign, ArrowLeft, Sparkles } from 'lucide-react';

export const BudgetQuestion = ({ onNext, onBack, budget, onBudgetChange, onSearch }) => {
  const budgetOptions = [
    { value: 'budget', label: 'Budget', description: 'Best value deals' },
    { value: 'standard', label: 'Standard', description: 'Comfort & quality' },
    { value: 'premium', label: 'Premium', description: 'Luxury experience' },
    { value: 'any', label: 'Any Budget', description: 'Show all options' }
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
          <h2 className="text-4xl font-bold mb-2">What's your budget preference?</h2>
          <p className="text-lg opacity-90">We'll find deals that match your budget</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onBudgetChange(option.value)}
              className={`bg-white/10 backdrop-blur-md border-2 p-6 rounded-xl transition-all hover:scale-105 ${
                budget === option.value ? 'border-white bg-white/20' : 'border-white/30 hover:border-white/60'
              }`}
            >
              <DollarSign className="h-8 w-8 text-white mb-2 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-1">{option.label}</h3>
              <p className="text-white/80 text-sm">{option.description}</p>
            </button>
          ))}
        </div>
        
        <button
          onClick={onSearch}
          className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl flex items-center mx-auto"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Find My Deals
        </button>
      </div>
    </div>
  );
};