import React, { useState } from "react";
import Mapa from "./Mapa";
import ControlPanel from "./ControlPanel";
import { FaLayerGroup } from "react-icons/fa";
import "../../Styles/MapaGeneral/Mapa_con_info.css";

const MapaConInfo = () => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="map-container">
      <Mapa />
      <button 
        className={`panel-toggle-btn ${isPanelVisible ? 'active' : ''}`}
        onClick={togglePanel}
        title={isPanelVisible ? 'Ocultar capas' : 'Mostrar capas'}
      >
        <FaLayerGroup className="panel-toggle-icon" />
      </button>
      {isPanelVisible && (
        <div className="control-panel-overlay">
          <ControlPanel />
        </div>
      )}
    </div>
  );
};

export default MapaConInfo;
