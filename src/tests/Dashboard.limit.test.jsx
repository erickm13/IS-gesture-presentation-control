import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

// 🔧 Mock de Supabase (simula datos del usuario)
vi.mock("../supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
data: Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Presentación ${i + 1}`,
  pdf_content: "base64mock",
  created_at: new Date().toISOString(),
})),

          error: null,
        }),
      }),
    }),
  },
}));

// 🔧 Mock de Firebase Auth
vi.mock("../firebase/config", () => ({
  auth: {
    currentUser: { uid: "user123" },
  },
}));

describe("Dashboard - límite gratuito", () => {
  it("muestra el mensaje de límite alcanzado", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText((content) =>
          content.includes("Límite gratuito alcanzado")
        )
      ).toBeInTheDocument()
    );
  });

  it("al intentar subir un PDF abre modal premium", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Esperar a que cargue la presentación mockeada
    await waitFor(() => screen.getByText("Presentación 1"));

    const uploadBtn = screen.getByRole("button", { name: /subir pdf/i });

    fireEvent.click(uploadBtn);

    expect(
      await screen.findByText(/Ver planes Premium/i)
    ).toBeInTheDocument();
  });
});

