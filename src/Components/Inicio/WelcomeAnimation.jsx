// src/WelcomeAnimation.jsx
import React, { useEffect } from "react";
import "../../Styles/Inicio/WelcomeAnimation.css";

function WelcomeAnimation({ onAnimationEnd }) {
  const [fadeOut, setFadeOut] = React.useState(false);

  useEffect(() => {
    // Espera 5 segundos antes de iniciar el fade-out
    const timer = setTimeout(() => {
      setFadeOut(true); // Activa el efecto fade-out

      // Duración del fade-out: 1 segundo (1000 ms)
      const fadeDuration = 2000;
      setTimeout(() => {
        if (onAnimationEnd) onAnimationEnd();
      }, fadeDuration);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className={`welcome-animation ${fadeOut ? "fade-out" : ""}`}>
      <h1>Bienvenido al SIA</h1>
      <div className="spinning-map">
        {/* Reemplaza 'ruta_a_tu_imagen.png' por la ruta o URL de la imagen deseada */}
        <img
          src="https://bing.com/th/id/BCO.7f9bd27b-fdaf-4a2c-ba6a-ec40c8d762c7.png"
          alt="Mapa giratorio"
        />
      </div>
    </div>
  );
}

export default WelcomeAnimation;
