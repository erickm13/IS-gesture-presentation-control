import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "./../styles/Login.css"; // ← ¡Usamos el MISMO CSS!

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Usuario creado: ${email}`);
    navigate("/login");
  };

  const googleRegister = () => {
    console.log("Registro con Google...");
  };

  return (
    <div className="center">
      <div className="login-container"> 
        <h2>Crear Usuario</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Registrar</button>
        </form>

        <button className="google-btn" onClick={googleRegister}>
          <FaGoogle className="google-icon" /> Registrar con Google
        </button>
      </div>
    </div>
  );
}
