
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { BikeRental } from '@/types';
import { Bike, Info, Clock, Phone, Globe } from 'lucide-react';

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
  // Handle potential missing data
  const availableBikes = rental.bikes?.available ?? 0;
  const totalBikes = rental.bikes?.total ?? 0;
  
  const availabilityColor = getBikeAvailabilityColor(
    availableBikes,
    totalBikes
  );
  
  const availabilityBg = getBikeAvailabilityBg(
    availableBikes,
    totalBikes
  );

  const textColor = getBikeAvailabilityTextColor(
    availableBikes,
    totalBikes
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
        <div class="bike-count ${textColor}">${availableBikes || '?'}</div>
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
        <div className="p-3 min-w-[250px]">
          <h3 className="font-semibold text-lg mb-2">
            {rental.name || 'Bike Rental'}
            {totalBikes > 0 && (
              <span className="ml-2 text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                {totalBikes} bikes
              </span>
            )}
          </h3>
          
          {(availableBikes !== undefined || totalBikes > 0) && (
            <div className="mb-3 p-2 rounded bg-gray-50">
              <p className="text-sm font-medium text-gray-900">
                Available bikes: {availableBikes || '?'} / {totalBikes || '?'}
              </p>
              <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${availableBikes > 0 ? 'bg-primary' : 'bg-red-500'}`}
                  style={{
                    width: `${totalBikes ? (availableBikes / totalBikes) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <p className="text-sm text-gray-700">
              <strong>Operator:</strong> {rental.operator || 'Information not available'}
            </p>
            
            {rental.address && (
              <p className="text-sm text-gray-700">
                <strong>Address:</strong> {rental.address}
              </p>
            )}
            
            {rental.bikes && rental.bikes.types && Object.keys(rental.bikes.types).length > 0 && (
              <div className="text-sm mt-1">
                <strong>Bike types:</strong>{' '}
                {Object.entries(rental.bikes.types).map(([type, count]) => (
                  <span key={type} className="mr-2">
                    {type}: {count}
                  </span>
                ))}
              </div>
            )}
            
            {rental.amenities && rental.amenities.length > 0 && (
              <p className="text-sm text-gray-700">
                <strong>Amenities:</strong> {rental.amenities.join(', ')}
              </p>
            )}
            
            {rental.lastUpdated && (
              <p className="text-xs text-gray-500 italic mt-2">
                Last updated: {new Date(rental.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
