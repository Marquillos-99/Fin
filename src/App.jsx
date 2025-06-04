// App.jsx
import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeAnimation from "./Components/Inicio/WelcomeAnimation";
import Header from "./Components/Header/Header.jsx";
import Mapa from "./Components/MapaGeneral/Mapa.jsx";
import MapaCorena from "./Components/Corena/MapaCorena.jsx";
import GridSanpava from "./Components/Sanpava/GridSanpava.jsx";
import Direcciones from "./Components/Inicio/Direcciones.jsx";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <Router>
      {showWelcome ? (
        <WelcomeAnimation onAnimationEnd={() => setShowWelcome(false)} />
      ) : (
        <div className="elemento1">
          <Header />
          <Routes>
            <Route path="/" element={<Mapa />} />
            <Route path="/mapacorena" element={<MapaCorena />} />
            <Route path="/gridsanpava" element={<GridSanpava />}></Route>
          </Routes>
          <Direcciones />
        </div>
      )}
    </Router>
  );
}

export default App;
