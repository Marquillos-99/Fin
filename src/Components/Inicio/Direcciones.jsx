import React, { useState } from "react";
import "../../Styles/Inicio/Direcciones.css";

const options = [
  "DGCA",
  "DGEIRA",
  "DGZCFS",
  "DGSANPAVA",
  "DGCPCA",
  "DGIRA",
  "DGCORENADR",
];

const Direcciones = () => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
  };

  return (
    <div className="bento-grid">
      {options.map((option, index) => (
        <div
          key={index}
          className={`bento-item ${option.toLowerCase()} ${
            selected === option ? "selected" : ""
          }`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default Direcciones;
