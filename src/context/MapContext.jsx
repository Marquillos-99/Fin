import React, { createContext, useState, useContext } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState({
    id: 1,
    name: "Ciudad de México",
    lat: 19.432608,
    lng: -99.133209,
    zoom: 10,
  });

  return (
    <MapContext.Provider value={{ selectedRegion, setSelectedRegion }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
export default MapContext;
