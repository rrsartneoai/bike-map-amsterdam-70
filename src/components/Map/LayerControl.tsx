
import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { TileLayer, useMap } from 'react-leaflet';

// Define map layer options
const mapLayers = [
  {
    id: 'streets',
    name: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    default: true
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    default: false
  },
  {
    id: 'terrain',
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    default: false
  },
  {
    id: 'transport',
    name: 'Transport',
    url: 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38',
    attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors',
    default: false
  }
];

const LayerControl: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(mapLayers.find(layer => layer.default)?.id || 'streets');
  const map = useMap();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const selectLayer = (layerId: string) => {
    setActiveLayer(layerId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Add dynamic TileLayer based on selected layer */}
      {mapLayers.map((layer) => (
        layer.id === activeLayer && (
          <TileLayer
            key={layer.id}
            url={layer.url}
            attribution={layer.attribution}
          />
        )
      ))}
      
      {/* Layer control button and menu */}
      <div className="leaflet-top leaflet-left mt-16">
        <div className="leaflet-control leaflet-bar">
          <div className="relative">
            <button 
              className="flex items-center justify-center w-10 h-10 bg-white rounded-md shadow-md hover:bg-gray-100"
              onClick={toggleMenu}
              title="Change map style"
            >
              <Layers className="w-5 h-5 text-gray-700" />
            </button>
            
            {isOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                {mapLayers.map((layer) => (
                  <button
                    key={layer.id}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      activeLayer === layer.id ? 'bg-primary/10 font-medium' : ''
                    }`}
                    onClick={() => selectLayer(layer.id)}
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LayerControl;
