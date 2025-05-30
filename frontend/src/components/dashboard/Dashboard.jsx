// components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { DealsList } from './DealsList';
import { InsightsSidebar } from './InsightsSidebar';
import { mockFlightDeals, mockHotelDeals, mockInsights } from '../../data/mockData';

export const Dashboard = ({ searchParams, searchType }) => {
  const [deals, setDeals] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with MCP
    setTimeout(() => {
      if (searchType === 'flights') {
        setDeals(mockFlightDeals(searchParams));
      } else {
        setDeals(mockHotelDeals(searchParams));
      }
      setInsights(mockInsights(searchParams));
      setIsLoading(false);
    }, 3000);
  }, [searchParams, searchType]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personalized Travel Deals</h1>
          <p className="text-gray-600">Based on your preferences • {deals.length} deals found</p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DealsList deals={deals} searchType={searchType} />
          </div>
          
          <div className="space-y-6">
            <InsightsSidebar insights={insights} />
          </div>
        </div>
      </div>
    </div>
  );
};
