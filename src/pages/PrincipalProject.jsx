import React, { useEffect, useState,useRef } from "react";
import { useLocation, useParams  } from "react-router-dom";
import GesturePdfPresenter from "../components/GesturePdfPresenter.jsx";
import HandController from "../components/HandController.jsx";
//import "./../styles/PrincipalProject.css"

import { supabase } from "../supabaseClient";

export default function PrincipalProject() {
  const { id } = useParams();
  const { state } = useLocation();

  const [pdfBase64, setPdfBase64] = useState(null);
  const presenterRef = useRef(null);

  //estos sirven en teoria para pdoer cargar
  useEffect(() => {
  console.log("PDF recibido:", pdfBase64?.substring(0, 50));
}, [pdfBase64]);

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

      if (error) {
        console.error("Error cargando PDF:", error);
        return;
      }

      setPdfBase64(`data:application/pdf;base64,${data.pdf_content}`);

    };

    loadFromSupabase();
  }, [id]);

    return (
    <div className="app">
      <header>
        <h1>Gestures PDF Presenter</h1>
        <p className="status">Controla un PDF con gestos de la mano (webcam).</p>
      </header>

      <main className="grid">
        {pdfBase64 ? (
          <GesturePdfPresenter pdfBase64={pdfBase64} ref={presenterRef} />
        ) : (
          <p>Cargando PDF...</p>
        )}

        <HandController
          onSwipeLeft={() => presenterRef.current?.prevPage?.()}
          onSwipeRight={() => presenterRef.current?.nextPage?.()}
          onToggleFullscreen={() => presenterRef.current?.toggleFullscreen?.()}
        />
      </main>

      <footer>
        <small>PROYECTO INGENIERIA DE SOFTWARE</small>
      </footer>
    </div>
  );

}