// components/dashboard/LoadingScreen.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Finding Your Perfect Deals</h3>
            <p className="text-gray-600 mb-6">Using AI to search across 50+ platforms...</p>
            
            <div className="space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <span className="text-gray-600">Searching Skyscanner</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse animation-delay-200">
                <span className="text-gray-600">Comparing prices on Expedia</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse animation-delay-400">
                <span className="text-gray-600">Analyzing deals on Booking.com</span>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
