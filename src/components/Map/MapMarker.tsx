
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { BikeRental } from '@/types';
import { Bike } from 'lucide-react';

interface MapMarkerProps {
  rental: BikeRental;
  isSelected?: boolean;
  onClick?: (rental: BikeRental) => void;
}

const getBikeAvailabilityColor = (available: number, total: number): string => {
  if (available === 0) return '#ea384c'; // red
  if (available < total * 0.25) return '#FEC6A1'; // orange
  if (available < total * 0.5) return '#FEF7CD'; // yellow
  return '#F2FCE2'; // green
};

const getBikeAvailabilityTextColor = (available: number, total: number): string => {
  if (available === 0) return 'text-white';
  if (available < total * 0.25) return 'text-gray-900';
  return 'text-gray-900';
};

const getBikeAvailabilityBg = (available: number, total: number): string => {
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
  
  const availabilityBg = getBikeAvailabilityBg(
    rental.bikes.available,
    rental.bikes.total
  );

  const textColor = getBikeAvailabilityTextColor(
    rental.bikes.available,
    rental.bikes.total
  );
  
  // Create a custom icon with HTML content for better styling
  const markerScale = isSelected ? 1.3 : 1;
  const iconSize = Math.round(40 * markerScale);
  
  const createCustomIcon = () => {
    // Create HTML content for the icon
    const iconHtml = `
      <div class="bike-marker-container ${isSelected ? 'selected' : ''}" style="width: ${iconSize}px; height: ${iconSize}px;">
        <div class="bike-marker" style="background-color: ${availabilityColor};">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5"/>
            <circle cx="18.5" cy="17.5" r="3.5"/>
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
          </svg>
        </div>
        <div class="bike-count ${textColor}">${rental.bikes.available}</div>
      </div>
    `;

    return new DivIcon({
      html: iconHtml,
      className: 'custom-bike-marker',
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      popupAnchor: [0, -iconSize / 2]
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(rental);
    }
  };

  return (
    <Marker 
      position={[rental.location.lat, rental.location.lng]} 
      icon={createCustomIcon()}
      eventHandlers={{
        click: handleClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold">{rental.name}</h3>
          <div className="text-sm mt-1">
            <span className="font-medium">Available bikes: </span>
            <span className={`inline-block w-3 h-3 rounded-full ${availabilityBg} mr-1`}></span>
            <span>{rental.bikes.available} / {rental.bikes.total}</span>
          </div>
          {rental.bikes.types && Object.keys(rental.bikes.types).length > 0 && (
            <div className="text-sm mt-1">
              <span className="font-medium">Types: </span>
              {Object.entries(rental.bikes.types).map(([type, count]) => (
                <span key={type} className="mr-2">
                  {type}: {count}
                </span>
              ))}
            </div>
          )}
          {rental.address && (
            <div className="text-sm mt-1">{rental.address}</div>
          )}
          {rental.operator && (
            <div className="text-sm mt-1">
              <span className="font-medium">Operator: </span>
              {rental.operator}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
