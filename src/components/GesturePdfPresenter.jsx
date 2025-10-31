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

const GesturePdfPresenter = forwardRef(function GesturePdfPresenter(_, ref) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const lastSizeRef = useRef({ w: 0, h: 0 });

  const [ready, setReady] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [rendering, setRendering] = useState(false);
  const [status, setStatus] = useState("Sube un PDF para empezar");

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    setReady(true);
  }, []);

  const computeScale = async (page) => {
    const c = wrapRef.current;
    if (!c) return 1.5;
    const cw = c.clientWidth || 800;
    const ch = c.clientHeight || 600;
    const vp1 = page.getViewport({ scale: 1 });
    return Math.max(0.5, Math.min(cw / vp1.width, ch / vp1.height));
  };

  const renderPage = useCallback(
    async (n) => {
      if (!pdfDoc || !canvasRef.current) return;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
        try {
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
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const task = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
        renderTaskRef.current = null;
        if (wrapRef.current) {
          lastSizeRef.current = {
            w: wrapRef.current.clientWidth || 0,
            h: wrapRef.current.clientHeight || 0,
          };
        }
        setStatus(`Página ${n} / ${numPages}`);
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Error renderizando página:", err);
          setStatus("No se pudo renderizar la página (ver consola)");
        }
      } finally {
        setRendering(false);
      }
    },
    [pdfDoc, numPages],
  );

  const onFile = async (file) => {
    if (!file) return;
    setStatus("Cargando PDF...");
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setPageNum(1);
      await renderPage(1);
    } catch (e) {
      console.error(e);
      setStatus("No se pudo abrir el PDF (¿protegido?)");
    }
  };

  const loadDemo = async () => {
    setStatus("Descargando demo...");
    const res = await fetch(
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    );
    const buf = await res.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    setPdfDoc(pdf);
    setNumPages(pdf.numPages);
    setPageNum(1);
    await renderPage(1);
  };

  const prevPage = useCallback(() => {
    if (!pdfDoc || rendering) return;
    setPageNum((p) => {
      const n = Math.max(p - 1, 1);
      if (n !== p) renderPage(n);
      return n;
    });
  }, [pdfDoc, rendering, renderPage]);

  const nextPage = useCallback(() => {
    if (!pdfDoc || rendering) return;
    setPageNum((p) => {
      const n = Math.min(p + 1, numPages);
      if (n !== p) renderPage(n);
      return n;
    });
  }, [pdfDoc, rendering, numPages, renderPage]);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

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
      }, 220);
    };
    window.addEventListener("resize", maybeRerender);
    document.addEventListener("fullscreenchange", maybeRerender);
    const ro = new ResizeObserver(maybeRerender);
    if (wrapRef.current) {
      ro.observe(wrapRef.current);
      lastSizeRef.current = {
        w: wrapRef.current.clientWidth || 0,
        h: wrapRef.current.clientHeight || 0,
      };
    }
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", maybeRerender);
      document.removeEventListener("fullscreenchange", maybeRerender);
      ro.disconnect();
    };
  }, [pdfDoc, pageNum, renderPage, rendering]);

  // ✨ Exponer métodos al padre (para HandController)
  useImperativeHandle(
    ref,
    () => ({
      nextPage,
      prevPage,
      toggleFullscreen,
    }),
    [nextPage, prevPage],
  );

  return (
    <section className="card">
      <div className="toolbar">
        <label className="upload">
          <input
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            disabled={!ready || rendering}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {rendering
            ? "Renderizando..."
            : ready
              ? "Subir PDF"
              : "Inicializando..."}
        </label>
        <button onClick={prevPage} disabled={!pdfDoc || rendering}>
          ⟵ Anterior
        </button>
        <button onClick={nextPage} disabled={!pdfDoc || rendering}>
          Siguiente ⟶
        </button>
        <button onClick={toggleFullscreen} disabled={!pdfDoc}>
          Pantalla completa
        </button>
        <button onClick={loadDemo} disabled={!ready || rendering}>
          Cargar demo
        </button>
      </div>

      <div ref={wrapRef} className="canvas-wrap" style={{ marginTop: 12 }}>
        <canvas ref={canvasRef} />
      </div>

      <p className="status" style={{ marginTop: 8 }}>
        {status}
      </p>
    </section>
  );
});

export default GesturePdfPresenter;
