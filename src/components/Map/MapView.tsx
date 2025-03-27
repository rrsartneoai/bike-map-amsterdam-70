
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap as useLeafletMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from '@/hooks/useMap';
import L from 'leaflet';
import { BikeRental } from '@/types';
import MapMarker from './MapMarker';

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

  return (
    <div className="map-container">
      <MapContainer
        center={center || defaultCenter}
        zoom={zoom || defaultZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        whenReady={(e) => handleMapInit(e.target)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController />
        
        {!isLoading &&
          bikeRentals.map((rental) => (
            <MapMarker
              key={rental.id}
              rental={rental}
              isSelected={selectedRental ? selectedRental.id === rental.id : mapState.selected === rental.id}
              onClick={handleMarkerClick}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
