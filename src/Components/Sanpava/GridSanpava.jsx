import React, { useState, useEffect } from "react";
import MapaSanpava from "./MapaSanpava";
import "../../Styles/Sanpava/GridSanpava.css";

const GridSanpava = () => {
  const [geoFeatures, setGeoFeatures] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch("/Sanpava.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el JSON");
        }
        return res.json();
      })
      .then((data) => {
        if (data.features && data.features.length > 0) {
          setGeoFeatures(data.features);
          setSelectedIndex(0);
        }
      })
      .catch((error) => console.error("Error al cargar el JSON:", error));
  }, []);

  if (geoFeatures.length === 0) {
    return <div>Cargando datos...</div>;
  }

  const selectedFeature = geoFeatures[selectedIndex].properties;

  // Función para calcular años y meses transcurridos desde la fecha de decreto
  const calcularTiempoTranscurrido = (fecha) => {
    const fechaDecreto = new Date(fecha);
    const fechaActual = new Date();

    const años = fechaActual.getFullYear() - fechaDecreto.getFullYear();
    const meses = fechaActual.getMonth() - fechaDecreto.getMonth();

    const totalAños = meses < 0 ? años - 1 : años;
    const totalMeses = meses < 0 ? meses + 12 : meses;

    return `${totalAños} años y ${totalMeses} meses`;
  };

  return (
    <div className="grid-container">
      <div className="grid-item dropdown">
        <label htmlFor="feature-select">Selecciona un área:</label>
        <select
          id="feature-select"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
        >
          {geoFeatures.map((feature, index) => (
            <option key={index} value={index}>
              {feature.properties.NOMBRE}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-item">
        <strong>Nombre:</strong> {selectedFeature.NOMBRE}
      </div>

      <div className="grid-item">
        <strong>Superficie:</strong>{" "}
        {selectedFeature.Shape_Area.toLocaleString()}
      </div>

      <div className="grid-item">
        <strong>Categoría:</strong> {selectedFeature.Categoria}
      </div>

      <div className="grid-item">
        <strong>Tipo:</strong> {selectedFeature.TipoDecret}
      </div>

      <div className="grid-item">
        <strong>Fecha de Decreto:</strong>{" "}
        {new Date(selectedFeature.Fecha_Cre).toLocaleDateString()}
      </div>

      <div className="grid-item">
        <strong>Ubicación:</strong> {selectedFeature.Delegacion}
      </div>

      {/* Nuevo campo para mostrar el tiempo transcurrido desde el decreto */}
      <div className="grid-item">
        <strong>Tiempo transcurrido:</strong>{" "}
        {calcularTiempoTranscurrido(selectedFeature.Fecha_Cre)}
      </div>

      <div className="grid-item mapa">
        <MapaSanpava />
      </div>
    </div>
  );
};

export default GridSanpava;
