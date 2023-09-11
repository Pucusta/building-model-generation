import React, { createContext, useContext, useState } from 'react';
import { House } from './House';

type BuildingContextType = {
  building: House;
  setBuilding: (newBuilding: House) => void;
};

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export function GetBuildingContext() {
    const context = useContext(BuildingContext);
    if (!context) {
      throw new Error('GetBuildingContext must be used within a BuildingProvider');
    }
    return context;
}

export function BuildingProvider({ children }: { children: React.ReactNode }) {
  const [building, setBuilding] = useState<House>(new House([[-6, 0, -3], [6, 0, -3], [6, 0, 3], [-6, 0, 3]], 2));

  const value = { building: building, setBuilding: setBuilding };

  return <BuildingContext.Provider value={value}>{children}</BuildingContext.Provider>;
}