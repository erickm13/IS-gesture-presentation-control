import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

/** Ajustes */
const MIRROR_PREVIEW = true;
const COOLDOWN_MS = 900;
const STABLE_FRAMES = 4;
const MIN_VELOCITY = 0.008;
const MIN_FRAMES_SPEED = 5;

export default function HandController({
  onSwipeLeft,
  onSwipeRight,
  onToggleFullscreen,

  gesturesEnabled,   // 🔥 Nuevo
  cameraEnabled,     // 🔥 Nuevo
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [debug, setDebug] = useState("Inicializando…");

  const speedQueueRef = useRef([]);
  const lastTriggerAtRef = useRef(0);

  const lastCountRef = useRef(null);
  const stableCountFramesRef = useRef(0);

  let handsInstance = useRef(null);
  let cameraInstance = useRef(null);

  /** ===== Conteo de dedos ===== */
  const countFingers = (lms, handed) => {
    const tips = [4, 8, 12, 16, 20];
    const pips = [3, 6, 10, 14, 18];

    const isRight = handed === "Right";
    const up = [false, false, false, false, false];

    // Otros 4 dedos
    for (let i = 1; i < 5; i++) {
      const t = lms[tips[i]],
        p = lms[pips[i]];
      up[i] = t.y < p.y - 0.02;
    }

    // Puño (ignorar pulgar)
    const othersUp = up.slice(1).filter(Boolean).length;
    if (othersUp === 0) return 0;

    // Pulgar
    const t = lms[4],
      p = lms[3];
    if (isRight) up[0] = t.x < p.x - 0.03 || t.y < p.y - 0.04;
    else up[0] = t.x > p.x + 0.03 || t.y < p.y - 0.04;

    return up.filter(Boolean).length;
  };

  /** ===== Dibujo ===== */
  const drawOverlay = (landmarks) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0, 255, 180, 0.9)";
    ctx.fillStyle = "rgba(0, 255, 180, 0.9)";

    if (!landmarks) return;

    const CHAINS = [
      [0, 1, 2, 3, 4],
      [0, 5, 6, 7, 8],
      [5, 9, 10, 11, 12],
      [9, 13, 14, 15, 16],
      [13, 17, 18, 19, 20],
    ];

    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    if (MIRROR_PREVIEW) {
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
    }

    for (const chain of CHAINS) {
      ctx.beginPath();
      chain.forEach((id, i) => {
        const lm = landmarks[id];
        const x = lm.x * W;
        const y = lm.y * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    for (const lm of landmarks) {
      ctx.beginPath();
      ctx.arc(lm.x * W, lm.y * H, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  /** ===== Procesar gestos ===== */
  const processGestures = (lms, handed) => {
    if (!gesturesEnabled) {
      setDebug("Gestos desactivados");
      return;
    }

    /** --- Swipe por velocidad --- */
    const q = speedQueueRef.current;

    let dxAvg = 0;
    const wristX = lms[0].x;
    q.push(wristX);

    if (q.length > 10) q.shift();

    if (q.length >= MIN_FRAMES_SPEED) {
      dxAvg = (q[q.length - 1] - q[0]) / (q.length - 1);
      if (MIRROR_PREVIEW) dxAvg = -dxAvg;
    }

    const now = Date.now();

    if (
      Math.abs(dxAvg) >= MIN_VELOCITY &&
      now - lastTriggerAtRef.current >= COOLDOWN_MS
    ) {
      lastTriggerAtRef.current = now;

      if (dxAvg > 0) {
        setDebug(`👉 Swipe derecha`);
        onSwipeRight?.();
      } else {
        setDebug(`👈 Swipe izquierda`);
        onSwipeLeft?.();
      }

      q.length = 0;
      lastCountRef.current = null;
      stableCountFramesRef.current = 0;
      return;
    }

    /** --- Conteo de dedos estable --- */
    const count = countFingers(lms, handed);

    if (lastCountRef.current === count) {
      stableCountFramesRef.current++;
    } else {
      lastCountRef.current = count;
      stableCountFramesRef.current = 1;
    }

    setDebug(`Dedos: ${count} (${stableCountFramesRef.current}/${STABLE_FRAMES})`);

    if (
      stableCountFramesRef.current >= STABLE_FRAMES &&
      now - lastTriggerAtRef.current >= COOLDOWN_MS
    ) {
      lastTriggerAtRef.current = now;

      if (count === 1) onSwipeRight?.();
      else if (count === 2) onSwipeLeft?.();
      else if (count === 5) onToggleFullscreen?.();

      stableCountFramesRef.current = 0;
    }
  };

  /** ===== Main MediaPipe Setup ===== */
  useEffect(() => {
    if (!cameraEnabled) {
      setDebug("Cámara apagada");
      try {
        cameraInstance.current?.stop();
      } catch {}
      return;
    }

    let hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    handsInstance.current = hands;

    hands.onResults((res) => {
      if (!res.multiHandLandmarks || res.multiHandLandmarks.length === 0) {
        drawOverlay(null);
        setDebug("Sin mano");
        speedQueueRef.current = [];
        lastCountRef.current = null;
        stableCountFramesRef.current = 0;
        return;
      }

      const lms = res.multiHandLandmarks[0];
      const handed = res.multiHandedness?.[0]?.label || "Right";

      drawOverlay(lms);
      processGestures(lms, handed);
    });

    const video = videoRef.current;
    if (MIRROR_PREVIEW) video.style.transform = "scaleX(-1)";

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    cameraInstance.current = camera;

    camera.start().then(() => {
      setReady(true);
      setDebug("Mano lista");
    });

    return () => {
      try {
        camera.stop();
      } catch {}
      try {
        hands.close();
      } catch {}
    };
  }, [cameraEnabled, gesturesEnabled]);

  return (
    <section>
{/* Video + Canvas o fondo “Cámara desactivada” */}
{cameraEnabled ? (
  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-lg">
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      playsInline
      muted
    />
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  </div>
) : (
  <div
    className="
      w-full h-[280px] rounded-2xl 
      flex items-center justify-center 
      bg-black/40 border border-white/10
      text-gray-400 text-sm
    "
  >
    Cámara desactivada
  </div>
)}


      <div className="mt-3 p-3 bg-black/30 border border-white/10 rounded-xl text-gray-300 text-sm">
        <b className="text-white">Estado:</b> {debug}
      </div>
    </section>
  );
}

