
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import MapView from '@/components/Map/MapView';
import SearchBar from '@/components/Search/SearchBar';
import FilterPanel from '@/components/Filters/FilterPanel';
import BikeRentalCard from '@/components/UI/BikeRentalCard';
import Navbar from '@/components/Nav/Navbar';
import useMap from '@/hooks/useMap';
import { fetchBikeRentals } from '@/lib/api';
import { BikeRental, FilterOptions, SearchResult } from '@/types';

const Index = () => {
  // State for filtered rentals
  const [filteredRentals, setFilteredRentals] = useState<BikeRental[]>([]);
  
  // Use custom map hook
  const {
    mapInstance,
    mapState,
    selectedRental,
    userLocation,
    initializeMap,
    panToLocation,
    handleMarkerClick,
    getUserLocation,
    resetView,
    setSelectedRental
  } = useMap();
  
  // Fetch bike rentals data
  const { 
    data: bikeRentalsData,
    isLoading,
    error,
    isFetching
  } = useQuery({
    queryKey: ['bikeRentals'],
    queryFn: fetchBikeRentals,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Apply filters to bike rentals
  const applyFilters = useCallback((rentals: BikeRental[], filters: FilterOptions) => {
    return rentals.filter(rental => {
      // Filter by bike types
      if (filters.bikeTypes.length > 0) {
        const hasMatchingType = filters.bikeTypes.some(type => 
          rental.bikes.types[type] !== undefined
        );
        if (!hasMatchingType) return false;
      }
      
      // Filter by operators
      if (filters.operators.length > 0 && 
          !filters.operators.includes(rental.operator || '')) {
        return false;
      }
      
      // Filter by amenities
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          rental.amenities?.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      // Filter by availability
      if (filters.onlyAvailable && rental.bikes.available === 0) {
        return false;
      }
      
      // Filter by price range
      if (rental.prices && rental.prices.length > 0) {
        const lowestPrice = Math.min(...rental.prices.map(
          p => parseFloat(p.price)
        ));
        if (lowestPrice > filters.priceRange[1]) {
          return false;
        }
      }
      
      return true;
    });
  }, []);
  
  // Handle filter changes
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    if (!bikeRentalsData?.data) return;
    
    const filtered = applyFilters(bikeRentalsData.data, filters);
    setFilteredRentals(filtered);
    
    if (filtered.length === 0) {
      toast.info('No bike rentals match your filters');
    }
  }, [bikeRentalsData, applyFilters]);
  
  // Handle search result selection
  const handleSearchSelect = (result: SearchResult) => {
    panToLocation([result.location.lat, result.location.lng], 16);
    
    if (result.type === 'bikeRental') {
      // Find the bike rental in our data
      const rental = filteredRentals.find(r => r.id === result.id);
      if (rental) {
        handleMarkerClick(rental);
      }
    }
  };
  
  // Update filtered rentals when data changes
  useEffect(() => {
    if (bikeRentalsData?.data) {
      setFilteredRentals(bikeRentalsData.data);
    }
  }, [bikeRentalsData]);
  
  // Show error toast if API fails
  useEffect(() => {
    if (error) {
      toast.error('Failed to load bike rental data');
      console.error('API Error:', error);
    }
  }, [error]);
  
  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Map component */}
      <MapView
        bikeRentals={filteredRentals}
        isLoading={isLoading}
        selectedRental={selectedRental}
        userLocation={userLocation}
        center={mapState.center}
        zoom={mapState.zoom}
        onMapInit={initializeMap}
        onMarkerClick={handleMarkerClick}
      />
      
      {/* UI Components - Search, Filter, etc. */}
      <Navbar />
      <SearchBar onSelect={handleSearchSelect} />
      <FilterPanel onFilterChange={handleFilterChange} />
      
      {/* Geolocation button */}
      <button
        onClick={getUserLocation}
        className="location-btn"
        title="Find my location"
      >
        <MapPin className="w-6 h-6" />
      </button>
      
      {/* Loading indicator */}
      {(isLoading || isFetching) && (
        <div className="fixed top-4 right-4 glass p-2 rounded-lg animate-fade-in">
          <div className="loader w-5 h-5"></div>
        </div>
      )}
      
      {/* Info panel for selected rental */}
      {selectedRental && (
        <div className="info-panel animate-slide-up">
          <BikeRentalCard
            rental={selectedRental}
            onClose={() => setSelectedRental(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
