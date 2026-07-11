import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { useHeroPaginated } from "@/heroes/hooks/useHeroPaginated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock("@/heroes/hooks/useHeroPaginated");

const mockUseHeroPaginated = vi.mocked(useHeroPaginated);

mockUseHeroPaginated.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
} as unknown as ReturnType<typeof mockUseHeroPaginated>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render HomePage with default values", () => {
    const { container } = renderHomePage();

    expect(container).toMatchSnapshot();
  });

  test("should call useHeroPaginated with default values", () => {
    renderHomePage();

    expect(mockUseHeroPaginated).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call useHeroPaginated with custom query params", () => {
    renderHomePage(["/?page=2&limit=10&category=villain"]);

    expect(mockUseHeroPaginated).toHaveBeenCalledWith(2, 10, "villain");
  });

  test("should called useHeroPaginated with default page and same limit on tab clicked", () => {
    renderHomePage(["/?tab=favorites&page=2&limit=10"]);

    const [, , , villainsTab] = screen.getAllByRole("tab");

    fireEvent.click(villainsTab);

    expect(mockUseHeroPaginated).toHaveBeenCalledWith(1, 10, "villain");
  });
});
