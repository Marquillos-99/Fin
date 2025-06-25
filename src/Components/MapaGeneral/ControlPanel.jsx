import React, { useState, useCallback } from "react";

// Reusable Checkbox Component
const Checkbox = ({ id, label, checked, onChange, isBold = false, level = 0 }) => (
  <div style={{ margin: "5px 0", marginLeft: `${level * 20}px` }}>
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        style={{ marginRight: "8px" }}
      />
      <span style={{ fontWeight: isBold ? "bold" : "normal" }}>{label}</span>
    </label>
  </div>
);

// Category Component
const Category = ({ category, options, selectedOptions, onCheckboxChange }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <Checkbox
        id={category.id}
        label={category.label}
        checked={selectedOptions[category.id]}
        onChange={onCheckboxChange}
        isBold
      />
      
      {selectedOptions[category.id] && (
        <div>
          {options.map((option) => (
            <div key={option.id}>
              {option.children ? (
                <Category
                  category={option}
                  options={option.children}
                  selectedOptions={selectedOptions}
                  onCheckboxChange={onCheckboxChange}
                />
              ) : (
                <Checkbox
                  id={option.id}
                  label={option.label}
                  checked={selectedOptions[option.id]}
                  onChange={onCheckboxChange}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ControlPanel = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    // Agua category
    agua: false,
    cuerposAguaSuperficiales: false,
    aguasSubterraneas: false,
    cuencasHidrologicas: false,
    zonasRecargaAcuiferos: false,
    usosDelAgua: false,
    regionesHidrologicas: false,
    
    // Aire y Atmósfera category
    aireAtmosfera: false,
    simat: false,
    emisionesAtmosfericas: false,
    fuentesFijas: false,
    fuentesMoviles: false,
    radiacionSolar: false,
    
    // Ordenamiento Ecológico category
    ordenamientoEcologico: false,
    anp: false,
    anpFederal: false,
    anpLocal: false,
    ava: false,
    avaBarrancas: false,
    avaBosquesUrbanos: false,
    suelosConservacion: false,
    reforestacion: false,
    reforestacionLineal: false,
    incendiosForestales: false,
    accionesPrevencionIncendios: false,
    obrasConservacionAguaSuelo: false,
    notificacionesSaneamientoForestal: false,
    podasPreventivasSanitarias: false,
    sitiosMonitoreoForestal: false
  });

  const handleCheckboxChange = useCallback((option) => {
    setSelectedOptions(prev => {
      const newState = !prev[option];
      const updates = { [option]: newState };

      // Define parent-child relationships
      const relationships = {
        agua: ["cuerposAguaSuperficiales", "aguasSubterraneas", "cuencasHidrologicas", "zonasRecargaAcuiferos", "usosDelAgua", "regionesHidrologicas"],
        aireAtmosfera: ["simat", "emisionesAtmosfericas", "radiacionSolar"],
        emisionesAtmosfericas: ["fuentesFijas", "fuentesMoviles"],
        ordenamientoEcologico: ["anp", "ava", "suelosConservacion", "reforestacion", "reforestacionLineal", "incendiosForestales", "accionesPrevencionIncendios", "obrasConservacionAguaSuelo", "notificacionesSaneamientoForestal", "podasPreventivasSanitarias", "sitiosMonitoreoForestal"],
        anp: ["anpFederal", "anpLocal"],
        ava: ["avaBarrancas", "avaBosquesUrbanos"]
      };

      // If unchecking a parent, uncheck all children
      if (!newState && relationships[option]) {
        relationships[option].forEach(child => {
          updates[child] = false;
          // Also uncheck grandchildren if they exist
          if (relationships[child]) {
            relationships[child].forEach(grandchild => {
              updates[grandchild] = false;
            });
          }
        });
      }

      // If checking a child, ensure parent is checked
      if (newState) {
        Object.entries(relationships).forEach(([parent, children]) => {
          if (children.includes(option)) {
            updates[parent] = true;
          }
        });
      }

      return { ...prev, ...updates };
    });
  }, []);

  // Define categories and their options
  const categories = [
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
    <div className="control-panel-content">
      <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Opciones del Mapa</h3>
      
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          options={category.options}
          selectedOptions={selectedOptions}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
  );
};

export default ControlPanel;
