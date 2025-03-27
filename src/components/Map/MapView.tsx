
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap as useMapContext } from '@/hooks/useMap';
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
  const { mapState } = useMapContext();
  const map = useMap();

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
}

const MapView: React.FC<MapViewProps> = ({ bikeRentals, isLoading }) => {
  const { mapState, setSelectedRental } = useMapContext();

  // Default map center is Amsterdam
  const defaultCenter: [number, number] = [52.3676, 4.9041];
  const defaultZoom = 13;

  // Handle marker click
  const handleMarkerClick = (rental: BikeRental) => {
    setSelectedRental(rental.id);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        // Remove the invalid tap property
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
              isSelected={mapState.selected === rental.id}
              onClick={() => handleMarkerClick(rental)}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
