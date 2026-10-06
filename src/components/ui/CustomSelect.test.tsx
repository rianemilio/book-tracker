import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CustomSelect from "./CustomSelect";

const options = [
  { value: "book", label: "Livro" },
  { value: "film", label: "Filme" },
  { value: "manga", label: "Mangá" },
];

describe("CustomSelect", () => {
  it("shows the selected option label", () => {
    render(<CustomSelect value="film" options={options} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Filme");
  });

  it("selects an option with the mouse", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CustomSelect value="book" options={options} onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Mangá" }));
    expect(onChange).toHaveBeenCalledWith("manga");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigates and selects with the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CustomSelect value="book" options={options} onChange={onChange} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("manga");
  });

  it("closes on Escape without propagating it", async () => {
    const user = userEvent.setup();
    const onDocumentKey = vi.fn();
    document.addEventListener("keydown", onDocumentKey);
    render(<CustomSelect value="book" options={options} onChange={vi.fn()} />);
    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onDocumentKey).not.toHaveBeenCalledWith(
      expect.objectContaining({ key: "Escape" }),
    );
    document.removeEventListener("keydown", onDocumentKey);
  });
});
