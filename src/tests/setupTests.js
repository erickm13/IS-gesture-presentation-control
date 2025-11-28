import { vi } from "vitest";
import "@testing-library/jest-dom";

// ---- MOCK: getUserMedia ----
Object.defineProperty(global.navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({}),
  },
});


vi.mock("../supabaseClient", () => ({
  supabase: require("./mocks/supabaseClient").supabase,
}));



// ---- MOCK: Camera Utils (Mediapipe) ----
vi.mock("@mediapipe/camera_utils", () => {
  return {
    Camera: class {
      constructor() {}
      start() {
        return Promise.resolve();
      }
    },
  };
});

// ---- MOCK: Supabase ----
vi.mock("../supabaseClient", () => {
  return {
    supabase: {
      auth: {
        currentUser: { uid: "test-user" },
      },

      from: () => ({
        select: () => ({
          eq: () => ({
            then: (cb) =>
              cb([
                {
                  id: 1,
                  title: "Presentación 1",
                },
              ]),
            single: () =>
              Promise.resolve({
                data: { pdf_content: "mock data" },
              }),
          }),
        }),
      }),
    },
  };
});

// Evita que pdfjs intente parsear PDFs reales durante tests
vi.mock("pdfjs-dist", () => ({
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: () => ({
        getViewport: () => ({ width: 100, height: 100 }),
        render: () => ({ promise: Promise.resolve() }),
      }),
    }),
  }),
}));

// mock global de pdfjs para evitar warnings
vi.mock("pdfjs-dist/legacy/build/pdf", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: () => ({
        getViewport: () => ({ width: 100, height: 100 }),
        render: () => ({ promise: Promise.resolve() }),
      }),
    }),
  }),
}));

process.on("unhandledRejection", () => {
  // ignoramos silenciosamente porque supabase está mockeado
});


// === MOCK DE CANVAS PARA ELIMINAR WARNINGS ===
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
}));

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,MOCK");



// ---- MOCK: Fullscreen ----
document.documentElement.requestFullscreen = vi.fn();
document.exitFullscreen = vi.fn();

