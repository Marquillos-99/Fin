// src/Sanpava/TSSanpava.jsx
import React, { useState, useEffect } from "react";
import { TileLayer } from "react-leaflet";

const TSSanpava = ({ selectedMap }) => {
  const [tilesData, setTilesData] = useState(null);

  useEffect(() => {
    // Se carga la configuración de los tiles desde un archivo JSON en public.
    fetch("/Sanpava.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener el archivo Sanpava.json");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tiles data loaded:", data);
        setTilesData(data);
      })
      .catch((error) => console.error("Error cargando el JSON:", error));
  }, []);

  if (!tilesData) return null;

  // Busca la configuración que corresponda al valor de selectedMap (por ejemplo, "avas", "anps", "arbolado")
  const tile = tilesData.find((t) => t.id === selectedMap);
  if (!tile) return null;

  return <TileLayer url={tile.url} attribution={tile.attribution} />;
};

export default TSSanpava;
