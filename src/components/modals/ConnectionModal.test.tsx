import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { INIT_ITEMS } from "../../constants";
import ConnectionModal from "./ConnectionModal";

// INIT_ITEMS[0] e [1] são Berserk (1) e O Senhor dos Anéis (2)
function renderModal(
  connections = [] as {
    id: string;
    fromId: number;
    toId: number;
    reason: string;
  }[],
) {
  const onSave = vi.fn();
  render(
    <ConnectionModal
      items={INIT_ITEMS}
      connections={connections}
      onSave={onSave}
      onClose={vi.fn()}
    />,
  );
  return onSave;
}

describe("ConnectionModal", () => {
  it("saves a new connection with a trimmed reason", async () => {
    const user = userEvent.setup();
    const onSave = renderModal();
    await user.type(screen.getByRole("textbox"), "  fantasia sombria  ");
    await user.click(screen.getByRole("button", { name: "Criar Conexão" }));
    expect(onSave).toHaveBeenCalledWith({
      fromId: 1,
      toId: 2,
      reason: "fantasia sombria",
    });
  });

  it("blocks a connection that already exists in the other direction", async () => {
    const user = userEvent.setup();
    renderModal([{ id: "c1", fromId: 2, toId: 1, reason: "x" }]);
    await user.type(screen.getByRole("textbox"), "de novo");
    expect(screen.getByRole("alert")).toHaveTextContent("já estão conectadas");
    expect(
      screen.getByRole("button", { name: "Criar Conexão" }),
    ).toBeDisabled();
  });
});
