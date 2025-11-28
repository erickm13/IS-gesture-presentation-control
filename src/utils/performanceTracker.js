export function startTimer() {
  return performance.now();
}

export function endTimer(start) {
  return performance.now() - start; // return ms
}

// Estimar FPS por 1 segundo
export function measureFPS() {
  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();

    function loop() {
      frames++;
      const now = performance.now();
      if (now - start >= 1000) {
        resolve(frames);
        return;
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  });
}

