import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrincipalProject from "../pages/PrincipalProject";

let prevPageMock;
let nextPageMock;
let fullscreenMock;

// MOCK DEL PRESENTADOR
vi.mock("../components/GesturePdfPresenter.jsx", () => ({
  default: React.forwardRef((props, ref) => {
    prevPageMock = vi.fn();
    nextPageMock = vi.fn();
    fullscreenMock = vi.fn();

    ref.current = {
      prevPage: prevPageMock,
      nextPage: nextPageMock,
      toggleFullscreen: fullscreenMock,
    };

    return <div>PDF MOCK</div>;
  }),
}));

function renderPage() {
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/app/project/123",
          state: { pdfData: { pdf_content: "TEST_BASE64" } },
        },
      ]}
    >
      <PrincipalProject />
    </MemoryRouter>
  );
}

describe("PrincipalProject – navegación del presenter", () => {
  test("botón Anterior llama prevPage()", async () => {
    renderPage();

    await screen.findByText("PDF MOCK");

    await act(async () => {
      fireEvent.click(screen.getByText(/Anterior/i));
    });

    expect(prevPageMock).toHaveBeenCalled();
  });

  test("botón Siguiente llama nextPage()", async () => {
    renderPage();

    await screen.findByText("PDF MOCK");

    await act(async () => {
      fireEvent.click(screen.getByText(/Siguiente/i));
    });

    expect(nextPageMock).toHaveBeenCalled();
  });

  test("botón Pantalla completa llama toggleFullscreen()", async () => {
    renderPage();

    await screen.findByText("PDF MOCK");

    await act(async () => {
      fireEvent.click(screen.getByText(/Pantalla completa/i));
    });

    expect(fullscreenMock).toHaveBeenCalled();
  });
});

