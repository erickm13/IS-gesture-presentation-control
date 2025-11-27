import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { auth } from "../firebase/config";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Dashboard() {
  const MAX_FREE_FILES = 5;

  const [pdfs, setPdfs] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [limitReached, setLimitReached] = useState(false);

  const navigate = useNavigate();

  // ==== THUMBNAILS ====
  const generateThumbnail = async (base64, id) => {
    try {
      const cleanBase64 = base64.includes("base64,")
        ? base64.split("base64,")[1]
        : base64;

      const binary = atob(cleanBase64);
      const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));

      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 }); // más calidad

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const imgURL = canvas.toDataURL("image/jpeg", 0.85);

      setThumbnails((prev) => ({ ...prev, [id]: imgURL }));
    } catch (err) {
      console.error("⚠ Miniatura error:", err);
    }
  };

  // ==== LOAD PDFs ====
  useEffect(() => {
    const loadPDFs = async () => {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .eq("user_id", auth.currentUser.uid);

      if (error) return console.error(error);

      setPdfs(data);
      setLimitReached(data.length >= MAX_FREE_FILES);

      data.forEach((pdf) => {
        if (pdf.pdf_content) generateThumbnail(pdf.pdf_content, pdf.id);
      });
    };

    loadPDFs();
  }, []);

  // ==== SUBIR PDF ====
  const handlePdfUpload = async (e) => {
    if (limitReached) {
      document.getElementById("premiumModal").showModal();
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64PDF = reader.result.split(",")[1];

      const { error } = await supabase.from("presentations").insert({
        user_id: auth.currentUser.uid,
        name: file.name,
        pdf_content: base64PDF,
      });

      if (!error) window.location.reload();
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className="min-h-screen bg-[#0B1120] text-white p-6
                 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_70%)]"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 animate-fadeUp">
        <h1 className="text-4xl font-bold">Mis Presentaciones</h1>

        {limitReached && (
          <span className="text-sm text-red-400">
            Alcanzaste tu límite gratuito de {MAX_FREE_FILES} archivos.
          </span>
        )}
      </div>

      {/* BOTÓN SUBIR */}
      <div className="flex gap-4 items-center mb-8 animate-fadeUp">
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          className="hidden"
          onChange={handlePdfUpload}
        />

        <button
          disabled={limitReached}
          onClick={() => {
            if (limitReached) {
              document.getElementById("premiumModal").showModal();
            } else {
              document.getElementById("pdfInput").click();
            }
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-lg transition
          ${
            limitReached
              ? "bg-red-500/20 border-red-500/30 text-red-300 cursor-not-allowed opacity-60"
              : "bg-white/10 hover:bg-white/20 border-white/10"
          }`}
        >
          <IoCloudUploadOutline className="text-xl" />
          Subir PDF
        </button>
      </div>

      {/* LISTA PDFs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeUp">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            onClick={() => navigate(`/app/presenter/${pdf.id}`)}
            className="cursor-pointer group"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden 
                            shadow-lg backdrop-blur-xl transition group-hover:scale-[1.02]
                            group-hover:shadow-indigo-500/30">

              <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                {thumbnails[pdf.id] ? (
                  <img
                    src={thumbnails[pdf.id]}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    Cargando miniatura...
                  </span>
                )}
              </div>

              <div className="p-4">
                <strong className="text-lg">
                  {pdf.name.replace(/\.pdf$/i, "")}
                </strong>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(pdf.created_at).toLocaleDateString("es-MX")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ⭐ MODAL PREMIUM CENTRADO Y ELEGANTE ⭐ */}
      <dialog
        id="premiumModal"
        className="
          rounded-2xl p-8 w-[90%] max-w-md 
          bg-[#0F172A]/80 backdrop-blur-2xl 
          border border-white/10 text-white 
          mx-auto
        "
      >
        <h2 className="text-2xl font-bold mb-3 text-center">
          Límite alcanzado 🚫
        </h2>

        <p className="text-gray-300 text-center mb-6">
          Ya usaste tus <b>{MAX_FREE_FILES}</b> presentaciones gratuitas.
          <br />
          Suscríbete para subir archivos ilimitados.
        </p>

        <button
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
          onClick={() => navigate("/pricing")}
        >
          Ver planes Premium
        </button>

        <button
          className="w-full text-gray-400 hover:text-gray-200 mt-4"
          onClick={() => document.getElementById("premiumModal").close()}
        >
          Cerrar
        </button>
      </dialog>
    </div>
  );
}

