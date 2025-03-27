
import { BikeRental } from '@/types';

interface MapMarkerProps {
  rental: BikeRental;
  isSelected?: boolean;
}

const getBikeAvailabilityColor = (available: number, total: number): string => {
  if (available === 0) return 'bg-red-500';
  if (available < total * 0.25) return 'bg-orange-500';
  if (available < total * 0.5) return 'bg-yellow-500';
  return 'bg-green-500';
};

const MapMarker = ({ rental, isSelected = false }: MapMarkerProps): string => {
  const availabilityColor = getBikeAvailabilityColor(
    rental.bikes.available,
    rental.bikes.total
  );
  
  const markerSize = isSelected ? 'w-10 h-10' : 'w-8 h-8';
  const markerScale = isSelected ? 'scale-110' : 'scale-100';
  const markerShadow = isSelected ? 'shadow-lg' : 'shadow-md';
  const zIndex = isSelected ? 'z-20' : 'z-10';
  const ringColor = isSelected ? 'ring-2 ring-primary ring-offset-2' : '';
  
  return `
    <div class="transition-all duration-300 ease-elastic ${markerScale} ${zIndex}">
      <div class="${markerSize} rounded-full bg-white flex items-center justify-center ${markerShadow} ${ringColor}">
        <div class="flex flex-col items-center justify-center w-full h-full p-1">
          <div class="text-sm font-semibold">
            ${rental.bikes.available}
          </div>
          <div class="${availabilityColor} w-2 h-2 rounded-full"></div>
        </div>
      </div>
      ${isSelected ? `
        <div class="absolute bottom-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white transform -translate-x-1/2 translate-y-1/2"></div>
      ` : ''}
    </div>
  `;
};

export default MapMarker;
