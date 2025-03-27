
import { BikeRentalApiResponse, BikeRental, SearchResult } from '@/types';
import { toast } from 'sonner';

// Mock data for development (to be replaced with real API calls)
const MOCK_BIKE_RENTALS: BikeRental[] = [
  {
    id: "rental-1",
    name: "Central Station Bike Rental",
    operator: "OV-fiets",
    address: "Stationsplein 9, 1012 AB Amsterdam",
    location: {
      lat: 52.3791,
      lng: 4.9003
    },
    bikes: {
      total: 120,
      available: 45,
      types: {
        "city": 30,
        "electric": 10,
        "cargo": 5
      }
    },
    openingHours: [
      { days: "Monday-Friday", hours: "06:00-01:00" },
      { days: "Saturday-Sunday", hours: "07:00-01:00" }
    ],
    prices: [
      { type: "Basic", price: "3.85", unit: "24h", description: "City bike rental" },
      { type: "Electric", price: "5.85", unit: "24h", description: "Electric bike rental" }
    ],
    amenities: ["Repair", "Helmets", "Baskets"],
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1592143245926-89b2265d2688?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  },
  {
    id: "rental-2",
    name: "MacBike Centraal",
    operator: "MacBike",
    address: "Oosterdokskade 10, 1011 AE Amsterdam",
    location: {
      lat: 52.3751,
      lng: 4.9079
    },
    bikes: {
      total: 200,
      available: 85,
      types: {
        "city": 50,
        "electric": 25,
        "tandem": 10
      }
    },
    openingHours: [
      { days: "Monday-Sunday", hours: "09:00-18:00" }
    ],
    prices: [
      { type: "Basic", price: "9.75", unit: "day", description: "City bike rental" },
      { type: "Electric", price: "21.00", unit: "day", description: "Electric bike rental" }
    ],
    amenities: ["Child seats", "Locks", "Maps"],
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  },
  {
    id: "rental-3",
    name: "A-Bike Rental",
    operator: "A-Bike",
    address: "Piet Heinkade 11, 1019 BR Amsterdam",
    location: {
      lat: 52.3831,
      lng: 4.9141
    },
    bikes: {
      total: 85,
      available: 28,
      types: {
        "city": 20,
        "electric": 5,
        "child": 3
      }
    },
    openingHours: [
      { days: "Monday-Sunday", hours: "08:30-19:30" }
    ],
    prices: [
      { type: "Basic", price: "8.50", unit: "day", description: "City bike rental" }
    ],
    amenities: ["Guided tours", "Helmets"],
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  },
  {
    id: "rental-4",
    name: "Green Budget Bikes",
    operator: "Green Wheels",
    address: "Raadhuisstraat 27, 1016 DB Amsterdam",
    location: {
      lat: 52.3730,
      lng: 4.8830
    },
    bikes: {
      total: 60,
      available: 15,
      types: {
        "city": 15
      }
    },
    openingHours: [
      { days: "Monday-Sunday", hours: "10:00-18:00" }
    ],
    prices: [
      { type: "Basic", price: "7.50", unit: "day", description: "Budget city bike" }
    ],
    amenities: ["Baskets", "Budget friendly"],
    rating: 3.9,
    images: ["https://images.unsplash.com/photo-1503669678209-c68d00b3765d?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  },
  {
    id: "rental-5",
    name: "Bike & Scooter City",
    operator: "B&S Rentals",
    address: "Jan van Galenstraat 115, 1056 BL Amsterdam",
    location: {
      lat: 52.3681,
      lng: 4.8580
    },
    bikes: {
      total: 120,
      available: 60,
      types: {
        "city": 30,
        "electric": 20,
        "cargo": 10
      }
    },
    openingHours: [
      { days: "Monday-Friday", hours: "08:00-20:00" },
      { days: "Saturday-Sunday", hours: "09:00-21:00" }
    ],
    prices: [
      { type: "Basic", price: "12.00", unit: "day", description: "City bike rental" },
      { type: "Electric", price: "25.00", unit: "day", description: "Electric bike rental" }
    ],
    amenities: ["Scooters", "Cargo bikes", "Child seats"],
    rating: 4.1,
    images: ["https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  },
  {
    id: "rental-6",
    name: "Yellow Bike",
    operator: "Yellow Bike Tours",
    address: "Nieuwezijds Kolk 29, 1012 PV Amsterdam",
    location: {
      lat: 52.3758,
      lng: 4.8932
    },
    bikes: {
      total: 150,
      available: 72,
      types: {
        "city": 60,
        "tandem": 12
      }
    },
    openingHours: [
      { days: "Daily", hours: "09:00-18:00" }
    ],
    prices: [
      { type: "Basic", price: "9.00", unit: "day", description: "City bike rental" },
      { type: "Tandem", price: "19.00", unit: "day", description: "Tandem bike rental" }
    ],
    amenities: ["Guided tours", "Locks", "Maps"],
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1528629297340-d1d466945dc5?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  }
];

// API endpoints (to be implemented with real API)
const API_BASE_URL = "https://api.example.com"; // Replace with actual API URL

// Fetch bike rentals (currently using mock data)
export const fetchBikeRentals = async (): Promise<BikeRentalApiResponse> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/bike-rentals`);
    // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    // const data = await response.json();
    // return data;
    
    // Simulating network delay with mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
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

// Search locations (currently using mock data)
export const searchLocations = async (query: string): Promise<SearchResult[]> => {
  try {
    // In a real implementation, this would call a geocoding API
    // Simulating a search with our mock data
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search through mock bike rentals
    const matchingRentals = MOCK_BIKE_RENTALS
      .filter(rental => 
        rental.name.toLowerCase().includes(normalizedQuery) || 
        rental.address?.toLowerCase().includes(normalizedQuery) ||
        rental.operator?.toLowerCase().includes(normalizedQuery)
      )
      .map(rental => ({
        id: rental.id,
        name: rental.name,
        address: rental.address,
        location: rental.location,
        type: 'bikeRental' as const
      }))
      .slice(0, 5);
    
    return matchingRentals;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
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
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const rental = MOCK_BIKE_RENTALS.find(r => r.id === id);
    if (!rental) {
      throw new Error(`Bike rental with ID ${id} not found`);
    }
    
    return rental;
  } catch (error) {
    toast.error("Failed to load rental details");
    console.error("API Error:", error);
    return null;
  }
};

// Calculate route (to be implemented with real API)
export const calculateRoute = async (
  from: [number, number], 
  to: [number, number]
): Promise<any> => {
  try {
    // In a real implementation, this would call a routing API like Mapbox Directions or OpenRouteService
    toast.info("Route calculation would be implemented with a real routing API");
    
    return null;
  } catch (error) {
    toast.error("Failed to calculate route");
    console.error("Routing Error:", error);
    return null;
  }
};
