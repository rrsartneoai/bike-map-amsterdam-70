
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BikeRental } from '@/types';
import { Bike, MapPin } from 'lucide-react';

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

  // Format coordinates to 6 decimal places
  const formattedLat = rental.location.lat.toFixed(6);
  const formattedLng = rental.location.lng.toFixed(6);

  // Get a static map image from OpenStreetMap
  const getStationImage = () => {
    // If rental has images, use the first one
    if (rental.images && rental.images.length > 0) {
      return rental.images[0];
    }
    
    // Use OpenStreetMap static map image with marker
    // We'll use the OpenStreetMap static map service provided by MapTiler
    const zoom = 16;
    const width = 300;
    const height = 200;
    const marker = `pin-l-bicycle+2563eb(${rental.location.lng},${rental.location.lat})`;
    
    // Using publicly available static map service
    return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${width}&height=${height}&center=lonlat:${rental.location.lng},${rental.location.lat}&zoom=${zoom}&marker=lonlat:${rental.location.lng},${rental.location.lat};color:%232563eb;size:large&apiKey=15e7c8fc456e455ca57c464e9dbbf77e`;
  };

  return (
    <Marker
      position={[rental.location.lat, rental.location.lng]}
      icon={bikeIcon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup className="bike-rental-popup">
        <div className="font-medium text-lg">{rental.name}</div>
        
        <div className="text-xs text-muted-foreground mt-1 flex items-center">
          <span className="font-semibold">ID:</span> 
          <span className="ml-1">{rental.id}</span>
        </div>
        
        {rental.address && (
          <div className="text-sm mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{rental.address}</span>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1 flex">
          <span className="font-semibold">GPS:</span> 
          <span className="ml-1">{formattedLat}, {formattedLng}</span>
        </div>
        
        <div className="text-sm mt-2 font-medium">
          Available bikes: {rental.bikes.available} / {rental.bikes.total}
        </div>
        
        {rental.bikes.types && Object.keys(rental.bikes.types).length > 0 && (
          <div className="text-xs mt-1">
            <span className="font-semibold">Types:</span> 
            {Object.entries(rental.bikes.types).map(([type, count]) => (
              <span key={type} className="ml-1 bg-secondary text-secondary-foreground px-1 py-0.5 rounded text-xs">
                {type}: {count}
              </span>
            ))}
          </div>
        )}
        
        {rental.operator && (
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-semibold">Operator:</span> {rental.operator}
          </div>
        )}
        
        {rental.openingHours && rental.openingHours.length > 0 && (
          <div className="text-xs mt-1">
            <span className="font-semibold">Hours:</span>
            {rental.openingHours.map((hour, idx) => (
              <div key={idx} className="ml-1">
                {hour.days}: {hour.hours}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-2 w-full h-[150px] overflow-hidden rounded">
          <img 
            src={getStationImage()} 
            alt={`${rental.name} location`} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if the image fails to load
              e.currentTarget.src = "https://placehold.co/300x150/e2e8f0/64748b?text=Location+preview+unavailable";
            }}
          />
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
