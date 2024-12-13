import React from 'react';

interface LocationContextType {
  coordinates: string | null;
}

export const LocationContext = React.createContext<LocationContextType>({ coordinates: null });