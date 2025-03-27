
import { Clock, MapPin, Phone, Star, X, Info } from 'lucide-react';
import { BikeRental } from '@/types';
import { cn } from '@/lib/utils';

interface BikeRentalCardProps {
  rental: BikeRental;
  onClose: () => void;
}

const BikeRentalCard = ({ rental, onClose }: BikeRentalCardProps) => {
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      {/* Header with image if available */}
      <div className="relative h-40 overflow-hidden">
        {rental.images && rental.images.length > 0 ? (
          <img
            src={rental.images[0]}
            alt={rental.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-muted-foreground">No image available</div>
          </div>
        )}
        
        {/* Rating badge */}
        {rental.rating && (
          <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{rental.rating.toFixed(1)}</span>
          </div>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{rental.name}</h2>
        {rental.operator && (
          <p className="text-sm text-muted-foreground mb-2">
            Operated by {rental.operator}
          </p>
        )}
        
        {/* ID */}
        <div className="text-xs text-muted-foreground mt-1 flex items-center">
          <span className="font-semibold">ID:</span> 
          <span className="ml-1">{rental.id}</span>
        </div>
        
        {/* Address */}
        {rental.address && (
          <div className="flex items-start gap-2 mt-3">
            <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span>{rental.address}</span>
          </div>
        )}
        
        {/* Opening hours */}
        {rental.openingHours && rental.openingHours.length > 0 && (
          <div className="flex items-start gap-2 mt-3">
            <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              {rental.openingHours.map((hours, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{hours.days}:</span> {hours.hours}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Bike availability */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Bike Availability</h3>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              <div className={cn(
                "w-3 h-3 rounded-full",
                rental.bikes.available > 0 ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="font-medium">
                {rental.bikes.available} / {rental.bikes.total} available
              </span>
            </div>
          </div>
          
          {/* Bike types */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(rental.bikes.types).map(([type, count]) => (
              <div key={type} className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-md">
                <span className="capitalize">{type}:</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Prices */}
        {rental.prices && rental.prices.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Pricing</h3>
            <div className="grid gap-2">
              {rental.prices.map((price, index) => (
                <div key={index} className="flex justify-between items-center bg-secondary/50 px-3 py-2 rounded-md">
                  <div>
                    <span className="font-medium">{price.type}</span>
                    {price.description && (
                      <p className="text-xs text-muted-foreground">{price.description}</p>
                    )}
                  </div>
                  <span className="font-semibold">€{price.price}/{price.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Amenities */}
        {rental.amenities && rental.amenities.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {rental.amenities.map((amenity, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 bg-secondary/50 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* GPS coordinates */}
        <div className="text-xs text-muted-foreground mt-4 flex">
          <span className="font-semibold">GPS:</span> 
          <span className="ml-1">{rental.location.lat.toFixed(6)}, {rental.location.lng.toFixed(6)}</span>
        </div>
        
        {/* Last updated info */}
        {rental.lastUpdated && (
          <div className="mt-2 text-xs text-muted-foreground">
            Last updated: {new Date(rental.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BikeRentalCard;
