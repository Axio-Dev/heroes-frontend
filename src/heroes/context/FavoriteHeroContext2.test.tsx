import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "1",
  name: "Batman",
} as Hero; // Se pone as Hero para que en toggleFavorite react no se queje por los tipos faltantes

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      <button
        data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTestComponent = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialize with default values", () => {
    renderContextTestComponent();

    screen.debug();

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
  });

  test("should add hero to favorites when toggleFavorite is called", () => {
    renderContextTestComponent();
    const toggleFavoriteButton = screen.getByTestId("toggle-favorite");

    fireEvent.click(toggleFavoriteButton);

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("Batman");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      '[{"id":"1","name":"Batman"}]',
    );
  });

  test("should remove hero from favorites when toggleFavorite is called", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

    renderContextTestComponent();
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("Batman");

    const toggleFavoriteButton = screen.getByTestId("toggle-favorite");
    fireEvent.click(toggleFavoriteButton);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(screen.queryByTestId("hero-1")).toBeNull();

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith("favorites", "[]");
  });
});
