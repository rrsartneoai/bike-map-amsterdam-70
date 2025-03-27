
import { useState, useEffect, useCallback } from 'react';
import { MapState, BikeRental } from '@/types';
import { toast } from 'sonner';
import L from 'leaflet';

// Amsterdam city center as default
const DEFAULT_CENTER: [number, number] = [52.3730, 4.8930];
const DEFAULT_ZOOM = 14;

const useMap = () => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapState, setMapState] = useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM
  });
  const [selectedRental, setSelectedRental] = useState<BikeRental | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Initialize map reference
  const initializeMap = useCallback((map: L.Map) => {
    setMapInstance(map);
  }, []);
  
  // Pan map to location with smooth animation
  const panToLocation = useCallback((location: [number, number], zoom?: number) => {
    if (!mapInstance) return;
    
    mapInstance.flyTo(location, zoom || mapState.zoom, {
      duration: 1,
      easeLinearity: 0.25
    });
    
    setMapState(prev => ({
      ...prev,
      center: location,
      zoom: zoom || prev.zoom
    }));
  }, [mapInstance, mapState.zoom]);
  
  // Handle marker click
  const handleMarkerClick = useCallback((rental: BikeRental) => {
    setSelectedRental(rental);
    panToLocation([rental.location.lat, rental.location.lng]);
  }, [panToLocation]);
  
  // Get user location
  const getUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      toast.loading("Getting your location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc: [number, number] = [latitude, longitude];
          
          setUserLocation(userLoc);
          panToLocation(userLoc, 15);
          toast.dismiss();
          toast.success("Location found!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.dismiss();
          toast.error("Couldn't get your location");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  }, [panToLocation]);
  
  // Reset view to default
  const resetView = useCallback(() => {
    panToLocation(DEFAULT_CENTER, DEFAULT_ZOOM);
    setSelectedRental(null);
  }, [panToLocation]);
  
  return {
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
  };
};

export default useMap;
