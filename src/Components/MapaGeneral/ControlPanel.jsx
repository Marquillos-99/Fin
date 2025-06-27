import React, { useState, useCallback } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useGeoFeatures } from "../../context/GeoFeaturesContext";
import "../../Styles/MapaGeneral/ControlPanel.css";

// Reusable Checkbox Component
const Checkbox = React.memo(({ id, label, checked, onChange, level = 1 }) => {
  const handleChange = useCallback((e) => {
    e.stopPropagation();
    onChange(id, e.target.checked);
  }, [id, onChange]);

  return (
    <div className="checkbox-container" style={{ '--level': level }}>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="checkmark"></span>
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
});

// Category Component
const Category = React.memo(({ 
  id, 
  label, 
  options = [], 
  isExpanded, 
  onToggle, 
  onToggleOption,
  selectedOptions = {},
  level = 0 
}) => {
  const hasChildren = options && options.length > 0;
  
  return (
    <div className={`category level-${level}`}>
      <div 
        className="category-header" 
        onClick={() => hasChildren && onToggle(id)}
      >
        {hasChildren && (
          <span className="toggle-icon">
            {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </span>
        )}
        <Checkbox
          id={id}
          label={label}
          checked={!!selectedOptions[id]}
          onChange={onToggleOption}
          level={level}
        />
      </div>
      
      {hasChildren && isExpanded && (
        <div className="sub-options">
          {options.map(option => (
            <div key={option.id} className="option-item">
              {option.children ? (
                <Category
                  id={option.id}
                  label={option.label}
                  options={option.children}
                  isExpanded={isExpanded}
                  onToggle={onToggle}
                  onToggleOption={onToggleOption}
                  selectedOptions={selectedOptions}
                  level={level + 1}
                />
              ) : (
                <Checkbox
                  id={option.id}
                  label={option.label}
                  checked={!!selectedOptions[option.id]}
                  onChange={onToggleOption}
                  level={level + 1}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const ControlPanel = () => {
  const { toggleLayer, activeLayers } = useGeoFeatures();
  
  const [expandedCategories, setExpandedCategories] = useState({
    agua: true,
    aire: true,
    ordenamiento: true,
    cdmx: true,
  });

  // Toggle category expansion
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  // Handle layer toggles
  const handleToggleOption = useCallback((optionId) => {
    // Map option IDs to layer names
    const layerMap = {
      cdmxLayer: 'cdmx',
      // Add other layer mappings here
    };

    const layerName = layerMap[optionId] || optionId;
    toggleLayer(layerName);
    
    // Return false to prevent default behavior
    return false;
  }, [toggleLayer]);

  // Define categories and their options
  const categories = [
    {
      id: "cdmx",
      label: "CDMX",
      options: [
        { id: "cdmxLayer", label: "Límites de la CDMX" }
      ]
    },
    {
      id: "agua",
      label: "Agua",
      options: [
        { id: "cuerposAguaSuperficiales", label: "Cuerpo de Aguas Superficiales" },
        { id: "aguasSubterraneas", label: "Aguas Subterráneas" },
        { id: "cuencasHidrologicas", label: "Cuencas Hidrológicas" },
        { id: "zonasRecargaAcuiferos", label: "Zona de Recarga de Acuíferos" },
        { id: "usosDelAgua", label: "Usos del Agua" },
        { id: "regionesHidrologicas", label: "Regiones Hidrológico-administrativas" }
      ]
    },
    {
      id: "aireAtmosfera",
      label: "Aire y Atmósfera",
      options: [
        { id: "simat", label: "SIMAT" },
        {
          id: "emisionesAtmosfericas",
          label: "Emisiones atmosféricas",
          children: [
            { id: "fuentesFijas", label: "Fuentes fijas" },
            { id: "fuentesMoviles", label: "Fuentes móviles" }
          ]
        },
        { id: "radiacionSolar", label: "Radiación Solar" }
      ]
    },
    {
      id: "ordenamientoEcologico",
      label: "Ordenamiento Ecológico",
      options: [
        {
          id: "anp",
          label: "ANP",
          children: [
            { id: "anpFederal", label: "Federal" },
            { id: "anpLocal", label: "Local" }
          ]
        },
        {
          id: "ava",
          label: "AVA",
          children: [
            { id: "avaBarrancas", label: "Barrancas" },
            { id: "avaBosquesUrbanos", label: "Bosques Urbanos" }
          ]
        },
        { id: "suelosConservacion", label: "Suelos de Conservación" },
        { id: "reforestacion", label: "Reforestación" },
        { id: "reforestacionLineal", label: "Reforestación Lineal" },
        { id: "incendiosForestales", label: "Incendios Forestales" },
        { id: "accionesPrevencionIncendios", label: "Acciones de Prevención de Incendios" },
        { id: "obrasConservacionAguaSuelo", label: "Obras de Conservación de Agua y Suelo" },
        { id: "notificacionesSaneamientoForestal", label: "Notificaciones de Saneamiento Forestal" },
        { id: "podasPreventivasSanitarias", label: "Podas Preventivas Sanitarias" },
        { id: "sitiosMonitoreoForestal", label: "Sitios de Monitoreo Forestal" }
      ]
    }
  ];

  return (
    <div className="control-panel">
      <div className="control-panel-inner">
        <h3>Capas del Mapa</h3>
        <div className="categories-container">
          {categories.map(category => (
            <Category
              key={category.id}
              id={category.id}
              label={category.label}
              options={category.options}
              isExpanded={expandedCategories[category.id]}
              onToggle={toggleCategory}
              onToggleOption={handleToggleOption}
              selectedOptions={activeLayers}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
