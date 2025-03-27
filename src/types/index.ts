
// Bike Rental Station Types
export interface BikeRental {
  id: string;
  name: string;
  operator?: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
  bikes: BikeAvailability;
  openingHours?: OpeningHours[];
  prices?: PriceInfo[];
  amenities?: string[];
  rating?: number;
  images?: string[];
  lastUpdated?: string;
}

export interface BikeAvailability {
  total: number;
  available: number;
  types: {
    [key: string]: number; // e.g., "city": 5, "electric": 3
  };
}

export interface OpeningHours {
  days: string;
  hours: string;
}

export interface PriceInfo {
  type: string;
  price: string;
  unit: string;
  description?: string;
}

// Filter Types
export interface FilterOptions {
  bikeTypes: string[];
  operators: string[];
  amenities: string[];
  onlyAvailable: boolean;
  priceRange: [number, number];
}

// Search Types
export interface SearchResult {
  id: string;
  name: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'bikeRental' | 'place' | 'address';
  distance?: number;
}

// Map Types
export interface MapState {
  center: [number, number];
  zoom: number;
  selected?: string;
}

// API Response Types
export interface BikeRentalApiResponse {
  data: BikeRental[];
  meta?: {
    totalCount: number;
    source: string;
    lastUpdated: string;
  };
}
