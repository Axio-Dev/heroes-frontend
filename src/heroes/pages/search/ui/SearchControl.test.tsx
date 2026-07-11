import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SearchControls } from "./SearchControls";
import { MemoryRouter } from "react-router";

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
}

const renderSearchControlsWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>,
  );
};

describe("SearchControls", () => {
  test("should render SearchControls with default values", () => {
    const { container } = renderSearchControlsWithRouter();

    expect(container).toMatchSnapshot();
  });

  test("should set input value when search param name is set", () => {
    renderSearchControlsWithRouter(["/?name=Batman"]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );

    expect(input.getAttribute("value")).toBe("Batman");
  });

  test("should change params when input is changed and enter is pressed", () => {
    renderSearchControlsWithRouter(["/?name=Batman"]);
    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );
    expect(input.getAttribute("value")).toBe("Batman");

    fireEvent.change(input, { target: { value: "Superman" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.getAttribute("value")).toBe("Superman");
  });

  test("should change param strength when slider is changed", () => {
    renderSearchControlsWithRouter([
      "/?name=Batman&active-accordion=advance-filters",
    ]);
    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });

  test("should accordion be open when active-accordion param is set", () => {
    renderSearchControlsWithRouter([
      "/?name=Batman&active-accordion=advance-filters",
    ]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });

  test("should accordion be closed when active-accordion param is not set", () => {
    renderSearchControlsWithRouter(["/?name=Batmans"]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("closed");
  });
});
