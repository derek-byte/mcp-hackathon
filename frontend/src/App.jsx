import React, { useState, useEffect } from 'react';
import { Plane, Hotel, MapPin, Calendar, DollarSign, Star, TrendingDown, Search, Filter, Globe } from 'lucide-react';

const TravelDealsDashboard = () => {
  const [searchType, setSearchType] = useState('flights');
  const [searchParams, setSearchParams] = useState({
    origin: 'New York',
    destination: 'Paris',
    departureDate: '2025-07-15',
    returnDate: '2025-07-22',
    guests: 2,
    budget: ''
  });
  const [deals, setDeals] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [insights, setInsights] = useState(null);

  // Mock deals data
  const mockFlightDeals = [
    {
      id: 1,
      title: 'New York to Paris Round-trip',
      price: 450,
      originalPrice: 680,
      savings: 230,
      provider: 'Skyscanner',
      rating: 4.5,
      dates: '2025-07-15 - 2025-07-22',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop',
      dealType: 'flash-sale',
      duration: '8h 30m'
    },
    {
      id: 2,
      title: 'Direct Flight NYC-Paris',
      price: 520,
      originalPrice: 750,
      savings: 230,
      provider: 'Expedia',
      rating: 4.3,
      dates: '2025-07-15 - 2025-07-22',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=300&h=200&fit=crop',
      dealType: 'early-bird',
      duration: '7h 45m'
    },
    {
      id: 3,
      title: 'Premium Economy Special',
      price: 680,
      originalPrice: 950,
      savings: 270,
      provider: 'Kayak',
      rating: 4.7,
      dates: '2025-07-15 - 2025-07-22',
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop',
      dealType: 'premium',
      duration: '7h 20m'
    }
  ];

  const mockHotelDeals = [
    {
      id: 1,
      title: 'Luxury Hotel in Paris',
      price: 180,
      originalPrice: 280,
      savings: 100,
      provider: 'Booking.com',
      rating: 4.7,
      dates: '2025-07-15 - 2025-07-22',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop',
      dealType: 'weekend-special',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
    },
    {
      id: 2,
      title: 'Boutique Hotel Paris',
      price: 145,
      originalPrice: 220,
      savings: 75,
      provider: 'Hotels.com',
      rating: 4.4,
      dates: '2025-07-15 - 2025-07-22',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop',
      dealType: 'last-minute',
      amenities: ['WiFi', 'Breakfast', 'Gym']
    }
  ];

  const mockInsights = {
    destination: 'Paris',
    bestTimeToVisit: 'April-June, September-November',
    avgTemperature: '22°C (72°F)',
    currency: 'EUR',
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre Dame', 'Arc de Triomphe'],
    travelTips: [
      'Book flights 6-8 weeks in advance for best deals',
      'Consider off-season travel for 40% savings',
      'Use public transport for budget-friendly local travel',
      'Many museums are free on first Sunday of each month'
    ],
    currentDealsAvailable: 12,
    avgSavingsThisMonth: '34%',
    popularMonths: ['May', 'June', 'September', 'October']
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (searchType === 'flights') {
        setDeals(mockFlightDeals);
      } else {
        setDeals(mockHotelDeals);
      }
      setInsights(mockInsights);
      setIsSearching(false);
    }, 2000);
  };

  const getDealBadgeColor = (dealType) => {
    switch(dealType) {
      case 'flash-sale': return 'bg-red-100 text-red-800 border-red-200';
      case 'early-bird': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'weekend-special': return 'bg-green-100 text-green-800 border-green-200';
      case 'last-minute': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDealType = (dealType) => {
    return dealType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  useEffect(() => {
    // Auto-search on component mount
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">TravelDeals MCP</h1>
          </div>
          <p className="text-gray-600 text-lg">AI-Powered Travel Deal Discovery via Model Context Protocol</p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-1" />
              Real-time Search
            </div>
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 mr-1" />
              Best Savings
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Smart Filtering
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search Type Toggle */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchType('flights')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'flights' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Plane className="h-4 w-4 mr-2" />
                  Flights
                </button>
                <button
                  onClick={() => setSearchType('hotels')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    searchType === 'hotels' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Hotel className="h-4 w-4 mr-2" />
                  Hotels
                </button>
              </div>
            </div>

            {/* Origin (for flights only) */}
            {searchType === 'flights' && (
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="text"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Origin city"
                />
              </div>
            )}

            {/* Destination */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'flights' ? 'To' : 'Destination'}
              </label>
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Destination"
              />
            </div>

            {/* Dates */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'flights' ? 'Departure' : 'Check-in'}
              </label>
              <input
                type="date"
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams({...searchParams, departureDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'flights' ? 'Return' : 'Check-out'}
              </label>
              <input
                type="date"
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams({...searchParams, returnDate: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105 disabled:transform-none"
            >
              <Search className="h-5 w-5" />
              <span>{isSearching ? 'Searching...' : 'Find Deals'}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for the best deals across multiple platforms...</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>✓ Checking Skyscanner, Expedia, Booking.com</p>
                <p>✓ Comparing prices and savings</p>
                <p>✓ Finding exclusive deals</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!isSearching && deals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Deals List */}
            <div className="lg:col-span-2">
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
                  <div key={deal.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Insights Sidebar */}
            <div className="space-y-6">
              {/* Destination Insights */}
              {insights && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
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
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Current Deals</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Available deals:</span>
                        <span className="font-medium text-blue-600">{insights.currentDealsAvailable}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Avg savings:</span>
                        <span className="font-medium text-green-600">{insights.avgSavingsThisMonth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Travel Tips */}
              {insights && (
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
              )}
              
              {/* Deal Alerts */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">🔔 Deal Alerts</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get notified when prices drop for your saved destinations
                </p>
                <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Set Price Alert
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">1M+</div>
            <div className="text-sm text-gray-600">Deals Searched Daily</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">$450</div>
            <div className="text-sm text-gray-600">Average Savings</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">50+</div>
            <div className="text-sm text-gray-600">Travel Partners</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Real-time Updates</div>
          </div>
        </div>
        
        {/* MCP Tech Stack */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Powered by Model Context Protocol (MCP)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-medium text-blue-900">MCP Protocol</p>
              <p className="text-blue-600">AI Integration</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Search className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-medium text-green-900">Multi-API Search</p>
              <p className="text-green-600">Real-time Data</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingDown className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="font-medium text-purple-900">Smart Comparison</p>
              <p className="text-purple-600">Best Deals</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Filter className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="font-medium text-orange-900">AI Filtering</p>
              <p className="text-orange-600">Personalized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDealsDashboard;