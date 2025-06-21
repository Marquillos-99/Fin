// src/Components/Inicio/WelcomeAnimation.jsx
import React, { useEffect, useState, useCallback } from "react";
import "../../Styles/Inicio/WelcomeAnimation.css";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";

function WelcomeAnimation({ onAnimationEnd }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [text, setText] = useState("");
  const fullText = "Bienvenido al SIA";
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efecto para la animación de escritura
  useEffect(() => {
    if (currentIndex < fullText.length) {
      setTimeout(() => {
        setText(fullText.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
    } else {
      // Iniciar cuenta regresiva para el fade-out después de mostrar el texto completo
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          if (onAnimationEnd) onAnimationEnd();
        }, 1500);
      }, 1500);
    }
  }, [currentIndex, onAnimationEnd]);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {
    // Opcional: hacer algo cuando las partículas se carguen
  }, []);

  return (
    <div className={`welcome-animation ${fadeOut ? "fade-out" : ""}`}>
      <Particles
        id="tsparticles"
        className="particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#1a1a2e",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
              },
            },
            modes: {
              push: {
                quantity: 4,
              },
              grab: {
                distance: 200,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#90e0ef",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.7,
              random: true,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 2, max: 4 },
              random: true,
            },
          },
          detectRetina: true,
        }}
      />
      <div className="content">
        <h1 className="typing-effect">
          {text}
          <span className="cursor">|</span>
        </h1>
        <div className="logo-container">
          <div className="logo-wrapper">
            <div className="spinning-border"></div>
            <img src="/SIA.png" alt="SIA" className="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeAnimation;
