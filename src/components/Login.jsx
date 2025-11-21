import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { FaGoogle } from "react-icons/fa";
import "./../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/presenter");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas o usuario no registrado.");
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      navigate("/presenter");
    } catch (error) {
      console.error("Error con Google Login:", error);
      alert("No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <div className="center">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={login}>
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
