import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { supabase } from "../supabaseClient";

export default function UserLayout({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Detecta usuario logueado en Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, []);


  useEffect(() => {
    const syncFirebaseToSupabase = async () => {
      if (!currentUser) return;

      try {
        const token = await currentUser.getIdToken(true);

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "firebase",
          token,
        });

        if (error) {
          console.error("Error autenticando con Supabase:", error);
        } else {
          console.log("Firebase y Supabase sesión creada:", data);
        }
      } catch (err) {
        console.error("Error obteniendo token Firebase:", err);
      }
    };

    syncFirebaseToSupabase();
  }, [currentUser]);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
        }}
      >
        <h3>Mi Panel</h3>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>{currentUser?.email}</span>
          <button
            onClick={logout}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRadius: "6px",
              background: "#fff",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
