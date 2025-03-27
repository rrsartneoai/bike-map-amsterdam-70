
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BikeRental } from '@/types';

interface MapMarkerProps {
  rental: BikeRental;
  isSelected?: boolean;
  onClick?: (rental: BikeRental) => void;
}

const getBikeAvailabilityColor = (available: number, total: number): string => {
  if (available === 0) return 'bg-red-500';
  if (available < total * 0.25) return 'bg-orange-500';
  if (available < total * 0.5) return 'bg-yellow-500';
  return 'bg-green-500';
};

const MapMarker: React.FC<MapMarkerProps> = ({ rental, isSelected = false, onClick }) => {
  const availabilityColor = getBikeAvailabilityColor(
    rental.bikes.available,
    rental.bikes.total
  );
  
  // Create a custom icon
  const markerSize = isSelected ? 25 : 20;
  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [markerSize, markerSize * 1.5],
    iconAnchor: [markerSize / 2, markerSize * 1.5],
    popupAnchor: [0, -markerSize],
    className: isSelected ? 'selected-marker' : ''
  });

  const handleClick = () => {
    if (onClick) {
      onClick(rental);
    }
  };

  return (
    <Marker 
      position={[rental.location.lat, rental.location.lng]} 
      icon={customIcon}
      eventHandlers={{
        click: handleClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{rental.name}</h3>
          <div className="text-sm mt-1">
            <span className="font-medium">Available bikes: </span>
            <span className={`inline-block w-3 h-3 rounded-full ${availabilityColor} mr-1`}></span>
            <span>{rental.bikes.available} / {rental.bikes.total}</span>
          </div>
          {rental.address && (
            <div className="text-sm mt-1">{rental.address}</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
