
import { BikeRentalApiResponse, BikeRental } from '@/types';
import { toast } from 'sonner';
import { API_BASE_URL, NETWORK_DELAYS } from './constants';
import { MOCK_BIKE_RENTALS } from '../mockData/bikeRentals';

// Fetch bike rentals (currently using mock data)
export const fetchBikeRentals = async (): Promise<BikeRentalApiResponse> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/bike-rentals`);
    // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    // const data = await response.json();
    // return data;
    
    // Simulating network delay with mock data
    await new Promise(resolve => setTimeout(resolve, NETWORK_DELAYS.FETCH_BIKE_RENTALS));
    
    console.log("Returning mock bike rentals:", MOCK_BIKE_RENTALS.length);
    
    return {
      data: MOCK_BIKE_RENTALS,
      meta: {
        totalCount: MOCK_BIKE_RENTALS.length,
        source: "mock-data",
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    toast.error("Failed to load bike rental locations");
    console.error("API Error:", error);
    throw error;
  }
};

// Get bike rental details
export const getBikeRentalDetails = async (id: string): Promise<BikeRental | null> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/bike-rentals/${id}`);
    // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    // const data = await response.json();
    // return data;
    
    // Simulating network delay with mock data
    await new Promise(resolve => setTimeout(resolve, NETWORK_DELAYS.GET_RENTAL_DETAILS));
    
    console.log("Looking for rental with ID:", id);
    const rental = MOCK_BIKE_RENTALS.find(r => r.id === id);
    
    if (!rental) {
      console.log("Rental not found with ID:", id);
      console.log("Available IDs:", MOCK_BIKE_RENTALS.map(r => r.id));
      throw new Error(`Bike rental with ID ${id} not found`);
    }
    
    console.log("Found rental details:", rental.name);
    return rental;
  } catch (error) {
    toast.error("Failed to load rental details");
    console.error("API Error:", error);
    return null;
  }
};
