import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BikeRental } from '@/types';
import { Bike, MapPin, Clock, Star, Info, ExternalLink } from 'lucide-react';
import { getRentalWebsiteUrl } from '@/lib/utils/rentalUtils';

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

  if (!rental.location || 
      typeof rental.location.lat !== 'number' || 
      typeof rental.location.lng !== 'number' ||
      isNaN(rental.location.lat) || 
      isNaN(rental.location.lng)) {
    console.warn(`Invalid coordinates for rental ${rental.id}:`, rental.location);
    return null;
  }

  const formattedLat = rental.location.lat.toFixed(6);
  const formattedLng = rental.location.lng.toFixed(6);

  const getStationImage = () => {
    if (rental.images && rental.images.length > 0) {
      return rental.images[0];
    }
    
    const zoom = 16;
    const width = 300;
    const height = 200;
    
    return `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${width}&height=${height}&center=lonlat:${rental.location.lng},${rental.location.lat}&zoom=${zoom}&marker=lonlat:${rental.location.lng},${rental.location.lat};color:%232563eb;size:large&apiKey=15e7c8fc456e455ca57c464e9dbbf77e`;
  };

  const rentalUrl = getRentalWebsiteUrl(rental.operator);

  return (
    <Marker
      position={[rental.location.lat, rental.location.lng]}
      icon={bikeIcon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup className="bike-rental-popup">
        <div className="max-w-sm">
          <div className="font-medium text-lg mb-1">{rental.name}</div>
          
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="font-semibold">ID:</span> 
            <span>{rental.id}</span>
          </div>
          
          {rental.address && (
            <div className="text-sm mt-2 flex items-start gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span>{rental.address}</span>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-1 flex">
            <span className="font-semibold">GPS:</span> 
            <span className="ml-1">{formattedLat}, {formattedLng}</span>
          </div>
          
          <div className="mt-3 bg-secondary/40 rounded-md p-2">
            <div className="text-sm font-medium mb-1">
              Available bikes: {rental.bikes.available} / {rental.bikes.total}
            </div>
            
            {rental.bikes.types && Object.keys(rental.bikes.types).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(rental.bikes.types).map(([type, count]) => (
                  <span key={type} className="inline-block bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
                    {type}: {count}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {rental.openingHours && rental.openingHours.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1 text-sm font-medium mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Opening Hours</span>
              </div>
              <div className="text-xs grid grid-cols-2 gap-x-2 gap-y-1 pl-1">
                {rental.openingHours.map((hour, idx) => (
                  <React.Fragment key={idx}>
                    <div className="font-medium">{hour.days}:</div>
                    <div>{hour.hours}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          {rental.prices && rental.prices.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1 text-sm font-medium mb-1">
                <Info className="h-3.5 w-3.5" />
                <span>Pricing</span>
              </div>
              <div className="text-xs grid grid-cols-1 gap-1">
                {rental.prices.map((price, idx) => (
                  <div key={idx} className="bg-secondary/40 p-1.5 rounded-md flex justify-between">
                    <div>
                      <span className="font-medium">{price.type}</span>
                      {price.description && (
                        <div className="text-muted-foreground text-xs">{price.description}</div>
                      )}
                    </div>
                    <div className="font-medium">€{price.price}/{price.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {rental.operator && (
            <div className="text-xs text-muted-foreground mt-3">
              <span className="font-semibold">Operator:</span> {rental.operator}
            </div>
          )}
          
          {rental.amenities && rental.amenities.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium mb-1">Amenities</div>
              <div className="flex flex-wrap gap-1">
                {rental.amenities.map((amenity, idx) => (
                  <span 
                    key={idx}
                    className="inline-block px-2 py-0.5 bg-secondary/40 rounded-full text-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {rental.rating && (
            <div className="mt-3 flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{rental.rating.toFixed(1)}</span>
            </div>
          )}
          
          {rental.images && rental.images.length > 0 && (
            <div className="mt-3 w-full h-[150px] overflow-hidden rounded-md">
              <img 
                src={getStationImage()} 
                alt={`${rental.name} location`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x150/e2e8f0/64748b?text=Location+preview+unavailable";
                }}
              />
            </div>
          )}
          
          <div className="mt-3">
            <a 
              href={rentalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Visit rental website</span>
            </a>
          </div>
          
          {rental.lastUpdated && (
            <div className="mt-3 text-xs text-muted-foreground">
              Last updated: {new Date(rental.lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
