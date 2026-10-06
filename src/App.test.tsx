import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

const stored = (key: string) =>
  JSON.parse(localStorage.getItem(`paginas_cenas_${key}`) ?? "null");

function cardFor(title: string) {
  const card = screen
    .getAllByText(title)
    .find((el) => el.classList.contains("p-item-title"))
    ?.closest(".p-item-card");
  if (!(card instanceof HTMLElement)) throw new Error(`card ${title} missing`);
  return within(card);
}

describe("App", () => {
  it("clamps quick progress to the total and marks the item as done", async () => {
    const user = userEvent.setup();
    render(<App />);
    // Berserk começa em 305 de 364
    const card = cardFor("Berserk");
    for (let i = 0; i < 6; i++) {
      await user.click(card.getByRole("button", { name: "+10" }));
    }
    const berserk = stored("items").find(
      (i: { title: string }) => i.title === "Berserk",
    );
    expect(berserk).toMatchObject({ progress: 364, status: "done" });
  });

  it("removes moments, sessions and connections with a deleted item", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      cardFor("Berserk").getByRole("button", { name: "ajustar" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Excluir Obra Permanentemente" }),
    );

    const id = 1;
    expect(stored("items").some((i: { id: number }) => i.id === id)).toBe(
      false,
    );
    for (const key of ["moments", "sessions"]) {
      expect(stored(key).some((x: { itemId: number }) => x.itemId === id)).toBe(
        false,
      );
    }
    expect(
      stored("connections").some(
        (c: { fromId: number; toId: number }) =>
          c.fromId === id || c.toId === id,
      ),
    ).toBe(false);
    expect(screen.queryByText("última sessão")).not.toBeInTheDocument();
  });

  it("records a session with its date without rewriting progress", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("button", { name: "+ Registrar Sessão" }),
    );
    const dialog = within(screen.getByRole("dialog"));
    await user.click(dialog.getByRole("button", { name: /calmo/ }));
    await user.click(dialog.getByRole("button", { name: "no metrô" }));
    await user.click(dialog.getByRole("button", { name: "salvar sessão" }));

    const sessions = stored("sessions");
    const last = sessions[sessions.length - 1];
    expect(last).toMatchObject({ itemId: 1, mood: "calmo", ctx: "no metrô" });
    expect(Date.parse(last.createdAt)).not.toBeNaN();
    // Progresso não mudou, então o item não deve ser regravado
    expect(stored("items")[0]).toMatchObject({ progress: 305 });
  });
});
