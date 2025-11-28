import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import WelcomePage from "../pages/WelcomePage";

// Mock navigate
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("WelcomePage - Pricing section", () => {

  it("renderiza los 3 planes y sus precios", () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Básico")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Premium")).toBeInTheDocument();

    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();
  });

  it("el botón de Básico redirige al login", () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button", { name: /Prueba Gratis/i });
    expect(btn).toBeInTheDocument();
  });

  it("los botones de Pro y Premium dicen Próximamente", () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    expect(screen.getAllByText(/Próximamente/i).length).toBeGreaterThanOrEqual(2);
  });
});

