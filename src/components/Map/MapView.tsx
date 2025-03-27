
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap as useLeafletMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from '@/hooks/useMap';
import L from 'leaflet';
import { BikeRental } from '@/types';
import MapMarker from './MapMarker';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map center and zoom changes
const MapController = () => {
  const { mapState } = useMap();
  const map = useLeafletMap();

  useEffect(() => {
    map.setView(mapState.center, mapState.zoom, {
      animate: true,
      duration: 1,
    });
  }, [mapState.center, mapState.zoom, map]);

  return null;
};

interface MapViewProps {
  bikeRentals: BikeRental[];
  isLoading: boolean;
  selectedRental?: BikeRental | null;
  userLocation?: [number, number] | null;
  center?: [number, number];
  zoom?: number;
  onMapInit?: (map: L.Map) => void;
  onMarkerClick?: (rental: BikeRental) => void;
}

const MapView: React.FC<MapViewProps> = ({
  bikeRentals,
  isLoading,
  selectedRental,
  userLocation,
  center,
  zoom,
  onMapInit,
  onMarkerClick
}) => {
  const { mapState, setSelectedRental } = useMap();
  const mapRef = useRef<L.Map | null>(null);
  const [allBikeRentals, setAllBikeRentals] = useState<BikeRental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default map center is Amsterdam
  const defaultCenter: [number, number] = [52.3676, 4.9041];
  const defaultZoom = 13;

  // Handle marker click
  const handleMarkerClick = (rental: BikeRental) => {
    setSelectedRental(rental.id);
    if (onMarkerClick) {
      onMarkerClick(rental);
    }
  };

  // Handle map initialization
  const handleMapInit = (map: L.Map) => {
    mapRef.current = map;
    if (onMapInit) {
      onMapInit(map);
    }
  };

  // Fetch all bike rentals
  useEffect(() => {
    const fetchAllBikeRentals = async () => {
      try {
        setLoading(true);
        setError(null);
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
        const rentals = data.elements.map((element: any) => {
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
          
          return rental;
        });

        console.log(`Found ${rentals.length} bike rentals in Amsterdam`);
        
        // Additional validation and debugging
        const validRentalsCount = rentals.filter(r => 
          r.location && 
          typeof r.location.lat === 'number' && 
          typeof r.location.lng === 'number' &&
          !isNaN(r.location.lat) && 
          !isNaN(r.location.lng)
        ).length;
        
        console.log(`Valid rentals with coordinates: ${validRentalsCount} out of ${rentals.length}`);
        
        if (validRentalsCount === 0) {
          toast.warning("No valid bike rental locations found");
        }
        
        setAllBikeRentals(rentals);

      } catch (error) {
        console.error('Error fetching bike rentals:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        toast.error('Failed to load all bike rental locations');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBikeRentals();
  }, []);

  // Filter out rentals with invalid coordinates
  const validRentals = (displayRentals: BikeRental[]) => {
    return displayRentals.filter(rental => 
      rental.location && 
      typeof rental.location.lat === 'number' && 
      typeof rental.location.lng === 'number' &&
      !isNaN(rental.location.lat) && 
      !isNaN(rental.location.lng)
    );
  };

  // Combine the fetched rentals with the ones from props
  const displayRentals = allBikeRentals.length > 0 ? allBikeRentals : bikeRentals;
  const rentalsToDisplay = validRentals(displayRentals);

  // Log the rentals that will be displayed
  useEffect(() => {
    console.log(`Rentals to display: ${rentalsToDisplay.length}`);
    if (rentalsToDisplay.length > 0) {
      console.log('First rental:', rentalsToDisplay[0]);
    }
  }, [rentalsToDisplay]);

  return (
    <div className="map-container relative h-full w-full">
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        ref={handleMapInit}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />
        
        {!isLoading && !loading && rentalsToDisplay.length > 0 && (
          <>
            {rentalsToDisplay.map((rental) => (
              <MapMarker
                key={rental.id}
                rental={rental}
                isSelected={selectedRental?.id === rental.id}
                onClick={handleMarkerClick}
              />
            ))}
          </>
        )}
      </MapContainer>
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
            <span className="text-sm font-medium">Loading bike stations...</span>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* No results message */}
      {!loading && !error && rentalsToDisplay.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow text-center">
            <p className="font-medium">No bike rentals found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
