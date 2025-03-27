
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

  // Create a proper bike icon
  const bikeIcon = new Icon({
    iconUrl: '/logo.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  // Format the bike availability to show in popup
  const formatBikeAvailability = () => {
    const available = rental.bikes?.available || 0;
    const total = rental.bikes?.total || 0;
    return `${available} / ${total}`;
  };

  // Check if we have valid coordinates
  const hasValidCoordinates = 
    rental.location && 
    typeof rental.location.lat === 'number' && 
    typeof rental.location.lng === 'number' &&
    !isNaN(rental.location.lat) && 
    !isNaN(rental.location.lng);

  if (!hasValidCoordinates) {
    console.warn(`Invalid coordinates for rental ${rental.id}: `, rental.location);
    return null;
  }

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
          Available bikes: {formatBikeAvailability()}
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
