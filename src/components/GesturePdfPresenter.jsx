// src/components/GesturePdfPresenter.jsx
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

const GesturePdfPresenter = forwardRef(function GesturePdfPresenter(props, ref) {
  const { pdfBase64 } = props;

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const fullscreenBtnRef = useRef(null);

  const lastSizeRef = useRef({ w: 0, h: 0 });

  const [ready, setReady] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [status, setStatus] = useState("Sube un PDF para empezar");

  /** ---------------------------
   *   Configurar PDF.js Worker
   * --------------------------- */
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    setReady(true);
  }, []);

  /** ---------------------------
   *   Cargar PDF desde Base64
   * --------------------------- */
  useEffect(() => {
    if (!pdfBase64) return;

    setStatus("Cargando PDF...");

    try {
      const clean = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      const bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));

      pdfjsLib.getDocument({ data: bytes }).promise.then((pdf) => {
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNum(1);
        renderPage(1);
      });
    } catch (err) {
      console.error("Error cargando PDF:", err);
      setStatus("Error cargando el PDF");
    }
  }, [pdfBase64]);

  /** ---------------------------
   *   Cálculo de escala
   * --------------------------- */
  const computeScale = async (page) => {
    const c = wrapRef.current;
    if (!c) return 1.5;

    const cw = c.clientWidth || 800;
    const ch = c.clientHeight || 600;

    const vp1 = page.getViewport({ scale: 1 });

    return Math.max(0.5, Math.min(cw / vp1.width, ch / vp1.height));
  };

  /** ---------------------------
   *   Renderizado de páginas
   * --------------------------- */
  const renderPage = useCallback(
    async (n) => {
      if (!pdfDoc || !canvasRef.current) return;

      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
          await renderTaskRef.current.promise;
        } catch {}
      }

      setRendering(true);
      setStatus(`Renderizando página ${n}...`);

      try {
        const page = await pdfDoc.getPage(n);
        const scale = await computeScale(page);

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;

        await task.promise;
        renderTaskRef.current = null;

        lastSizeRef.current = {
          w: wrapRef.current?.clientWidth || 0,
          h: wrapRef.current?.clientHeight || 0,
        };

        setStatus(`Página ${n} / ${numPages}`);
      } catch (err) {
        console.error("Error renderizando:", err);
        setStatus("No se pudo renderizar la página");
      } finally {
        setRendering(false);
      }
    },
    [pdfDoc, numPages]
  );

  /** ---------------------------
   *   Resize Observer / Fullscreen
   * --------------------------- */
  useEffect(() => {
    if (!pdfDoc) return;

    let t = null;

    const maybeRerender = () => {
      if (!wrapRef.current) return;

      const w = wrapRef.current.clientWidth || 0;
      const h = wrapRef.current.clientHeight || 0;
      const { w: lw, h: lh } = lastSizeRef.current;

      if (Math.abs(w - lw) < 2 && Math.abs(h - lh) < 2) return;

      clearTimeout(t);
      t = setTimeout(() => {
        if (!rendering) renderPage(pageNum);
      }, 200);
    };

    const ro = new ResizeObserver(maybeRerender);
    ro.observe(wrapRef.current);

    window.addEventListener("resize", maybeRerender);
    document.addEventListener("fullscreenchange", maybeRerender);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener("resize", maybeRerender);
      document.removeEventListener("fullscreenchange", maybeRerender);
    };
  }, [pdfDoc, pageNum, rendering, renderPage]);

  /** ---------------------------
   *  Métodos expuestos al padre
   * --------------------------- */
  useImperativeHandle(
    ref,
    () => ({
      nextPage: () => {
        if (!pdfDoc) return;
        const n = Math.min(pageNum + 1, numPages);
        setPageNum(n);
        renderPage(n);
      },
      prevPage: () => {
        if (!pdfDoc) return;
        const n = Math.max(pageNum - 1, 1);
        setPageNum(n);
        renderPage(n);
      },

      /** FIX FULLSCREEN: usar botón oculto */
      toggleFullscreen: () => {
        fullscreenBtnRef.current?.click();
      },
    }),
    [pageNum, numPages, pdfDoc, renderPage]
  );

  /** ---------------------------
   *  Render UI
   * --------------------------- */
return (
  <section className="w-full h-full">
    {/* Botón oculto fullscreen */}
    <button
      ref={fullscreenBtnRef}
      style={{ display: "none" }}
      onClick={() => {
        const el = wrapRef.current;
        if (!el) return;
        if (!document.fullscreenElement) el.requestFullscreen?.();
        else document.exitFullscreen?.();
      }}
    />

    {/* Contenedor responsive */}
    <div
      ref={wrapRef}
      className="
        w-full h-full 
        flex items-center justify-center 
        overflow-hidden             /* ⬅ evita desbordamientos */
        bg-black/20 rounded-xl
      "
    >
      <canvas
        ref={canvasRef}
        className="
          max-w-full max-h-full     /* ⬅ canvas JAMÁS más grande que el contenedor */
          object-contain            /* ⬅ mantiene proporción */
          block mx-auto
        "
      />
    </div>

    <p className="text-center text-gray-400 mt-2">{status}</p>
  </section>
);

});

export default GesturePdfPresenter;

