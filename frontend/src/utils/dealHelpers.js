export const getDealBadgeColor = (dealType) => {
    switch(dealType) {
      case 'flash-sale': return 'bg-red-100 text-red-800 border-red-200';
      case 'early-bird': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'weekend-special': return 'bg-green-100 text-green-800 border-green-200';
      case 'last-minute': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  export const formatDealType = (dealType) => {
    return dealType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };