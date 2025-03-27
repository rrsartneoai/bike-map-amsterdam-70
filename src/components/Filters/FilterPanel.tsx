
import { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { FilterOptions } from '@/types';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
}

// List of common bike types
const BIKE_TYPES = [
  'city',
  'electric',
  'cargo',
  'tandem',
  'child',
];

// List of common operators
const OPERATORS = [
  'OV-fiets',
  'MacBike',
  'A-Bike',
  'Yellow Bike',
  'Green Wheels',
  'B&S Rentals',
];

// List of common amenities
const AMENITIES = [
  'Repair',
  'Helmets',
  'Child seats',
  'Locks',
  'Maps',
  'Guided tours',
  'Baskets',
];

const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    bikeTypes: [],
    operators: [],
    amenities: [],
    onlyAvailable: true,
    priceRange: [0, 50],
  });
  
  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  // Toggle filter panel expansion
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle bike type selection
  const handleBikeTypeChange = (type: string) => {
    setFilters(prev => {
      const newBikeTypes = prev.bikeTypes.includes(type)
        ? prev.bikeTypes.filter(t => t !== type)
        : [...prev.bikeTypes, type];
      
      return {
        ...prev,
        bikeTypes: newBikeTypes,
      };
    });
  };
  
  // Handle operator selection
  const handleOperatorChange = (operator: string) => {
    setFilters(prev => {
      const newOperators = prev.operators.includes(operator)
        ? prev.operators.filter(o => o !== operator)
        : [...prev.operators, operator];
      
      return {
        ...prev,
        operators: newOperators,
      };
    });
  };
  
  // Handle amenity selection
  const handleAmenityChange = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities,
      };
    });
  };
  
  // Handle availability toggle
  const handleAvailabilityChange = () => {
    setFilters(prev => ({
      ...prev,
      onlyAvailable: !prev.onlyAvailable,
    }));
  };
  
  // Handle price range change
  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    
    setFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], value],
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      bikeTypes: [],
      operators: [],
      amenities: [],
      onlyAvailable: true,
      priceRange: [0, 50],
    });
  };
  
  // Calculate total active filters
  const totalActiveFilters = 
    filters.bikeTypes.length +
    filters.operators.length +
    filters.amenities.length +
    (filters.priceRange[1] < 50 ? 1 : 0);
  
  return (
    <div className="filters-container">
      <div className="flex items-center justify-between mb-2">
        <button
          className="flex items-center text-lg font-medium gap-2"
          onClick={toggleExpansion}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {totalActiveFilters > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {totalActiveFilters}
            </span>
          )}
        </button>
        {totalActiveFilters > 0 && (
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        )}
        <button
          onClick={toggleExpansion}
          className="text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-4 animate-fade-in">
          {/* Availability filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyAvailable}
                onChange={handleAvailabilityChange}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-opacity-25"
              />
              <span>Show only available bikes</span>
            </label>
          </div>
          
          {/* Bike types filter */}
          <div>
            <h3 className="font-medium mb-2">Bike Types</h3>
            <div className="flex flex-wrap gap-2">
              {BIKE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => handleBikeTypeChange(type)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors border",
                    filters.bikeTypes.includes(type)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Operators filter */}
          <div>
            <h3 className="font-medium mb-2">Operators</h3>
            <div className="flex flex-wrap gap-2">
              {OPERATORS.map(operator => (
                <button
                  key={operator}
                  onClick={() => handleOperatorChange(operator)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors border",
                    filters.operators.includes(operator)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80"
                  )}
                >
                  {operator}
                </button>
              ))}
            </div>
          </div>
          
          {/* Price range filter */}
          <div>
            <h3 className="font-medium mb-2">
              Max Price: €{filters.priceRange[1]}
            </h3>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>€0</span>
              <span>€50</span>
            </div>
          </div>
          
          {/* Amenities filter */}
          <div>
            <h3 className="font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityChange(amenity)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors border",
                    filters.amenities.includes(amenity)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80"
                  )}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
