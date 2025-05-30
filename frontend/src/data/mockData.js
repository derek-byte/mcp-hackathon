export const mockFlightDeals = (searchParams) => [
    {
      id: 1,
      title: `${searchParams.origin} to ${searchParams.destination} Round-trip`,
      price: 450,
      originalPrice: 680,
      savings: 230,
      provider: 'Skyscanner',
      rating: 4.5,
      dates: `${searchParams.departureDate} - ${searchParams.returnDate}`,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop',
      dealType: 'flash-sale',
      duration: '8h 30m'
    },
    {
      id: 2,
      title: `Direct Flight ${searchParams.origin}-${searchParams.destination}`,
      price: 520,
      originalPrice: 750,
      savings: 230,
      provider: 'Expedia',
      rating: 4.3,
      dates: `${searchParams.departureDate} - ${searchParams.returnDate}`,
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
      dates: `${searchParams.departureDate} - ${searchParams.returnDate}`,
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=300&h=200&fit=crop',
      dealType: 'premium',
      duration: '7h 20m'
    }
  ];
  
  export const mockHotelDeals = (searchParams) => [
    {
      id: 1,
      title: `Luxury Hotel in ${searchParams.destination}`,
      price: 180,
      originalPrice: 280,
      savings: 100,
      provider: 'Booking.com',
      rating: 4.7,
      dates: `${searchParams.departureDate} - ${searchParams.returnDate}`,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop',
      dealType: 'weekend-special',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
    },
    {
      id: 2,
      title: `Boutique Hotel ${searchParams.destination}`,
      price: 145,
      originalPrice: 220,
      savings: 75,
      provider: 'Hotels.com',
      rating: 4.4,
      dates: `${searchParams.departureDate} - ${searchParams.returnDate}`,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=200&fit=crop',
      dealType: 'last-minute',
      amenities: ['WiFi', 'Breakfast', 'Gym']
    }
  ];
  
  export const mockInsights = (searchParams) => ({
    destination: searchParams.destination,
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
  });