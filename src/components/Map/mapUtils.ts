
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { BikeRental } from '@/types';
import { toast } from 'sonner';

// Initialize Leaflet default icons
export const initializeLeafletIcons = () => {
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  
  L.Marker.prototype.options.icon = DefaultIcon;
};

// Fetch bike rentals from Overpass API
export const fetchBikeRentalsFromOverpass = async (): Promise<BikeRental[]> => {
  const query = `
    [out:json][timeout:60];
    area[name="Amsterdam"][admin_level=8]->.amsterdam;
    (
      node["amenity"="bicycle_rental"]["access"!="private"](area.amsterdam);
      node["amenity"="bicycle_sharing"](area.amsterdam);
    );
    out body;
    >;
    out body qt;
  `;

  const encodedQuery = encodeURIComponent(query.trim());
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodedQuery}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !data.elements || !Array.isArray(data.elements)) {
    throw new Error('Invalid data received');
  }

  // Process the data from Overpass API
  return data.elements.map((element: any) => {
    // Get the actual information from the Overpass API
    const name = element.tags?.name || 'Bike Rental';
    const operator = element.tags?.operator || element.tags?.network || 'Unknown';

    // For bike counts, use the actual data when available
    let available = 0;
    let total = 0;

    if (element.tags?.capacity) {
      total = parseInt(element.tags.capacity, 10) || 0;
    }

    if (element.tags?.available_bikes) {
      available = parseInt(element.tags.available_bikes, 10) || 0;
    } else if (total > 0) {
      // Only estimate if we have a total and no available count
      available = Math.floor(Math.random() * (total * 0.3) + (total * 0.5));
    }

    // For empty capacity, provide a reasonable default based on the type
    if (total === 0) {
      if (element.tags?.bicycle_rental === 'shop' ||
        element.tags?.shop === 'rental' ||
        element.tags?.shop === 'bicycle') {
        // Bike shops typically have more bikes
        total = 20;
        available = 15;
      } else {
        // Regular bike stations often have fewer
        total = 10;
        available = 6;
      }
    }

    // Create bike types from available tags
    const bikeTypes: Record<string, number> = {};
    if (element.tags?.bicycle_types) {
      bikeTypes[element.tags.bicycle_types.toLowerCase()] = available;
    } else if (element.tags?.rental) {
      const types = element.tags.rental.split(';');
      let typesTotal = available;
      types.forEach((type: string, index: number) => {
        const count = index === types.length - 1 ? typesTotal : Math.ceil(typesTotal / (types.length - index));
        bikeTypes[type.trim()] = count;
        typesTotal -= count;
      });
    } else {
      // Default to city bikes if no type info available
      bikeTypes['city'] = available;
    }

    // Extract amenities from tags
    const amenities: string[] = [];
    if (element.tags?.service) {
      amenities.push(element.tags.service);
    }
    if (element.tags?.['service:bicycle:repair'] === 'yes') {
      amenities.push('Repair');
    }
    if (element.tags?.['service:bicycle:pump'] === 'yes') {
      amenities.push('Pump');
    }

    // Create the address
    let address = '';
    if (element.tags?.['addr:street'] && element.tags?.['addr:housenumber']) {
      address = `${element.tags['addr:street']} ${element.tags['addr:housenumber']}`;
      if (element.tags?.['addr:postcode']) {
        address += `, ${element.tags['addr:postcode']}`;
      }
      if (element.tags?.['addr:city']) {
        address += ` ${element.tags['addr:city']}`;
      }
    }

    // Construct the rental object with proper typing
    const rental = {
      id: element.id.toString(),
      name: name,
      operator: operator,
      address: address || undefined,
      location: {
        lat: element.lat,
        lng: element.lon
      },
      bikes: {
        total: total,
        available: available,
        types: bikeTypes
      },
      amenities: amenities,
      lastUpdated: new Date().toISOString()
    };
    
    // Log each rental for debugging
    console.log('Rental data:', rental);
    
    return rental;
  });
};

// Validate rental coordinates
export const hasValidCoordinates = (rental: BikeRental): boolean => {
  return Boolean(
    rental.location && 
    typeof rental.location.lat === 'number' && 
    typeof rental.location.lng === 'number' &&
    !isNaN(rental.location.lat) && 
    !isNaN(rental.location.lng)
  );
};
