// src/components/GridSanpava.jsx
import React from "react";
import MapaSanpava from "./MapaSanpava";
import "../../Styles/Sanpava/GridSanpava.css";
import { useGeoFeatures } from "../../context/GeoFeaturesContext";

const GridSanpava = () => {
  const { geoFeatures, selectedIndex, setSelectedIndex, selectedFeature, loading, error } = useGeoFeatures();

  if (loading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (geoFeatures.length === 0) {
    return <div>No se encontraron datos</div>;
  }

  // Calcula los años y meses transcurridos desde la fecha de decreto
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
        <strong>Nombre:</strong> {selectedFeature?.NOMBRE ?? 'No disponible'}
      </div>

      <div className="grid-item">
        <strong>Superficie:</strong>{" "}
        {selectedFeature?.Shape_Area?.toLocaleString() ?? 'No disponible'}
      </div>

      <div className="grid-item">
        <strong>Categoría:</strong> {selectedFeature?.Categoria ?? 'No disponible'}
      </div>

      <div className="grid-item">
        <strong>Tipo:</strong> {selectedFeature?.TipoDecret ?? 'No disponible'}
      </div>

      <div className="grid-item">
        <strong>Fecha de Decreto:</strong>{" "}
        {selectedFeature?.Fecha_Cre ? new Date(selectedFeature.Fecha_Cre).toLocaleDateString() : 'No disponible'}
      </div>

      <div className="grid-item">
        <strong>Ubicación:</strong> {selectedFeature?.Delegacion ?? 'No disponible'}
      </div>

      <div className="grid-item">
        <strong>Tiempo transcurrido:</strong>{" "}
        {selectedFeature?.Fecha_Cre ? calcularTiempoTranscurrido(selectedFeature.Fecha_Cre) : 'No disponible'}
      </div>

      <div className="grid-item mapa">
        <MapaSanpava
          features={geoFeatures}
          selectedIndex={selectedIndex}
          onFeatureSelect={setSelectedIndex}
        />
      </div>
    </div>
  );
};

export default GridSanpava;
