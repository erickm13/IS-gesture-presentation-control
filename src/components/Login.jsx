import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "./../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    debugger
    if (email === "1@1.1" && password === "1") {
      navigate("/presenter");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const googleLogin = () => {
    console.log("Login con Google...");
  };

  return (
    <div className="center">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
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
          <button type="submit">Entrar</button>
        </form>

        <button className="google-btn" onClick={googleLogin}>
          <FaGoogle className="google-icon" /> Entrar con Google
        </button>
      </div>
    </div>
  );
}
