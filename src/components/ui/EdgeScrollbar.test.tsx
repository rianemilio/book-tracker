import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EdgeScrollbar from "./EdgeScrollbar";

// jsdom não calcula layout: simula uma página 4x mais alta que a janela
function mockPage(scrollHeight: number, scrollY = 0) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
}

function renderBar() {
  const { container } = render(<EdgeScrollbar />);
  const bar = container.querySelector<HTMLElement>(".p-edge-scroll")!;
  const thumb = container.querySelector<HTMLElement>(".p-edge-scroll-thumb")!;
  return { bar, thumb };
}

describe("EdgeScrollbar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.innerWidth = 1000;
    window.innerHeight = 500;
    mockPage(2000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays hidden until the mouse reaches the right edge", () => {
    const { bar } = renderBar();
    expect(bar).not.toHaveClass("is-visible");

    fireEvent.mouseMove(window, { clientX: 500 });
    expect(bar).not.toHaveClass("is-visible");

    fireEvent.mouseMove(window, { clientX: 990 });
    expect(bar).toHaveClass("is-visible");
  });

  it("hides again shortly after the mouse leaves the edge", () => {
    const { bar } = renderBar();
    fireEvent.mouseMove(window, { clientX: 990 });
    fireEvent.mouseMove(window, { clientX: 500 });
    expect(bar).toHaveClass("is-visible");

    act(() => vi.advanceTimersByTime(600));
    expect(bar).not.toHaveClass("is-visible");
  });

  it("sizes and positions the thumb from the scroll position", () => {
    const { bar, thumb } = renderBar();
    mockPage(2000, 750); // metade do caminho: (2000 - 500) / 2
    fireEvent.scroll(window);

    expect(bar.dataset.scrollable).toBe("true");
    // altura = 500 * 500 / 2000 = 125; topo = 0.5 * (500 - 125)
    expect(thumb.style.height).toBe("125px");
    expect(thumb.style.transform).toBe("translateY(187.5px)");
  });

  it("marks the page as not scrollable when content fits", () => {
    const { bar } = renderBar();
    mockPage(400);
    fireEvent(window, new Event("resize"));
    expect(bar.dataset.scrollable).toBe("false");
  });
});
