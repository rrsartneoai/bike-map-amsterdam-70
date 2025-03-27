
import { toast } from 'sonner';
import { NETWORK_DELAYS } from './constants';

// Public transport API base URL (currently mocked)
const PUBLIC_TRANSPORT_API_URL = 'https://api.ns.nl/v2/departures';

// Types for public transport data
interface TransportDeparture {
  id: string;
  line?: string;
  departureTime: string;
  destination: string;
  platform?: string;
  delay: number;
}

interface PublicTransportData {
  train: TransportDeparture[];
  tram: TransportDeparture[];
  bus: TransportDeparture[];
}

// Get public transport departures
export const fetchPublicTransportDepartures = async (): Promise<PublicTransportData> => {
  try {
    // In a real implementation, this would be:
    // const response = await fetch(PUBLIC_TRANSPORT_API_URL, {
    //   headers: {
    //     'Ocp-Apim-Subscription-Key': 'your-api-key'
    //   }
    // });
    // if (!response.ok) throw new Error(`API Error: ${response.status}`);
    // const data = await response.json();
    
    // Simulating network delay for mock data
    await new Promise(resolve => setTimeout(resolve, NETWORK_DELAYS.FETCH_BIKE_RENTALS));
    
    // Mock public transport data
    const mockPublicTransportData: PublicTransportData = {
      train: [
        { id: "t1", departureTime: "13:24", destination: "Utrecht Centraal", platform: "2a", delay: 0 },
        { id: "t2", departureTime: "13:31", destination: "Rotterdam Centraal", platform: "5b", delay: 3 },
        { id: "t3", departureTime: "13:37", destination: "Schiphol Airport", platform: "4", delay: 0 },
        { id: "t4", departureTime: "13:45", destination: "Den Haag Centraal", platform: "7", delay: 0 },
        { id: "t5", departureTime: "13:52", destination: "Eindhoven", platform: "3", delay: 5 }
      ],
      tram: [
        { id: "tr1", line: "2", departureTime: "13:20", destination: "Nieuw Sloten", delay: 0 },
        { id: "tr2", line: "5", departureTime: "13:25", destination: "Westergasfabriek", delay: 2 },
        { id: "tr3", line: "12", departureTime: "13:30", destination: "Amstel Station", delay: 0 },
        { id: "tr4", line: "14", departureTime: "13:35", destination: "Flevopark", delay: 0 },
        { id: "tr5", line: "26", departureTime: "13:40", destination: "IJburg", delay: 0 }
      ],
      bus: [
        { id: "b1", line: "21", departureTime: "13:22", destination: "Geuzenveld", delay: 0 },
        { id: "b2", line: "32", departureTime: "13:28", destination: "Muiderpoort", delay: 4 },
        { id: "b3", line: "48", departureTime: "13:33", destination: "Station Sloterdijk", delay: 0 },
        { id: "b4", line: "65", departureTime: "13:39", destination: "KNSM-Island", delay: 0 },
        { id: "b5", line: "18", departureTime: "13:44", destination: "Osdorp De Aker", delay: 1 }
      ]
    };
    
    console.log("Mock public transport departures loaded");
    return mockPublicTransportData;
  } catch (error) {
    toast.error("Failed to load public transport departures");
    console.error("API Error:", error);
    return { train: [], tram: [], bus: [] };
  }
};
