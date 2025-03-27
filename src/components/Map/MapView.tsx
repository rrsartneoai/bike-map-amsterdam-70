
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
  const [allBikeRentals, setAllBikeRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

        const rentals = data.elements.map((element: any) => ({
          id: element.id.toString(),
          name: element.tags?.name || 'Bike Rental',
          operator: element.tags?.operator || 'Unknown',
          address: element.tags?.address,
          location: {
            lat: element.lat,
            lng: element.lon
          },
          bikes: {
            total: parseInt(element.tags?.capacity || '0'),
            available: parseInt(element.tags?.available_bikes || '0'),
            types: element.tags?.bicycle_types ? 
              { [element.tags.bicycle_types]: parseInt(element.tags?.available_bikes || '0') } : 
              { 'city': parseInt(element.tags?.available_bikes || '0') }
          },
          amenities: element.tags?.amenity ? [element.tags.amenity] : [],
          lastUpdated: new Date().toISOString()
        }));

        console.log(`Found ${rentals.length} bike rentals in Amsterdam`);
        setAllBikeRentals(rentals);
        
      } catch (error) {
        console.error('Error fetching bike rentals:', error);
        toast.error('Failed to load all bike rental locations');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBikeRentals();
  }, []);

  // Combine the fetched rentals with the ones from props
  const displayRentals = allBikeRentals.length > 0 ? allBikeRentals : bikeRentals;

  return (
    <div className="map-container">
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        ref={(map) => {
          if (map) {
            handleMapInit(map);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />
        
        {!isLoading && !loading && displayRentals.map((rental) => (
          <MapMarker
            key={rental.id}
            rental={rental}
            isSelected={selectedRental ? selectedRental.id === rental.id : mapState.selected === rental.id}
            onClick={handleMarkerClick}
          />
        ))}
      </MapContainer>
      
      {/* Loading indicator for Overpass API */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
            <span className="text-sm font-medium">Loading bike stations...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
