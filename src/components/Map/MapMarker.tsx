import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BikeRental } from '@/types';

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

  const bikeIcon = new Icon({
    iconUrl: '/public/logo.svg',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });

  return (
    rental.location.lat && rental.location.lng ? (
      <Marker
        position={[rental.location.lat, rental.location.lng]}
        icon={bikeIcon}
        eventHandlers={{
          click: handleClick,
        }}
      >
        <Popup>
          {rental.name}
        </Popup>
      </Marker>
    ) : null
  );
};

export default MapMarker;
