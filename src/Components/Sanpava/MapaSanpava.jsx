import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
        // Actualiza la vista del mapa a la ubicación actual
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

const MapaSanpava = () => {
  // Estado para rastrear si se está mostrando la ubicación
  const [tracking, setTracking] = useState(false);
  // Estado para seleccionar la capa base: "streets", "satellite" o "terrain"
  const [selectedMap, setSelectedMap] = useState("streets");
  // Estado para almacenar los datos GeoJSON
  const [geoData, setGeoData] = useState(null);

  const [tileOption, setTileOption] = useState("anps");

  const center = [19.4326, -99.1332];
  const maxBounds = [
    [19.592, -99.364],
    [19.18, -98.96],
  ];

  // Carga el GeoJSON desde el archivo Sanpava.json (ubicado en public)
  useEffect(() => {
    fetch("/Sanpava.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener Sanpava.json");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Geo data loaded:", data);
        setGeoData(data);
      })
      .catch((error) => console.error("Error al cargar el GeoJSON:", error));
  }, []);

  return (
    <div className="map-wrapper">
      {/* Panel de controles para los botones de geolocalización y cambio de capa */}
      <div className="map-controls">
        {/*
          Botón de ubicación: muestra "Ubicarme" si no se está rastreando y "Parar Ubicación" si se está.
        */}
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

        {/* Botones para cambiar la capa base */}
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
        {/* Capas base según la selección */}
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

        {/* Superposición del GeoJSON desde Sanpava.json */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={{
              color: "#2c3e50",
              weight: 2,
              fillColor: "#1abc9c",
              fillOpacity: 0.5,
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.NOMBRE) {
                layer.bindPopup(
                  `<strong>${feature.properties.NOMBRE}</strong><br/>Delegación: ${feature.properties.Delegacion}`
                );
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapaSanpava;
