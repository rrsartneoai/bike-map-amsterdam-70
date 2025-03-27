
import React from 'react';

const MapLoading: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
        <span className="text-sm font-medium">Loading bike stations...</span>
      </div>
    </div>
  );
};

export default MapLoading;
