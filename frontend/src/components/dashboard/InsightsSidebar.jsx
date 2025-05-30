// components/dashboard/InsightsSidebar.jsx
import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

export const InsightsSidebar = ({ insights }) => {
  if (!insights) return null;

  return (
    <>
      {/* Destination Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-purple-600" />
          {insights.destination} Insights
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Time to Visit</h4>
            <p className="text-sm text-gray-600">{insights.bestTimeToVisit}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Weather</h4>
            <p className="text-sm text-gray-600">{insights.avgTemperature}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Top Attractions</h4>
            <div className="flex flex-wrap gap-1">
              {insights.topAttractions.slice(0, 4).map((attraction, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">
                  {attraction}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Travel Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Money-Saving Tips
        </h3>
        
        <div className="space-y-3">
          {insights.travelTips.map((tip, idx) => (
            <div key={idx} className="flex items-start">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm text-gray-600">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};