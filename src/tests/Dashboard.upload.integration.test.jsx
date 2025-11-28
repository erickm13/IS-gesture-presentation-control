import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { MemoryRouter } from "react-router-dom";

vi.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: { uid: "TEST_USER_123" },
  }),
}));

// === MOCK SUPABASE CORREGIDO ===
let mockDB = [];

vi.mock("../supabaseClient", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: async () => ({
          data: mockDB,
          error: null,
        }),
      }),

      insert: async ({ pdf_content }) => {
        const newItem = {
          id: Date.now().toString(),
          name: "presentación demo.pdf",
          created_at: new Date().toISOString(),
          pdf_content,
        };

        mockDB.push(newItem);

        return { data: [newItem], error: null };
      },
    }),
  },
}));

// Mock FileReader
class MockFileReader {
  readAsDataURL() {
    this.result = "data:application/pdf;base64,TESTBASE64";
    this.onload();
  }
}
global.FileReader = MockFileReader;

describe("Dashboard - integración de subida de PDF", () => {
  it("sube un PDF y lo muestra en la lista", async () => {
    mockDB = []; // limpiar BD

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const input = screen.getByTestId("pdf-upload-input");
    const file = new File(["dummy"], "test.pdf", { type: "application/pdf" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() =>
      expect(screen.getByText(/presentación/i)).toBeInTheDocument()
    );
  });
});

