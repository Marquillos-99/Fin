import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaInfoCircle } from "react-icons/fa";
import "../../Styles/Inicio/Direcciones.css";

// Constants
const DIRECCIONES = [
  {
    id: "dgca",
    title: "DGCA",
    fullName: "Dirección General de Calidad del Aire",
    gradient: "linear-gradient(135deg, var(--color-blue), #50c9ce)",
    description: "Monitoreo y mejora de la calidad del aire",
  },
  {
    id: "dgeira",
    title: "DGEIRA",
    fullName:
      "Dirección General de Evaluación de Impacto y Regulación Ambiental",
    gradient: "linear-gradient(135deg, var(--color-yellow), #f5a623)",
    description: "Evaluación de impacto ambiental y regulación",
  },
  {
    id: "dgzcfs",
    title: "DGZCFS",
    fullName:
      "Dirección General de Zoológicos y Conservación de la Fauna Silvestre",
    gradient: "linear-gradient(135deg, var(--color-green), #56ab2f)",
    description: "Conservación de fauna silvestre y zoológicos",
  },
  {
    id: "dgsanpava",
    title: "DGSANPAVA",
    fullName:
      "Dirección General de Áreas Naturales Protegidas y Valor Ambiental",
    gradient: "linear-gradient(135deg, var(--color-pink), #8f3aaf)",
    description: "Protección de áreas naturales y valor ambiental",
  },
  {
    id: "dgcpca",
    title: "DGCPCA",
    fullName: "Dirección General de Políticas para el Cambio Climático",
    gradient: "linear-gradient(135deg, #ff416c, #d0021b)",
    description: "Políticas y acciones contra el cambio climático",
  },
  {
    id: "dgira",
    title: "DGIRA",
    fullName: "Dirección General de Inspección y Regulación Ambiental",
    gradient: "linear-gradient(135deg, #50e3c2, #2aab9b)",
    description: "Inspección y regulación ambiental",
  },
  {
    id: "dgcorenadr",
    title: "DGCORENADR",
    fullName:
      "Dirección General de Corresponsabilidad Ambiental y Desarrollo Rural",
    gradient: "linear-gradient(135deg, #8b572a, #a67b5b)",
    description: "Desarrollo rural y corresponsabilidad ambiental",
  },
];

/**
 * Componente de tarjeta individual para cada dirección
 */
const DireccionCard = React.memo(
  ({ title, fullName, gradient, description, isSelected, onClick }) => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        className={`direccion-card ${isSelected ? "selected" : ""}`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        style={{ "--card-gradient": gradient }}
        role="button"
        tabIndex={0}
        aria-label={`Ver información de ${fullName}`}
      >
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="card-overlay">
            <span className="card-fullname">{fullName}</span>
            <FaArrowRight className="card-icon" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }
);

/**
 * Componente principal de Direcciones
 */
const Direcciones = () => {
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleSelect = useCallback((id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  }, []);

  const handleMoreInfo = useCallback(
    (id) => {
      navigate(`/direcciones/${id}`);
    },
    [navigate]
  );

  const selectedDireccion = useMemo(
    () => DIRECCIONES.find((dir) => dir.id === selectedId),
    [selectedId]
  );

  return (
    <div className="direcciones-container">
      <h2 className="section-title">Direcciones Generales</h2>
      <p className="section-description">
        Selecciona una dirección para ver más información y acceder a sus
        servicios
      </p>

      <div className="direcciones-grid">
        {DIRECCIONES.map((direccion) => (
          <DireccionCard
            key={direccion.id}
            {...direccion}
            isSelected={selectedId === direccion.id}
            onClick={() => handleSelect(direccion.id)}
          />
        ))}
      </div>

      {selectedDireccion && (
        <div className="direccion-detail">
          <h3>{selectedDireccion.fullName}</h3>
          <p>{selectedDireccion.description}</p>
          <button
            className="btn-more-info"
            onClick={() => handleMoreInfo(selectedDireccion.id)}
            aria-label={`Más información sobre ${selectedDireccion.title}`}
          >
            <FaInfoCircle aria-hidden="true" /> Más información
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Direcciones);
