import React, { useImperativeHandle } from "react";
import { vi } from "vitest";

export const prevPageMock = vi.fn();
export const nextPageMock = vi.fn();
export const fullscreenMock = vi.fn();

const PresenterMock = React.forwardRef((props, ref) => {
  // Exponemos las funciones COMO LO HARÍA TU COMPONENTE REAL
  useImperativeHandle(ref, () => ({
    prevPage: prevPageMock,
    nextPage: nextPageMock,
    toggleFullscreen: fullscreenMock,
  }));

  return <div>Mocked Presenter</div>;
});

export default PresenterMock;

