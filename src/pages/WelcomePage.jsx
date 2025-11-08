import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      <h1>Bienvenido a proyecto ing, software</h1>
      <p>
        Este proyecto te permite controlar presentaciones PDF usando gestos de la mano detectados con tu cámara.
      </p>

      <div className="buttons">
        <button onClick={() => navigate("/register")}>Crear Usuario</button>
        <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
      </div>
    </div>
  );
}
