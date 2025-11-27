import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import GesturePdfPresenter from "../components/GesturePdfPresenter.jsx";
import HandController from "../components/HandController.jsx";
import { supabase } from "../supabaseClient";

export default function PrincipalProject() {
  const { id } = useParams();
  const { state } = useLocation();
  const [pdfBase64, setPdfBase64] = useState(null);
  const presenterRef = useRef(null);

  useEffect(() => {
    if (state?.pdfData) {
      setPdfBase64(state.pdfData.pdf_content);
    }
  }, [state]);

  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("presentations")
        .select("pdf_content")
        .eq("id", id)
        .single();

      if (!error) {
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
        p-6 relative
      "
    >

      {/* HEADER */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">Gesture PDF Presenter</h1>
        <p className="text-gray-400">Controla tus presentaciones con gestos</p>
      </header>

      {/* PRESENTACIÓN (ARRIBA) */}
      <div className="max-w-6xl mx-auto">
        <div
          className="
            w-full h-[70vh] 
            bg-black/20 border border-white/10 
            rounded-3xl shadow-2xl backdrop-blur-xl p-4
          "
        >
          {pdfBase64 ? (
            <GesturePdfPresenter pdfBase64={pdfBase64} ref={presenterRef} />
          ) : (
            <p className="text-center text-gray-400">Cargando PDF...</p>
          )}
        </div>

        {/* CONTROLES (ABAJO DEL PDF) */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
            onClick={() => document.getElementById("pdfInput").click()}
          >
            Subir PDF
          </button>

          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            className="hidden"
          />

          <button
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
            onClick={() => presenterRef.current?.prevPage?.()}
          >
            Anterior
          </button>

          <button
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
            onClick={() => presenterRef.current?.nextPage?.()}
          >
            Siguiente
          </button>

          <button
            className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            onClick={() => presenterRef.current?.toggleFullscreen?.()}
          >
            Pantalla completa
          </button>
        </div>
      </div>

      {/* CÁMARA (ESQUINA INFERIOR DERECHA) */}
      <div
        className="
          fixed bottom-6 right-6 
          w-[380px] 
          bg-white/5 backdrop-blur-xl border border-white/10
          p-4 rounded-3xl shadow-xl
        "
      >
        <HandController
          onSwipeLeft={() => presenterRef.current?.prevPage?.()}
          onSwipeRight={() => presenterRef.current?.nextPage?.()}
          onToggleFullscreen={() => presenterRef.current?.toggleFullscreen?.()}
        />
      </div>

      {/* FOOTER */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        PROYECTO INGENIERIA DE SOFTWARE · Universidad
      </footer>
    </div>
  );
}

