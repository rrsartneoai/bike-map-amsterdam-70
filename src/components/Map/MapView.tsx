
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from '@/hooks/useMap';
import { BikeRental } from '@/types';
import MapMarker from './MapMarker';
import MapController from './MapController';
import MapLoading from './MapLoading';
import MapNoResults from './MapNoResults';
import MapError from './MapError';
import { initializeLeafletIcons, fetchBikeRentalsFromOverpass } from './mapUtils';

// Initialize Leaflet icons to fix default icon issue
initializeLeafletIcons();

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

  // Fetch bike rentals from Overpass API
  useEffect(() => {
    const fetchAllBikeRentals = async () => {
      try {
        setLoading(true);
        setError(null);
        const rentals = await fetchBikeRentalsFromOverpass();
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
        
        setAllBikeRentals(rentals);
      } catch (error) {
        console.error('Error fetching bike rentals:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
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

  // Log the rentals that will be displayed for debugging
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
        ref={onMapInit}
        closePopupOnClick={false} // Prevent popup from closing when clicking elsewhere
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />
        
        {rentalsToDisplay.length > 0 && (
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
      {(loading || isLoading) && <MapLoading />}
      
      {/* Error message */}
      {error && <MapError message={error} />}
      
      {/* No results message */}
      {!loading && !error && !isLoading && rentalsToDisplay.length === 0 && (
        <MapNoResults />
      )}
    </div>
  );
};

export default MapView;
