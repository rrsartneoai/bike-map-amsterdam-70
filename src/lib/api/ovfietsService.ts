
import { toast } from 'sonner';
import { BikeRental } from '@/types';
import { NETWORK_DELAYS } from './constants';

// OV-fiets API base URL (currently mocked)
const OV_FIETS_API_URL = 'https://api.ns.nl/v1/ovfiets/locations';

// Get OV-fiets locations
export const fetchOVFietsLocations = async (): Promise<BikeRental[]> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(OV_FIETS_API_URL, {
    //   headers: {
    //     'Ocp-Apim-Subscription-Key': 'your-api-key'
    //   }
    // });
    // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    // const data = await response.json();
    
    // Simulating network delay for mock data
    await new Promise(resolve => setTimeout(resolve, NETWORK_DELAYS.FETCH_BIKE_RENTALS));
    
    // Mock OV-fiets data based on real stations
    const mockOVFietsData: BikeRental[] = [
      {
        id: "ovfiets-amstc",
        name: "Amsterdam Centraal OV-fiets",
        operator: "NS OV-fiets",
        address: "Stationsplein 1, 1012 AB Amsterdam",
        location: {
          lat: 52.3790,
          lng: 4.9000
        },
        bikes: {
          total: 450,
          available: 217,
          types: {
            "city": 217
          }
        },
        openingHours: [
          { days: "Monday-Friday", hours: "05:00-01:30" },
          { days: "Saturday-Sunday", hours: "07:00-01:00" }
        ],
        prices: [
          { type: "OV-fiets", price: "3.95", unit: "24h", description: "Standard OV-fiets rental" }
        ],
        amenities: ["OV-chipkaart", "24h Return"],
        rating: 4.5,
        images: ["https://images.unsplash.com/photo-1592143245926-89b2265d2688?auto=format&fit=crop&w=600&q=80"],
        lastUpdated: new Date().toISOString()
      },
      {
        id: "ovfiets-amsz",
        name: "Amsterdam Zuid OV-fiets",
        operator: "NS OV-fiets",
        address: "Mathijs Vermeulenpad 1, 1077 XX Amsterdam",
        location: {
          lat: 52.3389,
          lng: 4.8730
        },
        bikes: {
          total: 250,
          available: 124,
          types: {
            "city": 124
          }
        },
        openingHours: [
          { days: "Monday-Friday", hours: "06:30-01:00" },
          { days: "Saturday-Sunday", hours: "07:00-01:00" }
        ],
        prices: [
          { type: "OV-fiets", price: "3.95", unit: "24h", description: "Standard OV-fiets rental" }
        ],
        amenities: ["OV-chipkaart", "Bicycle Parking"],
        rating: 4.3,
        images: ["https://images.unsplash.com/photo-1592143245926-89b2265d2688?auto=format&fit=crop&w=600&q=80"],
        lastUpdated: new Date().toISOString()
      },
      {
        id: "ovfiets-amsb",
        name: "Amsterdam Bijlmer OV-fiets",
        operator: "NS OV-fiets",
        address: "Hoekenrode 4, 1102 BR Amsterdam",
        location: {
          lat: 52.3121,
          lng: 4.9468
        },
        bikes: {
          total: 150,
          available: 83,
          types: {
            "city": 83
          }
        },
        openingHours: [
          { days: "Monday-Friday", hours: "06:30-00:30" },
          { days: "Saturday-Sunday", hours: "08:00-00:00" }
        ],
        prices: [
          { type: "OV-fiets", price: "3.95", unit: "24h", description: "Standard OV-fiets rental" }
        ],
        amenities: ["OV-chipkaart"],
        rating: 4.1,
        images: ["https://images.unsplash.com/photo-1592143245926-89b2265d2688?auto=format&fit=crop&w=600&q=80"],
        lastUpdated: new Date().toISOString()
      }
    ];
    
    console.log("Mock OV-fiets locations:", mockOVFietsData.length);
    return mockOVFietsData;
  } catch (error) {
    toast.error("Failed to load OV-fiets locations");
    console.error("API Error:", error);
    return [];
  }
};

// Get bicycle network routes from Amsterdam Network API (mock implementation)
export const fetchBicycleNetworkRoutes = async () => {
  try {
    // This would connect to the Amsterdam Bicycle Network API
    // const response = await fetch('https://api.opendata.amsterdam.nl/bicycle-network');
    // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    // const data = await response.json();
    
    // For now, return mock data structure
    return {
      mainNetwork: {
        routes: 125,
        totalLength: 400, // km
        condition: "Excellent"
      },
      regionalNetwork: {
        routes: 85,
        totalLength: 320, // km
        condition: "Good"
      },
      busiestRoutes: [
        { id: "BR001", name: "Centraal - Dam", avgCyclists: 15000 },
        { id: "BR002", name: "Leidseplein - Vondelpark", avgCyclists: 12500 },
        { id: "BR003", name: "Amstel - Waterlooplein", avgCyclists: 10800 }
      ]
    };
  } catch (error) {
    toast.error("Failed to load bicycle network data");
    console.error("API Error:", error);
    return null;
  }
};
