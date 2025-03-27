
import React, { useEffect } from 'react';
import { useMap as useLeafletMap } from 'react-leaflet';
import useMap from '@/hooks/useMap';

const MapController: React.FC = () => {
  const { mapState } = useMap();
  const map = useLeafletMap();

  useEffect(() => {
    map.setView(mapState.center, mapState.zoom, {
      animate: true,
      duration: 1,
    });
  }, [mapState.center, mapState.zoom, map]);

  return null;
};

export default MapController;
