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


  const generateThumbnail = async (base64, id) => {
    try {
      console.log("Generando miniatura para id:", id);

      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Cargar PDF sin worker
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

  useEffect(() => {
    const loadPDFs = async () => {
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .eq("user_id", auth.currentUser.uid)

      console.log("DATA Supabase:", data);
      console.log("ERROR Supabase:", error);
      console.log("UID Firebase:", auth.currentUser?.uid);

      if (error) {
        console.error("Error cargando PDFs:", error);
        return;
      }

      setPdfs(data);

      // generar miniaturas
      data.forEach((pdf) => {
        if (pdf.pdf_content) {
          generateThumbnail(pdf.pdf_content, pdf.id);
        }
      });
    };

    loadPDFs();
  }, []);


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
        console.error("Error guardando PDF:", error);
        alert("Error al subir PDF");
      } else {
        alert("PDF subido correctamente");
        window.location.reload();
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>Mis Presentaciones</h2>

      <input
        type="file"
        id="pdfInput"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handlePdfUpload}
      />

      <button onClick={() => document.getElementById("pdfInput").click()}>
        <IoCloudUploadOutline /> Cargar PDF
      </button>

      <button onClick={() => navigate("/app/presenter")}>
        <LuPresentation /> Ver presentación de prueba
      </button>

      {pdfs.length === 0 && <p>No hay PDFs aún</p>}

      <div className="pdf-grid">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="pdf-item"
            onClick={() => navigate(`/app/presenter/${pdf.id}`)}
          >
            <img
              src={thumbnails[pdf.id]}
              alt="thumbnail"
              className="pdf-thumb"
              style={{
                width: "160px",
                height: "auto",
                background: "#eee",
                borderRadius: "8px",
              }}
            />

            <strong>{pdf.name}</strong>
            <p>{pdf.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
