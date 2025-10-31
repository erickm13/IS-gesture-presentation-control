import React, { useRef } from "react";
import GesturePdfPresenter from "./components/GesturePdfPresenter.jsx";
import HandController from "./components/HandController.jsx";

export default function App() {
  const presenterRef = useRef(null);

  return (
    <div className="app">
      <header>
        <h1>Gestures PDF Presenter</h1>
        <p className="status">
          Controla un PDF con gestos de la mano (webcam).
        </p>
      </header>

      <main className="grid">
        <GesturePdfPresenter ref={presenterRef} />
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
