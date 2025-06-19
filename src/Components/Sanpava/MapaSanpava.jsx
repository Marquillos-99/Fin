// src/components/MapaSanpava.jsx
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../Styles/Sanpava/MapaSanpava.css";

// Componente para rastrear la ubicación en tiempo real
const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no es soportada por tu navegador");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];
        setPosition(newPos);
        // Actualiza la vista del mapa a la ubicación actual conservando el zoom actual
        map.setView(newPos, map.getZoom());
      },
      (err) => console.error("Error al obtener la ubicación:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Aquí estás</Popup>
    </Marker>
  );
};

// Componente para actualizar la vista del mapa según la feature seleccionada
const SelectedFeatureUpdater = ({ feature }) => {
  const map = useMap();
  useEffect(() => {
    if (feature) {
      // Creamos una capa temporal para obtener los límites de la feature
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds());
    }
  }, [feature, map]);
  return null;
};

const MapaSanpava = ({ features, selectedIndex, onFeatureSelect }) => {
  const center = [19.4326, -99.1332];
  const maxBounds = [
    [19.592, -99.364],
    [19.18, -98.96],
  ];

  // Construimos el objeto GeoJSON a partir de las features recibidas
  const geoData = features
    ? {
        type: "FeatureCollection",
        features: features,
      }
    : null;

  // Función para vincular el evento click a cada feature
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.NOMBRE) {
      layer.bindPopup(
        `<strong>${feature.properties.NOMBRE}</strong><br/>Delegación: ${feature.properties.Delegacion}`
      );
    }
    layer.on("click", () => {
      // Buscamos la feature en la lista (por ejemplo usando el nombre)
      const index = features.findIndex(
        (f) => f.properties.NOMBRE === feature.properties.NOMBRE
      );
      if (index !== -1 && onFeatureSelect) {
        onFeatureSelect(index);
      }
    });
  };

  // Estados para controles del mapa (geolocalización, cambio de capa y selector de "tiles")
  const [tracking, setTracking] = useState(false);
  const [selectedMap, setSelectedMap] = useState("streets");
  const [tileOption, setTileOption] = useState("anps");

  return (
    <div className="map-wrapper">
      {/* Controles superiores */}
      <div className="map-controls">
        {!tracking ? (
          <button onClick={() => setTracking(true)} className="control-button">
            Ubicarme
          </button>
        ) : (
          <button
            onClick={() => setTracking(false)}
            className="control-button stop"
          >
            Parar Ubicación
          </button>
        )}
        <div className="control-group">
          <button
            onClick={() => setSelectedMap("streets")}
            className={`control-button ${
              selectedMap === "streets" ? "active" : ""
            }`}
          >
            Carreteras
          </button>
          <button
            onClick={() => setSelectedMap("satellite")}
            className={`control-button ${
              selectedMap === "satellite" ? "active" : ""
            }`}
          >
            Satélite
          </button>
          <button
            onClick={() => setSelectedMap("terrain")}
            className={`control-button ${
              selectedMap === "terrain" ? "active" : ""
            }`}
          >
            Relieve
          </button>
        </div>
      </div>
      <div className="tile-selector">
        <label>
          <input
            type="checkbox"
            checked={tileOption === "anps"}
            onChange={() => setTileOption("anps")}
          />
          ANPS
        </label>
        <label>
          <input
            type="checkbox"
            checked={tileOption === "avas"}
            onChange={() => setTileOption("avas")}
          />
          AVAS
        </label>
        <label>
          <input
            type="checkbox"
            checked={tileOption === "arbolados"}
            onChange={() => setTileOption("arbolados")}
          />
          Arbolados
        </label>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        minZoom={10}
        maxBounds={maxBounds}
        maxBoundsViscosity={0.8}
        className="map-container"
      >
        {selectedMap === "streets" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        )}
        {selectedMap === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}?blankOnError=false"
            attribution="&copy; Esri, DeLorme, NAVTEQ, etc."
          />
        )}
        {selectedMap === "terrain" && (
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: OpenTopoMap (CC-BY-SA)"
          />
        )}

        {tracking && <LocationMarker />}

        {/* Capa GeoJSON con las features y eventos asociados */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={{
              color: "#2c3e50",
              weight: 2,
              fillColor: "#1abc9c",
              fillOpacity: 0.5,
            }}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Actualiza la vista del mapa cuando cambia la selección en el grid */}
        {features && features[selectedIndex] && (
          <SelectedFeatureUpdater feature={features[selectedIndex]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapaSanpava;
