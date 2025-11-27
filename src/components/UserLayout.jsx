import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { supabase } from "../supabaseClient";

export default function UserLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Detecta usuario logueado en Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Sincroniza Firebase con Supabase
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
    <div className="min-h-screen bg-[#0B1120] text-white">
      
      {/* NAVBAR GLASS */}
      <nav
        className="
          w-full sticky top-0 z-50 
          backdrop-blur-xl bg-white/5 border-b border-white/10
          shadow-lg shadow-black/20
          px-6 py-4 flex justify-between items-center
          animate-fadeDown
        "
      >
        <h1 className="text-xl font-bold tracking-wide text-white">
          Gesture Presenter
        </h1>

        {/* Usuario */}
        <div className="flex items-center gap-4">
          
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full bg-indigo-500/40 
                       border border-white/20 flex items-center 
                       justify-center text-white font-bold"
          >
            {currentUser?.email?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Email */}
          <span className="text-gray-300 hidden sm:block">
            {currentUser?.email}
          </span>

          {/* Logout */}
          <button
            onClick={logout}
            className="
              px-4 py-2 rounded-xl
              bg-white/10 hover:bg-white/20
              border border-white/20
              transition shadow 
              text-white
            "
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="p-6 animate-fadeUp">
        <Outlet />
      </div>

    </div>
  );
}

