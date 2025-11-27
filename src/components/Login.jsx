import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import Toast from "../components/Toast"; // <-- Asegúrate que este path es correcto

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app/dashboard");
    } catch (error) {
      setToast({ message: "Credenciales incorrectas.", type: "error" });
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/app/dashboard");
    } catch (error) {
      setToast({ message: "No se pudo iniciar sesión con Google.", type: "error" });
    }
  };

  const githubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/app/dashboard");
    } catch (error) {
      setToast({ message: "No se pudo iniciar sesión con GitHub.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_70%)] flex items-center justify-center px-4">

      {/* TOAST (ESTO SÍ VA AQUÍ) */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* CONTENEDOR GLASS */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-md relative animate-fadeUp">
 
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Bienvenido de nuevo
        </h2>
        <p className="text-gray-300 text-sm text-center mb-8">
          Controla tus presentaciones con IA y gestos.  
        </p>

        {/* Iconos flotantes */}
        <div className="absolute -top-10 right-10 opacity-30">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            alt="JS"
            className="w-10 animate-pulse"
          />
        </div>
        <div className="absolute -bottom-12 left-10 opacity-30">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
            alt="React"
            className="w-10 animate-bounce"
          />
        </div>

        {/* FORMULARIO */}
        <form onSubmit={login} className="space-y-5">
          <div>
            <label className="text-gray-300 text-sm">Correo electrónico</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-indigo-400 outline-none"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Contraseña</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-indigo-400 outline-none"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition font-medium text-white shadow-lg shadow-indigo-500/40"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-400 text-sm">o continuar con</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Social logins */}
        <div className="space-y-3">

          <button
            className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 
                       transition flex items-center justify-center gap-3 text-white"
            onClick={googleLogin}
          >
            <FaGoogle className="text-lg" />
            Google
          </button>

          <button
            className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 
                       transition flex items-center justify-center gap-3 text-white"
            onClick={githubLogin}
          >
            <FaGithub className="text-lg" />
            GitHub
          </button>

        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿No tienes una cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}

