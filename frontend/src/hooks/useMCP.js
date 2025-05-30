import { useState } from 'react';

export const useMCP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDeals = async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, this would make an API call to your MCP backend
      const response = await fetch('/api/mcp/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search_travel_deals',
          parameters: searchParams
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search deals');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchDeals,
    loading,
    error
  };
};