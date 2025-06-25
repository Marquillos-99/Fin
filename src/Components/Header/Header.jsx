// Header.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Header/Header.css";

const Header = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleDireccionesClick = (e) => {
    e.preventDefault();
    setShowOptions(!showOptions); // Alterna la visibilidad del panel
  };

  const handleOptionClick = (option) => {
    if (option === "Corena") {
      navigate("/mapacorena");
    }

    if (option === "Sanpava") {
      navigate("/gridsanpava");
    }
    // Opcionalmente, para otros casos:
    // else if (option === "Sanpava") {
    //   navigate("/sanpava");
    // }
  };

  return (
    <header>
      <div className="header-top">
        <div className="logo-container">
          <img src="/SIA.png" alt="Gobierno de la Ciudad de México" />
        </div>
        <nav className="nav-top">
          {/* Botón "Inicio" para regresar a la página principal */}
          <button onClick={() => navigate("/")} className="nav-button">
            Inicio
          </button>
          <a href="https://www.gob.mx/tramites" className="nav-button">
            Trámites
          </a>
          <button className="nav-button">Gobierno</button>
          <button className="nav-button search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              fill="#fff"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27a6.47 6.47 0 001.57-4.23 6.5 6.5 0 00-6.5-6.5 6.5 6.5 0 00-6.5 6.5 6.5 6.5 0 006.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l4.25 4.25 1.5-1.5L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </nav>
      </div>
      <div className="header-bottom">
        <nav className="nav-bottom">
          <a href="#">Acciones y programas</a>
          <a href="#">Documentos</a>
          <a href="#">Contacto</a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/mapa-general");
            }}
          >
            Mapa General
          </a>
          <a href="#">Transparencia</a>
          <a href="#" onClick={handleDireccionesClick}>
            Direcciones
          </a>
        </nav>
      </div>

      {/* Panel de selección, visible al hacer clic en "Direcciones" */}
      {showOptions && (
        <div className={`option-panel ${showOptions ? "show" : ""}`}>
          <button onClick={() => handleOptionClick("Corena")}>Corena</button>
          <button onClick={() => handleOptionClick("Sanpava")}>Sanpava</button>
        </div>
      )}
    </header>
  );
};

export default Header;
