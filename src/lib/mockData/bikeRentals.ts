
import { BikeRental } from '@/types';

// Mock data for development (to be replaced with real API calls)
export const MOCK_BIKE_RENTALS: BikeRental[] = [
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
    images: ["https://images.unsplash.com/photo-1558980394-34764db076b4?auto=format&fit=crop&w=600&q=80"],
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
    images: ["https://images.unsplash.com/photo-1597956158001-b9358a4353af?auto=format&fit=crop&w=600&q=80"],
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
    images: ["https://images.unsplash.com/photo-1538895490524-0ded232a96d8?auto=format&fit=crop&w=600&q=80"],
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
    images: ["https://images.unsplash.com/photo-1531604250646-2f0e818c4f06?auto=format&fit=crop&w=600&q=80"],
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
    images: ["https://images.unsplash.com/photo-1552323543-4cffa4ffffe3?auto=format&fit=crop&w=600&q=80"],
    lastUpdated: new Date().toISOString()
  }
];
