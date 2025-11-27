import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { auth } from "../firebase/config";

// PDF.js (correcto para Vite)
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.js";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Dashboard() {
  const MAX_FREE_FILES = 5;

  const [pdfs, setPdfs] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const [limitReached, setLimitReached] = useState(false);

  // Control de modales
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);

  const navigate = useNavigate();

  /* ================================
        GENERAR MINIATURA
  ================================ */
  const generateThumbnail = async (base64, id) => {
    try {
      const cleanBase64 = base64.includes("base64,")
        ? base64.split("base64,")[1]
        : base64;

      const binary = atob(cleanBase64);
      const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));

      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });

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

  /* ================================
        CARGAR PDFs
  ================================ */
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

  /* ================================
        SUBIR PDF
  ================================ */
  const handlePdfUpload = async (e) => {
    if (limitReached) return setShowPremiumModal(true);

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

  /* ================================
        CONFIRMAR ELIMINACIÓN
  ================================ */
  const confirmDelete = (pdf) => {
    setPdfToDelete(pdf);
    setShowDeleteModal(true);
  };

  /* ================================
        ELIMINAR PDF
  ================================ */
  const deletePdf = async () => {
    if (!pdfToDelete) return;

    const { error } = await supabase
      .from("presentations")
      .delete()
      .eq("id", pdfToDelete.id)
      .eq("user_id", auth.currentUser.uid);

    if (error) {
      alert("Error eliminando: " + error.message);
      return;
    }

    setPdfs((prev) => prev.filter((p) => p.id !== pdfToDelete.id));
    setThumbnails((prev) => {
      const updated = { ...prev };
      delete updated[pdfToDelete.id];
      return updated;
    });

    setShowDeleteModal(false);
    setPdfToDelete(null);
  };

  /* ================================
        RENDER
  ================================ */
  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6
                    bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_70%)]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 animate-fadeUp">
        <h1 className="text-4xl font-bold">Mis Presentaciones</h1>

        {limitReached && (
          <span className="text-red-400 text-sm">
            Límite gratuito alcanzado ({MAX_FREE_FILES})
          </span>
        )}
      </div>

      {/* SUBIR PDF */}
      <div className="flex gap-4 items-center mb-8 animate-fadeUp">
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          className="hidden"
          onChange={handlePdfUpload}
        />

        <button
          onClick={() =>
            limitReached
              ? setShowPremiumModal(true)
              : document.getElementById("pdfInput").click()
          }
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-lg transition
            ${limitReached
              ? "bg-red-500/20 border-red-500/30 text-red-300 opacity-60 cursor-not-allowed"
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
          <div key={pdf.id} className="relative">
            
            {/* BOTÓN ELIMINAR */}
            <button
              onClick={() => confirmDelete(pdf)}
              className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-700 
                         text-white rounded-full z-20 shadow-lg transition"
            >
              <FaTrash className="text-sm" />
            </button>

            {/* CARD */}
            <div
              onClick={() => navigate(`/app/presenter/${pdf.id}`)}
              className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg
                         backdrop-blur-xl transition hover:scale-[1.02] hover:shadow-indigo-500/30 cursor-pointer"
            >
              <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                {thumbnails[pdf.id] ? (
                  <img src={thumbnails[pdf.id]} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Cargando miniatura...</span>
                )}
              </div>

              <div className="p-4">
                <strong className="text-lg">{pdf.name.replace(/\.pdf$/i, "")}</strong>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(pdf.created_at).toLocaleDateString("es-MX")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =============================
          MODAL PREMIUM
      ============================= */}
      {showPremiumModal && (
        <div
          onClick={() => setShowPremiumModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0F172A]/90 border border-white/10 rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-3">Límite alcanzado 🚫</h2>
            <p className="text-gray-300 mb-6">
              Ya usaste tus <b>{MAX_FREE_FILES}</b> presentaciones gratuitas.
            </p>

 <button
  className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
onClick={() => {
  navigate("/?scroll=pricing");
  setShowPremiumModal(false);
}}

>
  Ver planes Premium
</button>


            <button
              className="w-full text-gray-400 hover:text-gray-200 mt-4"
              onClick={() => setShowPremiumModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* =============================
          MODAL ELIMINAR
      ============================= */}
      {showDeleteModal && (
        <div
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1f2e]/90 border border-white/10 rounded-2xl p-8 w-[90%] max-w-sm text-center shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4">¿Eliminar presentación?</h2>

            <p className="text-gray-300 mb-6">
              Esta acción no se puede deshacer.
            </p>

            <button
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
              onClick={deletePdf}
            >
              Eliminar
            </button>

            <button
              className="w-full py-2 text-gray-400 hover:text-gray-200 mt-3"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

