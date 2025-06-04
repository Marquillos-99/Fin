// Mapa.jsx
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../Styles/MapaGeneral/Mapa.css";

// Componente que rastrea la ubicación en tiempo real
const LocationMarker = () => {
  const [position, setPosition] = React.useState(null);
  const map = useMap();

  React.useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no es soportada por tu navegador");
      return;
    }

    // Se usa watchPosition para recibir actualizaciones en tiempo real
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

    // Limpieza: se cancela la suscripción al desmontar el componente
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Aquí estás</Popup>
    </Marker>
  );
};

const MapaCorena = () => {
  // Estado para controlar si se está rastreando la ubicación
  const [tracking, setTracking] = useState(false);
  // Estado para cambiar el tipo de mapa base: "streets", "satellite" o "terrain"
  const [selectedMap, setSelectedMap] = useState("streets");

  const center = [19.4326, -99.1332];
  const maxBounds = [
    [19.592, -99.364], // Esquina superior izquierda
    [19.18, -98.96], // Esquina inferior derecha
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* Panel de controles, posicionado sobre el mapa */}
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "10px",
          right: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {!tracking ? (
          <button
            onClick={() => setTracking(true)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Ubicarme
          </button>
        ) : (
          <button
            onClick={() => setTracking(false)}
            style={{
              padding: "8px 12px",
              backgroundColor: "red",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Parar Ubicación
          </button>
        )}

        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => setSelectedMap("streets")}
            style={{
              padding: "8px 12px",
              backgroundColor:
                selectedMap === "streets" ? "#0056b3" : "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Carreteras
          </button>
          <button
            onClick={() => setSelectedMap("satellite")}
            style={{
              padding: "8px 12px",
              backgroundColor:
                selectedMap === "satellite" ? "#0056b3" : "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Satélite
          </button>
          <button
            onClick={() => setSelectedMap("terrain")}
            style={{
              padding: "8px 12px",
              backgroundColor:
                selectedMap === "terrain" ? "#0056b3" : "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Relieve
          </button>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        minZoom={10}
        maxBounds={maxBounds}
        maxBoundsViscosity={0.8}
        style={{ height: "75vh", width: "100vw" }} // Cambiado de 100vh a 75vh
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
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankOnError=false"
            attribution="&copy; Esri — Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS"
          />
        )}
        {selectedMap === "terrain" && (
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: OpenTopoMap (CC-BY-SA)"
          />
        )}

        <WMSTileLayer
          url="http://localhost:8080/geoserver/prueba/wms"
          layers="prueba:SUELOCONSER"
          format="image/png"
          transparent={true}
          version="1.1.1"
          zIndex={500}
        />
        {tracking && <LocationMarker />}
      </MapContainer>
    </div>
  );
};

export default MapaCorena;
