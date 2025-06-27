// Mapa.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaRoad, FaSatellite, FaMountain, FaLocationArrow } from "react-icons/fa";
import { useGeoFeatures } from "../../context/GeoFeaturesContext";
import "../../Styles/MapaGeneral/Mapa.css";

// Constants
const MAP_TYPES = {
  STREETS: "streets",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};

const MAP_CENTER = [19.25, -99.1];
const CDMX_BOUNDS = L.latLngBounds(
  L.latLng(18.9, -99.4),  // Suroeste
  L.latLng(19.6, -98.9)   // Noreste
);

// Map configuration
const MAP_CONFIG = {
  center: [19.4326, -99.1332], // CDMX coordinates
  zoom: 12,
  minZoom: 10,
  maxZoom: 19,
  zoomControl: false,
  attributionControl: false,
  maxBounds: CDMX_BOUNDS,
  maxBoundsViscosity: 0.5,
};

// Tile layer configurations
const TILE_LAYERS = {
  [MAP_TYPES.STREETS]: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  [MAP_TYPES.SATELLITE]: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankOnError=false",
    attribution: "&copy; Esri — Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS",
  },
  [MAP_TYPES.TERRAIN]: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap contributors",
  },
};

/**
 * Componente para los botones de tipo de mapa
 */
const MapTypeButton = ({ mapType, currentMapType, onChange, icon: Icon, label }) => (
  <button
    type="button"
    className={`map-btn ${mapType === currentMapType ? "active" : ""}`}
    onClick={() => onChange(mapType)}
    title={label}
    aria-label={label}
  >
    <Icon />
  </button>
);

/**
 * Componente para el marcador de ubicación
 */
