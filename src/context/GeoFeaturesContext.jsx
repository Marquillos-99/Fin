import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

const GeoFeaturesContext = createContext();

export const GeoFeaturesProvider = ({ children }) => {
  const [geoFeatures, setGeoFeatures] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cdmxBoundaries, setCdmxBoundaries] = useState(null);
  const [cdmxLoading, setCdmxLoading] = useState(false);
  const [cdmxError, setCdmxError] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    cdmx: false,
    // Add other layer toggles here
  });

  // Load Sanpava data
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

  // WMS URL for CDMX boundaries
  const getCdmxWmsUrl = useCallback(() => {
    const params = new URLSearchParams({
      service: 'WMS',
      version: '1.1.0',
      request: 'GetMap',
      layers: 'prueba:Alcaldia_sedeco',
      bbox: '166021.4430960765,0.0,833978.556903922,9329005.182450451',
      width: '1024',
      height: '768',
      srs: 'EPSG:32614',
      format: 'image/png',
      transparent: 'true'
    });
    
    return `http://localhost:8080/geoserver/prueba/wms?${params.toString()}`;
  }, []);
  
  // Load CDMX boundaries as WMS
  const loadCdmxBoundaries = useCallback(() => {
    if (cdmxLoading) {
      console.log('CDMX boundaries already loading');
      return;
    }
    
    console.log('Loading CDMX boundaries as WMS...');
    setCdmxLoading(true);
    setCdmxError(null);
    
    try {
      // Create an image element to preload the WMS
      const img = new Image();
      img.onload = () => {
        console.log('CDMX WMS layer loaded successfully');
        setCdmxLoading(false);
      };
      img.onerror = (err) => {
        console.error('Error loading CDMX WMS layer:', err);
        setCdmxError('Error al cargar los límites de la CDMX');
        setCdmxLoading(false);
      };
      
      // Set the source URL to trigger the load
      img.src = getCdmxWmsUrl();
      
      // Store the WMS URL instead of GeoJSON data
      setCdmxBoundaries({
        type: 'wms',
        url: getCdmxWmsUrl()
      });
      
    } catch (err) {
      console.error('Error initializing CDMX WMS layer:', err);
      setCdmxError('No se pudieron cargar los límites de la CDMX');
      setCdmxLoading(false);
    }
  }, [cdmxLoading, getCdmxWmsUrl]);

  // Toggle layer visibility
  const toggleLayer = useCallback((layerId) => {
    setActiveLayers(prev => {
      const newState = {
        ...prev,
        [layerId]: !prev[layerId]
      };
      
      // If toggling CDMX layer and it's being turned on, load the boundaries
      if (layerId === 'cdmx' && newState.cdmx && !cdmxBoundaries) {
        loadCdmxBoundaries();
      }
      
      return newState;
    });
  }, [loadCdmxBoundaries, cdmxBoundaries]);

  // Load CDMX boundaries when the component mounts if needed
  useEffect(() => {
    if (activeLayers.cdmx && !cdmxBoundaries && !cdmxLoading) {
      loadCdmxBoundaries();
    }
  }, [activeLayers.cdmx, cdmxBoundaries, cdmxLoading, loadCdmxBoundaries]);

  const value = {
    // Original values
    geoFeatures,
    selectedIndex,
    loading,
    error,
    setSelectedIndex,
    selectedFeature: geoFeatures[selectedIndex]?.properties,
    
    // CDMX boundaries
    cdmxBoundaries,
    cdmxLoading,
    cdmxError,
    
    // Layer management
    activeLayers,
    toggleLayer,
  };

  return (
    <GeoFeaturesContext.Provider value={value}>
      {children}
    </GeoFeaturesContext.Provider>
  );
};

export const useGeoFeatures = () => useContext(GeoFeaturesContext);
export default GeoFeaturesContext;
