// App.jsx
import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeAnimation from "./Components/Inicio/WelcomeAnimation";
import Header from "./Components/Header/Header.jsx";
import Direcciones from "./Components/Inicio/Direcciones.jsx";
import { GeoFeaturesProvider } from "./context/GeoFeaturesContext";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <Router>
      <GeoFeaturesProvider>
        {showWelcome ? (
          <WelcomeAnimation onAnimationEnd={() => setShowWelcome(false)} />
        ) : (
          <div className="elemento1">
            <Header />
            <Direcciones />
          </div>
        )}
      </GeoFeaturesProvider>
    </Router>
  );
}

export default App;
