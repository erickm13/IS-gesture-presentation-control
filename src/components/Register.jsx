import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import "./../styles/Register.css";
import { auth, db } from "../firebase/config"; 
import { doc, setDoc } from "firebase/firestore";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name,
        lastname,
        role: "user",
      });

      alert("Usuario creado con éxito");
      navigate("/login");

    } catch (error) {
      console.error("Error al registrar:", error);
      alert(error.message);
    }
  };

  const googleRegister = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const fullName = user.displayName || "";
    const [firstName, lastName] = fullName.split(" ");

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: firstName || "",
      lastname: lastName || "",
      role: "user",
    }, { merge: true });

    alert("Usuario registrado con Google");
    navigate("/app/dashboard");

  } catch (error) {
    console.error("Error con Google:", error);
    alert(error.message);
  }
};


  return (
    <div className="center">
      <div className="login-container">
        <h2>Crear Usuario</h2>

        <form onSubmit={createUser}>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Apellido"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />

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
