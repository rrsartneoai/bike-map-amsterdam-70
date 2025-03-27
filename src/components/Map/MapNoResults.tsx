
import React from 'react';

const MapNoResults: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow text-center">
        <p className="font-medium">No bike rentals found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
      </div>
    </div>
  );
};

export default MapNoResults;
