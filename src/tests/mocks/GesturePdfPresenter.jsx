export default function GesturePdfPresenter({ prevPage, nextPage, toggleFullscreen }) {
  return (
    <div>
      <button onClick={prevPage}>Anterior</button>
      <button onClick={nextPage}>Siguiente</button>
      <button onClick={toggleFullscreen}>Pantalla completa</button>
    </div>
  );
}

