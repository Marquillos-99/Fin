import React, { createContext, useState, useEffect, useContext } from "react";

const GeoFeaturesContext = createContext();

export const GeoFeaturesProvider = ({ children }) => {
  const [geoFeatures, setGeoFeatures] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch("/Sanpava.json");
        if (!response.ok) {
          throw new Error("Error al obtener los datos geográficos");
        }
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          setGeoFeatures(data.features);
          setSelectedIndex(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  const value = {
    geoFeatures,
    selectedIndex,
    loading,
    error,
    setSelectedIndex,
    selectedFeature: geoFeatures[selectedIndex]?.properties,
  };

  return (
    <GeoFeaturesContext.Provider value={value}>
      {children}
    </GeoFeaturesContext.Provider>
  );
};

export const useGeoFeatures = () => useContext(GeoFeaturesContext);
export default GeoFeaturesContext;
