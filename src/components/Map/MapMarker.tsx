
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BikeRental } from '@/types';
import { Bike } from 'lucide-react';

interface MapMarkerProps {
  rental: BikeRental;
  isSelected?: boolean;
  onClick?: (rental: BikeRental) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ rental, isSelected = false, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(rental);
    }
  };

  // Create a custom bike icon
  const bikeIcon = new Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? '#ef4444' : '#2563eb'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5"/>
        <circle cx="18.5" cy="17.5" r="3.5"/>
        <path d="M15 6a1 1 0 100-2 1 1 0 000 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: `bike-marker ${isSelected ? 'selected-marker' : ''}`
  });

  // Check if we have valid coordinates
  if (!rental.location || 
      typeof rental.location.lat !== 'number' || 
      typeof rental.location.lng !== 'number' ||
      isNaN(rental.location.lat) || 
      isNaN(rental.location.lng)) {
    console.warn(`Invalid coordinates for rental ${rental.id}:`, rental.location);
    return null;
  }

  // Debug log to confirm marker creation
  console.log(`Creating marker for rental ${rental.id} at [${rental.location.lat}, ${rental.location.lng}]`);

  return (
    <Marker
      position={[rental.location.lat, rental.location.lng]}
      icon={bikeIcon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup className="bike-rental-popup">
        <div className="font-medium">{rental.name}</div>
        <div className="text-sm mt-1">
          Available bikes: {rental.bikes.available} / {rental.bikes.total}
        </div>
        {rental.operator && (
          <div className="text-xs text-muted-foreground mt-1">
            Operator: {rental.operator}
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default MapMarker;
