// src/components/HandController.jsx
import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

/** Ajustes */
const MIRROR_PREVIEW = true; // espejo visual y corrección de dirección
const COOLDOWN_MS = 900; // anti-rebote entre gestos
const STABLE_FRAMES = 4; // frames consecutivos necesarios para “consolidar” el conteo
const MIN_VELOCITY = 0.008; // swipe sensibilidad (↓ = más sensible)
const MIN_FRAMES_SPEED = 5; // frames mínimos para calcular velocidad

export default function HandController({
  onSwipeLeft,
  onSwipeRight,
  onToggleFullscreen,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [debug, setDebug] = useState("Inicializando…");

  const speedQueueRef = useRef([]); // historial para velocidad X
  const lastTriggerAtRef = useRef(0); // timestamp último gesto disparado

  const lastCountRef = useRef(null); // último conteo de dedos observado
  const stableCountFramesRef = useRef(0); // cuántos frames seguidos llevamos con ese conteo

  /** ======= UTILIDADES DE DEDOS ======= */

  // Conteo de dedos. Clave: si los 4 dedos (índice, medio, anular, meñique) están “abajo”
  // forzamos puño=0, ignorando el pulgar (así, un puño rotado ya no cuenta 1 por el pulgar).
  const countFingers = (lms, handed) => {
    // IDs: pulgar(4), índice(8), medio(12), anular(16), meñique(20)
    // PIPs: pulgar(3), índice(6), medio(10), anular(14), meñique(18)
    const tips = [4, 8, 12, 16, 20];
    const pips = [3, 6, 10, 14, 18];

    const isRight = handed === "Right";
    const up = [false, false, false, false, false];

    // 1) Otros 4 dedos: tip.y < pip.y (con margen)
    for (let i = 1; i < 5; i++) {
      const t = lms[tips[i]],
        p = lms[pips[i]];
      up[i] = t.y < p.y - 0.02;
    }

    // Si los 4 están abajo, es PUÑO: devuelve 0 y ni evaluamos el pulgar
    const othersUp = up.slice(1).filter(Boolean).length;
    if (othersUp === 0) return 0;

    // 2) Pulgar: usa eje X según mano + un poco de eje Y para robustez
    const t = lms[4],
      p = lms[3];
    if (isRight) {
      up[0] = t.x < p.x - 0.03 || t.y < p.y - 0.04;
    } else {
      up[0] = t.x > p.x + 0.03 || t.y < p.y - 0.04;
    }

    return up.filter(Boolean).length;
  };

  /** ======= DIBUJO (overlay) ======= */
  const drawOverlay = (landmarks) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");

    // Ajusta tamaño del canvas al del video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0, 255, 180, 0.8)";
    ctx.fillStyle = "rgba(0, 255, 180, 0.8)";

    if (!landmarks) return;

    const CHAINS = [
      [0, 1, 2, 3, 4],
      [0, 5, 6, 7, 8],
      [5, 9, 10, 11, 12],
      [9, 13, 14, 15, 16],
      [13, 17, 18, 19, 20],
    ];
    const W = canvas.width,
      H = canvas.height;

    ctx.save();
    if (MIRROR_PREVIEW) {
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
    }

    for (const chain of CHAINS) {
      ctx.beginPath();
      for (let i = 0; i < chain.length; i++) {
        const lm = landmarks[chain[i]];
        const x = lm.x * W,
          y = lm.y * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (const lm of landmarks) {
      ctx.beginPath();
      ctx.arc(lm.x * W, lm.y * H, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  /** ======= LOOP DE RESULTADOS ======= */
  useEffect(() => {
    let hands = null;
    let camera = null;

    const onResults = (res) => {
      if (!res.multiHandLandmarks || res.multiHandLandmarks.length === 0) {
        speedQueueRef.current = [];
        drawOverlay(null);
        setDebug("Sin mano");
        // reinicia estabilizador
        lastCountRef.current = null;
        stableCountFramesRef.current = 0;
        return;
      }

      const lms = res.multiHandLandmarks[0];
      const handed = res.multiHandedness?.[0]?.label || "Right";

      drawOverlay(lms);

      /** ---- A) Swipe por velocidad horizontal (suave) ---- */
      const q = speedQueueRef.current;
      let dxAvg = 0;
      {
        const x = lms[0].x; // muñeca
        q.push(x);
        if (q.length > 10) q.shift();
        if (q.length >= MIN_FRAMES_SPEED) {
          dxAvg = (q[q.length - 1] - q[0]) / (q.length - 1); // +der, -izq
          if (MIRROR_PREVIEW) dxAvg = -dxAvg; // corrige espejo
        }
      }

      const now = Date.now();
      if (
        Math.abs(dxAvg) >= MIN_VELOCITY &&
        now - lastTriggerAtRef.current >= COOLDOWN_MS
      ) {
        lastTriggerAtRef.current = now;
        if (dxAvg > 0) {
          setDebug(`👉 Swipe (dx≈${dxAvg.toFixed(3)})`);
          onSwipeRight?.();
        } else {
          setDebug(`👈 Swipe (dx≈${dxAvg.toFixed(3)})`);
          onSwipeLeft?.();
        }
        q.length = 0; // limpia después de disparar
        // al disparar por swipe, resetea estabilizador de dedos
        lastCountRef.current = null;
        stableCountFramesRef.current = 0;
        return;
      }

      /** ---- B) Respaldo: conteo de dedos con estabilización ---- */
      const count = countFingers(lms, handed);

      if (lastCountRef.current === count) {
        stableCountFramesRef.current += 1;
      } else {
        lastCountRef.current = count;
        stableCountFramesRef.current = 1;
      }

      // Muestra estado
      setDebug(
        `Dedos: ${count} (${stableCountFramesRef.current}/${STABLE_FRAMES})`,
      );

      if (
        stableCountFramesRef.current >= STABLE_FRAMES &&
        now - lastTriggerAtRef.current >= COOLDOWN_MS
      ) {
        // Mapea dedos → acción
        if (count === 1) {
          lastTriggerAtRef.current = now;
          setDebug("☝️ 1 dedo → Siguiente");
          onSwipeRight?.();
          stableCountFramesRef.current = 0;
        } else if (count === 2) {
          lastTriggerAtRef.current = now;
          setDebug("✌️ 2 dedos → Anterior");
          onSwipeLeft?.();
          stableCountFramesRef.current = 0;
        } else if (count === 5) {
          lastTriggerAtRef.current = now;
          setDebug("✋ 5 dedos → Pantalla completa");
          onToggleFullscreen?.();
          stableCountFramesRef.current = 0;
        } else {
          // 0,3,4: no disparamos nada por defecto
        }
      }
    };

    const start = async () => {
      hands = new Hands({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });
      hands.onResults(onResults);

      const video = videoRef.current;
      if (MIRROR_PREVIEW) video.style.transform = "scaleX(-1)";

      camera = new Camera(video, {
        onFrame: async () => {
          await hands.send({ image: video });
        },
        width: 640,
        height: 480,
      });
      await camera.start();
      setReady(true);
      setDebug("Mano lista");
    };

    start();

    return () => {
      try {
        camera?.stop();
      } catch {}
      try {
        hands?.close();
      } catch {}
      speedQueueRef.current = [];
    };
  }, [onSwipeLeft, onSwipeRight, onToggleFullscreen]);

  return (
    <section className="card" style={{ position: "relative" }}>
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Cámara</h2>
        <span className="status">
          {ready ? "Gestos activos" : "Inicializando..."}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <video ref={videoRef} className="video" autoPlay playsInline muted />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>

      <div className="status" style={{ marginTop: 8 }}>
        <div>
          <b>Debug:</b> {debug}
        </div>
        <ul>
          <li>
            👉 Desliza la mano hacia la <b>derecha</b>: siguiente
          </li>
          <li>
            👈 Desliza la mano hacia la <b>izquierda</b>: anterior
          </li>
          <li>
            ☝️ 1 dedo: siguiente | ✌️ 2 dedos: anterior | ✋ 5 dedos: fullscreen
          </li>
        </ul>
      </div>
    </section>
  );
}
