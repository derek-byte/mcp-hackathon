// components/dashboard/DealsList.jsx
import React from 'react';
import { DealCard } from './DealCard';

export const DealsList = ({ deals, searchType }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Best {searchType === 'flights' ? 'Flight' : 'Hotel'} Deals
        </h2>
        <div className="text-sm text-gray-600">
          {deals.length} deals found • Avg savings: ${Math.round(deals.reduce((acc, deal) => acc + deal.savings, 0) / deals.length)}
        </div>
      </div>
      
      <div className="space-y-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} searchType={searchType} />
        ))}
      </div>
    </>
  );
};