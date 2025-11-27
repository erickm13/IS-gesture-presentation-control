import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import GesturePdfPresenter from "../components/GesturePdfPresenter.jsx";
import HandController from "../components/HandController.jsx";
import { supabase } from "../supabaseClient";

export default function PrincipalProject() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [pdfBase64, setPdfBase64] = useState(null);

  // Control de cámara y gestos
  const [gesturesEnabled, setGesturesEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const presenterRef = useRef(null);

  // Si viene desde Dashboard
  useEffect(() => {
    if (state?.pdfData) {
      setPdfBase64(`data:application/pdf;base64,${state.pdfData.pdf_content}`);
    }
  }, [state]);

  // Si se recarga la página
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!id) return;

      const { data } = await supabase
        .from("presentations")
        .select("pdf_content")
        .eq("id", id)
        .single();

      if (data?.pdf_content) {
        setPdfBase64(`data:application/pdf;base64,${data.pdf_content}`);
      }
    };

    loadFromSupabase();
  }, [id]);

  return (
    <div
      className="
        min-h-screen text-white 
        bg-[#0B1120] 
        bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_70%)]
        p-4 md:p-6 relative
      "
    >

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Gesture PDF Presenter</h1>
          <p className="text-gray-400">Controla tus presentaciones con gestos</p>
        </div>

        <button
          onClick={() => navigate("/app/dashboard")}
          className="px-4 py-2 bg-white/10 border border-white/20 
                     hover:bg-white/20 rounded-xl shadow-lg transition"
        >
          ⬅ Volver al Dashboard
        </button>
      </header>

      {/* CONTENEDOR PDF */}
      <div className="max-w-6xl mx-auto">
        <div
          className="
            w-full 
            h-[55vh] md:h-[70vh]        /* Responsive height */
            bg-black/20 border border-white/10 
            rounded-3xl shadow-2xl backdrop-blur-xl p-3 md:p-4
          "
        >
          {pdfBase64 ? (
            <GesturePdfPresenter pdfBase64={pdfBase64} ref={presenterRef} />
          ) : (
            <p className="text-center text-gray-400 mt-20">Cargando PDF...</p>
          )}
        </div>

        {/* CONTROLES PDF */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
            onClick={() => presenterRef.current?.prevPage?.()}
          >
            ⬅ Anterior
          </button>

          <button
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
            onClick={() => presenterRef.current?.nextPage?.()}
          >
            Siguiente ➜
          </button>

          <button
            className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            onClick={() => presenterRef.current?.toggleFullscreen?.()}
          >
            ⛶ Pantalla completa
          </button>
        </div>
      </div>

      {/* PANEL CAMARA+GESTOS (Móvil abajo, Desktop a la derecha) */}
      <div
        className="
          w-full md:w-[400px]
          mt-6 md:mt-0
          md:fixed md:bottom-36 md:right-6
          bg-white/5 backdrop-blur-xl border border-white/10
          p-4 rounded-3xl shadow-xl
        "
      >
        {/* Botones superiores */}
        <div className="flex justify-between mb-3">
          <button
            onClick={() => setGesturesEnabled((v) => !v)}
            className={`px-3 py-1 rounded-lg text-sm ${
              gesturesEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {gesturesEnabled ? "Desactivar gestos" : "Activar gestos"}
          </button>

          <button
            onClick={() => setCameraEnabled((v) => !v)}
            className={`px-3 py-1 rounded-lg text-sm ${
              cameraEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {cameraEnabled ? "Desactivar cámara" : "Activar cámara"}
          </button>
        </div>

        {/* Cámara o placeholder */}
        <HandController
          gesturesEnabled={gesturesEnabled}
          cameraEnabled={cameraEnabled}
          onSwipeLeft={() => presenterRef.current?.prevPage?.()}
          onSwipeRight={() => presenterRef.current?.nextPage?.()}
          onToggleFullscreen={() => presenterRef.current?.toggleFullscreen?.()}
        />
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        PROYECTO INGENIERÍA DE SOFTWARE · Universidad
      </footer>
    </div>
  );
}

