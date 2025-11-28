import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrincipalProject from "../pages/PrincipalProject";

vi.mock("../supabaseClient", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({
      data: { pdf_content: "MOCKBASE64" },
      error: null,
    }),
    eq: vi.fn().mockReturnThis(),
  },
}));

describe("Presenter - aceptación del usuario", () => {
  it("muestra PDF y permite usar controles manuales", async () => {
    render(
      <MemoryRouter initialEntries={["/app/presenter/abc"]}>
        <PrincipalProject />
      </MemoryRouter>
    );

    await screen.findByText(/cargando/i);

    const btnNext = screen.getByText(/siguiente/i);
    fireEvent.click(btnNext);

    const btnPrev = screen.getByText(/anterior/i);
    fireEvent.click(btnPrev);

    expect(btnNext).toBeInTheDocument();
    expect(btnPrev).toBeInTheDocument();
  });
});

