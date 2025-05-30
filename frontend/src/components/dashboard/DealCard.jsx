// components/dashboard/DealCard.jsx
import React from 'react';
import { Calendar, Plane, Star } from 'lucide-react';
import { getDealBadgeColor, formatDealType } from '../../utils/dealHelpers';

export const DealCard = ({ deal, searchType }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Deal Image */}
        <div className="md:w-48 h-48 md:h-auto">
          <img 
            src={deal.image} 
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Deal Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{deal.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {deal.dates}
                </div>
                {searchType === 'flights' && (
                  <div className="flex items-center">
                    <Plane className="h-4 w-4 mr-1" />
                    {deal.duration}
                  </div>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs border ${getDealBadgeColor(deal.dealType)}`}>
              {formatDealType(deal.dealType)}
            </span>
          </div>
          
          {/* Provider and Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              via <span className="font-medium">{deal.provider}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{deal.rating}</span>
            </div>
          </div>
          
          {/* Amenities (for hotels) */}
          {searchType === 'hotels' && deal.amenities && (
            <div className="flex flex-wrap gap-2 mb-4">
              {deal.amenities.map((amenity, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                  {amenity}
                </span>
              ))}
            </div>
          )}
          
          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">${deal.price}</span>
                <span className="text-lg text-gray-400 line-through">${deal.originalPrice}</span>
              </div>
              <div className="text-sm text-green-600 font-medium">
                Save ${deal.savings} ({Math.round((deal.savings / deal.originalPrice) * 100)}%)
              </div>
              {searchType === 'hotels' && (
                <div className="text-xs text-gray-500">per night</div>
              )}
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};