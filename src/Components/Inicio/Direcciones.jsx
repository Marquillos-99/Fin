import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FaArrowRight } from "react-icons/fa";
import "../../Styles/Inicio/Direcciones.css";

// Importar imágenes
const cardImages = {
  dgca: new URL("../../assets/DGCA.webp", import.meta.url).href,
  dgeira: new URL("../../assets/Regulacion.webp", import.meta.url).href,
  dgsanpava: new URL("../../assets/sanpava.webp", import.meta.url).href,
  dgzcfs: new URL("../../assets/zoo.webp", import.meta.url).href,
};

// Constantes para las direcciones
const DIRECCIONES = [
  {
    id: "dgca",
    title: "DGCA",
    fullName: "Dirección General de Calidad del Aire",
    gradient: "linear-gradient(135deg, var(--color-blue), #50c9ce)",
    description: "",
    hasImage: true,
  },
  {
    id: "dgeira",
    title: "DGEIRA",
    fullName:
      "Dirección General de Evaluación de Impacto y Regulación Ambiental",
    gradient: "linear-gradient(135deg, var(--color-yellow), #f5a623)",
    description: "",
    hasImage: true,
  },
  {
    id: "dgzcfs",
    title: "DGZCFS",
    fullName:
      "Dirección General de Zoológicos y Conservación de la Fauna Silvestre",
    gradient: "linear-gradient(135deg, var(--color-green), #56ab2f)",
    description: "",
    hasImage: true,
  },
  {
    id: "dgsanpava",
    title: "DGSANPAVA",
    fullName:
      "Dirección General de Áreas Naturales Protegidas y Valor Ambiental",
    gradient: "linear-gradient(135deg, var(--color-pink), #8f3aaf)",
    description: "",
    hasImage: true,
  },
  {
    id: "dgcpc",
    title: "DGCPC",
    fullName: "Dirección General de Políticas para el Cambio Climático",
    gradient: "linear-gradient(135deg, #ff416c, #d0021b)",
    description: "Políticas y acciones contra el cambio climático",
    hasImage: false,
  },
  {
    id: "dgira",
    title: "DGIRA",
    fullName: "Dirección General de Inspección y Regulación Ambiental",
    gradient: "linear-gradient(135deg, #50e3c2, #2aab9b)",
    description: "Inspección y regulación ambiental",
    hasImage: false,
  },
  {
    id: "dgcorenadr",
    title: "DGCORENADR",
    fullName:
      "Dirección General de Corresponsabilidad Ambiental y Desarrollo Rural",
    gradient: "linear-gradient(135deg, #8b572a, #a67b5b)",
    description: "Desarrollo rural y corresponsabilidad ambiental",
    hasImage: false,
  },
];

/**
 * Componente de tarjeta individual para cada dirección
 */
const DireccionCard = React.memo(
  ({
    id,
    title,
    fullName,
    gradient,
    description,
    isSelected,
    onClick,
    hasImage,
    imageAlt,
  }) => {
    // Manejador de eventos de teclado para accesibilidad
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      },
      [onClick]
    );

    // Estilo para la tarjeta basado en si tiene imagen o no
    const getCardStyle = useCallback(() => {
      if (!hasImage) return { "--card-gradient": gradient };

      const imageUrl = cardImages[id];
      if (!imageUrl) return { "--card-gradient": gradient };

      return {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.9)",
        transition: "filter 0.5s ease",
        "--card-gradient": "none",
      };
    }, [hasImage, id, gradient]);

    // Manejadores de hover para tarjetas con imágenes
    const handleMouseEnter = useCallback(
      (e) => {
        if (hasImage) {
          e.currentTarget.style.filter = "brightness(1.3)";
        }
      },
      [hasImage]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (hasImage) {
          e.currentTarget.style.filter = "brightness(0.9)";
        }
      },
      [hasImage]
    );

    return (
      <div
        className={`direccion-card ${isSelected ? "selected" : ""}`}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={getCardStyle()}
        role="button"
        tabIndex={0}
        aria-label={`Ver información de ${fullName}`}
        data-testid={`direccion-card-${id}`}
      >
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="card-overlay">
            <span className="card-fullname">{fullName}</span>
            <FaArrowRight className="card-icon" aria-hidden="true" />
          </div>
        </div>
        {hasImage && <span className="sr-only">{imageAlt}</span>}
      </div>
    );
  }
);

/**
 * Componente principal de Direcciones
 */
const Direcciones = () => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = useCallback((id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  }, []);

  // Función para manejar la navegación por teclado
  const handleKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(id);
      }
    },
    [handleSelect]
  );

  return (
    <div className="direcciones-container">
      <div className="direcciones-grid">
        {DIRECCIONES.map((direccion) => (
          <DireccionCard
            key={direccion.id}
            id={direccion.id}
            title={direccion.title}
            fullName={direccion.fullName}
            gradient={direccion.gradient}
            description={direccion.description}
            isSelected={selectedId === direccion.id}
            onClick={() => handleSelect(direccion.id)}
            onKeyDown={(e) => handleKeyDown(e, direccion.id)}
            hasImage={direccion.hasImage}
            imageAlt={direccion.imageAlt}
            aria-label={`${direccion.title} - ${direccion.description}`}
          />
        ))}
      </div>
    </div>
  );
};

// Propiedades por defecto para el componente DireccionCard
DireccionCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  gradient: PropTypes.string,
  description: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  hasImage: PropTypes.bool,
  imageAlt: PropTypes.string,
};

DireccionCard.defaultProps = {
  gradient: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
  isSelected: false,
  hasImage: false,
  imageAlt: "",
  onKeyDown: () => {},
};

export default React.memo(Direcciones);
