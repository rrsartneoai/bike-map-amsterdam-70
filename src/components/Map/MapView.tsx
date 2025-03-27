
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BikeRental } from '@/types';
import MapMarker from './MapMarker';
import { toast } from 'sonner';

// Import leaflet default marker icon assets
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  bikeRentals: BikeRental[];
  selectedRental: BikeRental | null;
  userLocation: [number, number] | null;
  center: [number, number];
  zoom: number;
  onMapInit: (map: L.Map) => void;
  onMarkerClick: (rental: BikeRental) => void;
}

const MapView = ({
  bikeRentals,
  selectedRental,
  userLocation,
  center,
  zoom,
  onMapInit,
  onMarkerClick
}: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      layers: [
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        })
      ],
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: true,
      maxBounds: L.latLngBounds(
        L.latLng(52.25, 4.7), // Southwest corner
        L.latLng(52.45, 5.0)  // Northeast corner
      )
    });
    
    // Add scale control
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
    
    // Save map reference
    mapRef.current = map;
    onMapInit(map);
    
    const handleZoomEnd = () => {
      if (mapRef.current) {
        const currentZoom = mapRef.current.getZoom();
        // You could implement zoom-based rendering logic here
        console.log("Map zoomed to:", currentZoom);
      }
    };
    
    map.on('zoomend', handleZoomEnd);
    
    // Cleanup
    return () => {
      map.off('zoomend', handleZoomEnd);
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, onMapInit]);
  
  // Update map center and zoom when changed
  useEffect(() => {
    if (!mapRef.current) return;
    
    mapRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);
  
  // Handle bike rental markers
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Add new markers for each bike rental
    bikeRentals.forEach(rental => {
      // Skip if marker already exists
      if (markersRef.current[rental.id]) return;
      
      const position: L.LatLngExpression = [rental.location.lat, rental.location.lng];
      
      // Create custom marker
      const markerElement = MapMarker({
        rental,
        isSelected: selectedRental?.id === rental.id,
      });
      
      const icon = L.divIcon({
        html: markerElement,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      
      // Create and add marker to map
      const marker = L.marker(position, { icon })
        .addTo(mapRef.current!)
        .on('click', () => onMarkerClick(rental));
      
      // Store marker reference
      markersRef.current[rental.id] = marker;
    });
    
    // Remove markers that are no longer in data
    Object.keys(markersRef.current).forEach(id => {
      if (!bikeRentals.find(rental => rental.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });
    
    // Update marker appearance when selection changes
    if (selectedRental) {
      Object.keys(markersRef.current).forEach(id => {
        const marker = markersRef.current[id];
        const position = marker.getLatLng();
        const isSelected = id === selectedRental.id;
        
        const updatedIcon = L.divIcon({
          html: MapMarker({ 
            rental: bikeRentals.find(r => r.id === id)!,
            isSelected
          }),
          className: 'custom-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
        
        marker.setIcon(updatedIcon);
      });
    }
    
    // Cleanup
    return () => {
      // Nothing to do here as markers will be cleaned up when component unmounts
    };
  }, [bikeRentals, selectedRental, onMarkerClick]);
  
  // Handle user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    
    // Remove previous user marker if it exists
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    
    // Create user location marker
    const userIcon = L.divIcon({
      html: `
        <div class="flex items-center justify-center">
          <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white relative">
            <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-70"></div>
          </div>
        </div>
      `,
      className: 'user-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    
    userMarkerRef.current = L.marker(userLocation, { icon: userIcon })
      .addTo(mapRef.current)
      .bindTooltip('Your location', { permanent: false, direction: 'top' });
    
  }, [userLocation]);
  
  return (
    <div className="map-container">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};

export default MapView;
