import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import PrincipalProject from "../pages/PrincipalProject";

// mock usuario
vi.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: { uid: "user123" },
  }),
}));

// mock supabase
vi.mock("../supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [
            {
              id: "pdf1",
              user_id: "user123",
              name: "presentación 1.pdf",
              created_at: "2024-01-01",
              url: "https://example.com/p1.pdf",
            },
          ],
          error: null,
        }),
      }),
    }),
  },
}));

describe("Dashboard → Presenter integración", () => {
  it("redirige al presenter al hacer click en una presentación", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* LA RUTA QUE FALTABA */}
          <Route path="/app/presenter/:id" element={<PrincipalProject />} />
        </Routes>
      </MemoryRouter>
    );

    // espera que cargue el pdf
    const item = await screen.findByText(/presentación 1/i);
    expect(item).toBeInTheDocument();

    fireEvent.click(item);

    // texto que tiene tu PrincipalProject
   expect(await screen.findByText(/gesture pdf presenter/i)).toBeInTheDocument();

  });
});

