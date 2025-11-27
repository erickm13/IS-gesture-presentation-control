import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuPresentation } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { auth } from "../firebase/config";
import * as pdfjsLib from "pdfjs-dist";


export default function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
  const [thumbnails, setThumbnails] = useState({});
  const navigate = useNavigate();


  // ==== GENERAR MINIATURA ====
  const generateThumbnail = async (base64, id) => {
    try {
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        useWorkerFetch: false,
        isEvalSupported: false,
        disableFontFace: true,
      });

      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const imgURL = canvas.toDataURL("image/jpeg", 0.7);

      setThumbnails((prev) => ({ ...prev, [id]: imgURL }));
    } catch (err) {
      console.error("ERROR generando miniatura:", err);
    }
  };


  // ==== CARGAR PDFs ====
  useEffect(() => {
    const loadPDFs = async () => {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .eq("user_id", auth.currentUser.uid);

      if (error) {
        console.error("Error cargando PDFs:", error);
        return;
      }

      setPdfs(data);

      data.forEach((pdf) => {
        if (pdf.pdf_content) generateThumbnail(pdf.pdf_content, pdf.id);
      });
    };

    loadPDFs();
  }, []);


  // ==== SUBIR PDF ====
  const handlePdfUpload = async (e) => {
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

      if (error) {
        alert("Error al subir PDF");
      } else {
        window.location.reload();
      }
    };

    reader.readAsDataURL(file);
  };


  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6
                    bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_70%)]">

      {/* === HEADER === */}
      <div className="flex justify-between items-center mb-10 animate-fadeUp">
        <h1 className="text-4xl font-bold">Mis Presentaciones</h1>

        <button
          onClick={() => navigate("/app/presenter")}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 
                     rounded-xl shadow-lg shadow-indigo-500/30 transition"
        >
          <LuPresentation className="text-xl" />
          Modo Presentación
        </button>
      </div>


      {/* === BOTONES === */}
      <div className="flex gap-4 items-center mb-8 animate-fadeUp">
        <input
          type="file"
          id="pdfInput"
          accept="application/pdf"
          className="hidden"
          onChange={handlePdfUpload}
        />

        <button
          onClick={() => document.getElementById("pdfInput").click()}
          className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20
                     rounded-xl border border-white/10 backdrop-blur-lg transition"
        >
          <IoCloudUploadOutline className="text-xl" />
          Subir PDF
        </button>
      </div>


      {/* === LISTA DE PDFs === */}
      {pdfs.length === 0 && (
        <p className="text-gray-400 text-center mt-20">Aún no tienes presentaciones</p>
      )}

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
              
              {/* Miniatura */}
              <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                {thumbnails[pdf.id] ? (
                  <img
                    src={thumbnails[pdf.id]}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Cargando miniatura...</span>
                )}
              </div>

              <div className="p-4">
                <strong className="text-lg">{pdf.name}</strong>
                <p className="text-gray-400 text-sm mt-1">{pdf.created_at}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