const LocationMarker = ({ isTracking, onTrackingChange }) => {
  const map = useMap();
  const markerRef = useRef(null);
  const watchId = useRef(null);

  // Crear un ícono personalizado para el marcador
  const createCustomIcon = () => {
    return L.divIcon({
      className: 'location-marker',
      html: '<div class="pulse"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  // Efecto para rastrear la ubicación
  useEffect(() => {
    if (!isTracking) {
      // Limpiar si no estamos siguiendo
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      return;
    }

    // Función para actualizar la posición
    const updatePosition = (position) => {
      const { latitude, longitude } = position.coords;
      const latLng = L.latLng(latitude, longitude);
      
      if (!markerRef.current) {
        // Crear el marcador si no existe
        markerRef.current = L.marker(latLng, {
          icon: createCustomIcon(),
          zIndexOffset: 1000,
          interactive: false
        }).addTo(map);
      } else {
        // Actualizar posición si ya existe
        markerRef.current.setLatLng(latLng);
      }
      
      // Centrar el mapa en la ubicación
      map.setView(latLng, 15);
    };

    // Función para manejar errores
    const handleError = (error) => {
      console.error("Error getting location:", error);
      alert("No se pudo obtener la ubicación actual. Asegúrate de haber otorgado los permisos de ubicación.");
      onTrackingChange(false);
    };

    // Opciones de geolocalización
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    // Obtener posición actual
    navigator.geolocation.getCurrentPosition(
      updatePosition,
      handleError,
      options
    );

    // Iniciar seguimiento continuo
    watchId.current = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      options
    );

    // Limpieza al desmontar o cuando cambie isTracking
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [isTracking, map, onTrackingChange]);

  return null;
};

/**
 * Componente principal del mapa
 */
const Mapa = () => {
  // Obtener límites y estado de capas del contexto
  const { cdmxBoundaries, cdmxLoading, cdmxError, activeLayers } = useGeoFeatures();
  const [isTracking, setIsTracking] = useState(false);
  const [mapType, setMapType] = useState(MAP_TYPES.STREETS);
  const mapRef = useRef(null);

  // Referencia al mapa de Leaflet
  const [, setLeafletMap] = useState(null);

  // Manejar clic en el botón de ubicación
  const handleLocateClick = useCallback(() => {
    // Alternar el estado de seguimiento
    setIsTracking(prev => !prev);
    
    // Si el navegador no soporta geolocalización, mostrar un mensaje
    if (!navigator.geolocation) {
      alert("La geolocalización no es compatible con este navegador");
      setIsTracking(false);
    }
  }, []);

  // Manejar cambio de tipo de mapa
  const handleMapTypeChange = useCallback((type) => {
    setMapType(type);
  }, []);

  // Efecto para configurar controles personalizados
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Agregar control de zoom personalizado
    const zoomControl = L.control.zoom({
      position: 'topright',
      zoomInTitle: 'Acercar',
      zoomOutTitle: 'Alejar'
    });
    zoomControl.addTo(map);

    // Agregar botón de inicio personalizado
    const customControls = L.control({ position: 'topright' });
    customControls.onAdd = function() {
      const div = L.DomUtil.create('div', 'custom-control');
      const homeButton = L.DomUtil.create('button', 'map-btn', div);
      homeButton.innerHTML = '<i class="fas fa-home"></i>';
      homeButton.onclick = () => {
        map.fitBounds(CDMX_BOUNDS);
      };
      return div;
    };
    customControls.addTo(map);

    // Limpiar al desmontar
    return () => {
      if (map) {
        map.off();
        map.remove();
      }
    };
  }, []);

  // Renderizar el mapa con controles
  return (
    <div className="map-container">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        maxBounds={CDMX_BOUNDS}
        maxBoundsViscosity={0.5}
        minZoom={10}
        whenCreated={(map) => {
          mapRef.current = map;
          setLeafletMap(map);
          // Forzar evento de redimensionamiento
          setTimeout(() => {
            map.invalidateSize();
          }, 100);
        }}
      >
        {/* Capa base */}
        <TileLayer {...TILE_LAYERS[mapType]} />

        {/* Capa WMS de CDMX */}
        {activeLayers.cdmx && cdmxBoundaries?.type === "wms" && (
          <WMSTileLayer
            key="cdmx-wms-layer"
            url="http://localhost:8080/geoserver/prueba/wms"
            layers="prueba:Alcaldia_sedeco"
            format="image/png"
            transparent={true}
            version="1.1.0"
            crs={L.CRS.EPSG3857}
            opacity={0.8}
            zIndex={1000}
            pane="overlayPane"
          />
        )}

        {/* Estados de carga y error */}
        {activeLayers.cdmx && cdmxLoading && (
          <div className="map-overlay">Cargando límites de la CDMX...</div>
        )}
        {cdmxError && <div className="map-overlay error">{cdmxError}</div>}

        {/* Marcador de ubicación */}
        <LocationMarker
          isTracking={isTracking}
          onTrackingChange={setIsTracking}
        />

        {/* Controles del mapa */}
        <div className="map-controls">
          <button
            type="button"
            className={`map-btn btn-locate ${isTracking ? "active" : ""}`}
            onClick={handleLocateClick}
            title={isTracking ? "Siguiendo ubicación" : "Ubicarme"}
            aria-label={
              isTracking ? "Dejar de seguir ubicación" : "Centrar en mi ubicación"
            }
          >
            <FaLocationArrow />
          </button>

          {/* Controles de tipo de mapa */}
          <div className="map-type-controls">
            <MapTypeButton
              mapType={MAP_TYPES.STREETS}
              currentMapType={mapType}
              onChange={handleMapTypeChange}
              icon={FaRoad}
              label="Calles"
            />
            <MapTypeButton
              mapType={MAP_TYPES.SATELLITE}
              currentMapType={mapType}
              onChange={handleMapTypeChange}
              icon={FaSatellite}
              label="Satélite"
            />
            <MapTypeButton
              mapType={MAP_TYPES.TERRAIN}
              currentMapType={mapType}
              onChange={handleMapTypeChange}
              icon={FaMountain}
              label="Relieve"
            />
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default React.memo(Mapa);
