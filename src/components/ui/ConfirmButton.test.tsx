import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ConfirmButton from "./ConfirmButton";

describe("ConfirmButton", () => {
  it("only confirms on the second click", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmButton className="x" onConfirm={onConfirm}>
        excluir
      </ConfirmButton>,
    );
    await user.click(screen.getByRole("button", { name: "excluir" }));
    expect(onConfirm).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "confirmar?" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("disarms when it loses focus", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ConfirmButton className="x" onConfirm={vi.fn()}>
          excluir
        </ConfirmButton>
        <button>outro</button>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "excluir" }));
    await user.click(screen.getByRole("button", { name: "outro" }));
    expect(screen.getByRole("button", { name: "excluir" })).toBeInTheDocument();
  });

  it("disarms after a few seconds", () => {
    vi.useFakeTimers();
    try {
      render(
        <ConfirmButton className="x" onConfirm={vi.fn()}>
          excluir
        </ConfirmButton>,
      );
      act(() => screen.getByRole("button", { name: "excluir" }).click());
      expect(screen.getByRole("button", { name: "confirmar?" })).toBeTruthy();
      act(() => vi.advanceTimersByTime(4000));
      expect(screen.getByRole("button", { name: "excluir" })).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
});
