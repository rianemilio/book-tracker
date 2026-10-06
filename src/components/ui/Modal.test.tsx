import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Modal from "./Modal";

function renderModal(onClose = vi.fn()) {
  render(
    <Modal eyebrow="teste" title="Título" onClose={onClose}>
      <input aria-label="primeiro" />
      <button>último</button>
    </Modal>,
  );
  return onClose;
}

describe("Modal", () => {
  it("is exposed as a labelled dialog", () => {
    renderModal();
    expect(screen.getByRole("dialog", { name: "Título" })).toBeInTheDocument();
  });

  it("moves focus into the dialog on open", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("closes on Escape and on the close button", async () => {
    const user = userEvent.setup();
    const onClose = renderModal();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("keeps Tab focus inside the dialog", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.tab(); // Fechar
    await user.tab(); // primeiro
    await user.tab(); // último
    expect(screen.getByRole("button", { name: "último" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveFocus();
  });
});
