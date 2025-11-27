import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import Toast from "../components/Toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        email,
        name,
        lastname,
        role: "user",
      });

      setToast({ message: "Usuario creado con éxito", type: "success" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const googleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const fullname = user.displayName?.split(" ") || [];
      const first = fullname[0] || "";
      const last = fullname.slice(1).join(" ");

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          name: first,
          lastname: last,
          role: "user",
        },
        { merge: true }
      );

      setToast({ message: "Registrado con Google", type: "success" });
      setTimeout(() => navigate("/app/dashboard"), 1200);
    } catch (err) {
      setToast({ message: "Error al registrar con Google", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4
                    bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.2),transparent_70%)]">

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* CARD */}
<div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl
                      rounded-3xl p-10 w-full max-w-2xl animate-fadeUp">


        {/* HEADER */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-2">
          Crear cuenta
        </h2>
        <p className="text-gray-300 text-center mb-10">
          Completa tu información para comenzar
        </p>

        {/* FORM */}
        <form onSubmit={createUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div>
            <label className="text-gray-300 text-sm">Nombre</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-xl bg-white/10 border border-white/20
                         text-white outline-none focus:border-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="text-gray-300 text-sm">Apellido</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-xl bg-white/10 border border-white/20
                         text-white outline-none focus:border-indigo-400"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="text-gray-300 text-sm">Correo electrónico</label>
            <input
              type="email"
              className="mt-1 w-full p-3 rounded-xl bg-white/10 border border-white/20
                         text-white outline-none focus:border-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label className="text-gray-300 text-sm">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full p-3 rounded-xl bg-white/10 border border-white/20
                         text-white outline-none focus:border-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600
                         transition text-white font-medium shadow-lg shadow-indigo-500/40"
            >
              Registrar
            </button>
          </div>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-400 text-sm">o</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={googleRegister}
          className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10
                     transition flex items-center justify-center gap-3 text-white md:col-span-2"
        >
          <FaGoogle className="text-lg" /> Registrar con Google
        </button>

        {/* LINK */}
        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes una cuenta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}


