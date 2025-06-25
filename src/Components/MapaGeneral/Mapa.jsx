// Mapa.jsx
import React, { useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  FaLocationArrow,
  FaRoad,
  FaSatellite,
  FaMountain,
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import "../../Styles/MapaGeneral/Mapa.css";

// Constants
const MAP_TYPES = {
  STREETS: "streets",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};

const MAP_CENTER = [19.4326, -99.1332]; // Centro de la Ciudad de México
const MAP_BOUNDS = [
  [19.592, -99.364], // Esquina superior izquierda
  [19.18, -98.96], // Esquina inferior derecha
];

// Tile layer configurations
const TILE_LAYERS = {
  [MAP_TYPES.STREETS]: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  [MAP_TYPES.SATELLITE]: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankOnError=false",
    attribution:
      "&copy; Esri — Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS",
  },
  [MAP_TYPES.TERRAIN]: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      "Map data: &copy; OpenStreetMap contributors, SRTM | Map style: OpenTopoMap (CC-BY-SA)",
  },
};

/**
 * Componente que maneja el marcador de ubicación del usuario
 */
const LocationMarker = React.memo(({ isTracking, onTrackingChange }) => {
  const [position, setPosition] = useState(null);
  const watchIdRef = React.useRef(null);
  const map = useMap();

  // Cleanup function to clear any active watchPosition
  const cleanupWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Center map on user's position
  const centerMap = useCallback(
    (coords) => {
      const { latitude, longitude } = coords;
      const newPos = [latitude, longitude];
      setPosition(newPos);
      map.setView(newPos, 15);
    },
    [map]
  );

  // Handle position updates
  const handlePositionUpdate = useCallback(
    (pos) => {
      if (isTracking) {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      }
    },
    [isTracking]
  );

  // Handle position errors
  const handlePositionError = useCallback(
    (error) => {
      console.error("Error de geolocalización:", error);
      onTrackingChange(false);
      cleanupWatch();
    },
    [onTrackingChange, cleanupWatch]
  );

  // Effect to handle location tracking
  React.useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada por el navegador");
      return;
    }

    if (isTracking) {
      // Get current position and center map
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          centerMap(pos.coords);

          // Set up position watcher for updates
          cleanupWatch();
          watchIdRef.current = navigator.geolocation.watchPosition(
            handlePositionUpdate,
            handlePositionError,
            {
              enableHighAccuracy: true,
              maximumAge: 10000,
              timeout: 5000,
            }
          );
        },
        handlePositionError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      cleanupWatch();
    }

    return cleanupWatch;
  }, [
    isTracking,
    centerMap,
    handlePositionUpdate,
    handlePositionError,
    cleanupWatch,
  ]);

  if (!isTracking || !position) return null;

  return (
    <Marker position={position}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  );
});

LocationMarker.displayName = "LocationMarker";

/**
 * Componente para los botones de tipo de mapa
 */
const MapTypeButton = (props) => {
  const { mapType, currentMapType, onChange, icon: Icon, label } = props;

  return (
    <button
      type="button"
      className={`btn-map-type btn-${mapType} ${
        currentMapType === mapType ? "active" : ""
      }`}
      onClick={() => onChange(mapType)}
      title={`Vista ${label}`}
      aria-label={`Cambiar a vista ${label}`}
    >
      <Icon className="btn-icon" />
    </button>
  );
};

/**
 * Componente principal del mapa
 */
const Mapa = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [mapType, setMapType] = useState(MAP_TYPES.STREETS);

  const toggleTracking = useCallback(() => {
    setIsTracking((prev) => !prev);
  }, []);

  const handleMapTypeChange = useCallback((type) => {
    setMapType(type);
  }, []);

  const mapControls = useMemo(
    () => (
      <div className="map-controls">
        <button
          type="button"
          className={`map-btn btn-locate ${isTracking ? "active" : ""}`}
          onClick={toggleTracking}
          title={isTracking ? "Siguiendo ubicación" : "Ubicarme"}
          aria-label={
            isTracking ? "Dejar de seguir ubicación" : "Centrar en mi ubicación"
          }
        >
          <FaLocationArrow className="btn-icon" />
        </button>

        <div className="map-type-buttons">
          <MapTypeButton
            mapType={MAP_TYPES.STREETS}
            currentMapType={mapType}
            onChange={handleMapTypeChange}
            icon={FaRoad}
            label="de carreteras"
          />
          <MapTypeButton
            mapType={MAP_TYPES.SATELLITE}
            currentMapType={mapType}
            onChange={handleMapTypeChange}
            icon={FaSatellite}
            label="satelital"
          />
          <MapTypeButton
            mapType={MAP_TYPES.TERRAIN}
            currentMapType={mapType}
            onChange={handleMapTypeChange}
            icon={FaMountain}
            label="de relieve"
          />
        </div>
      </div>
    ),
    [isTracking, mapType, toggleTracking, handleMapTypeChange]
  );

  return (
    <div className="map-wrapper">
      {mapControls}

      <MapContainer
        center={MAP_CENTER}
        zoom={12}
        minZoom={10}
        maxBounds={MAP_BOUNDS}
        maxBoundsViscosity={0.8}
        className="map-container"
        zoomControl={false}
      >
        <TileLayer {...TILE_LAYERS[mapType]} />
        <LocationMarker
          isTracking={isTracking}
          onTrackingChange={setIsTracking}
        />
      </MapContainer>
    </div>
  );
};

export default React.memo(Mapa);
