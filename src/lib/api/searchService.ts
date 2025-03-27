
import { SearchResult } from '@/types';
import { MOCK_BIKE_RENTALS } from '../mockData/bikeRentals';
import { NETWORK_DELAYS } from './constants';

// Search locations (currently using mock data)
export const searchLocations = async (query: string): Promise<SearchResult[]> => {
  try {
    // In a real implementation, this would call a geocoding API
    // Simulating a search with our mock data
    await new Promise(resolve => setTimeout(resolve, NETWORK_DELAYS.SEARCH_LOCATIONS));
    
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    console.log("Searching for:", normalizedQuery);
    
    // Search through mock bike rentals
    const matchingRentals = MOCK_BIKE_RENTALS
      .filter(rental => {
        const nameMatch = rental.name?.toLowerCase().includes(normalizedQuery);
        const addressMatch = rental.address?.toLowerCase().includes(normalizedQuery);
        const operatorMatch = rental.operator?.toLowerCase().includes(normalizedQuery);
        
        console.log(`Checking rental: ${rental.name}, matches: name=${nameMatch}, address=${addressMatch}, operator=${operatorMatch}`);
        
        return nameMatch || addressMatch || operatorMatch;
      })
      .map(rental => ({
        id: rental.id,
        name: rental.name,
        address: rental.address,
        location: rental.location,
        type: 'bikeRental' as const
      }));
    
    console.log(`Found ${matchingRentals.length} matching rentals`);
    return matchingRentals;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};
