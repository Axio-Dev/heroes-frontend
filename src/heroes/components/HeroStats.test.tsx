import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { HeroStats } from "./HeroStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroSummary } from "../hooks/useHeroSummary";
import type { SummaryInformationResponse } from "../types/summary-information.response";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";
import { mockHero, mockSummaryData } from "../../mocks/heroes.mock";

vi.mock("../hooks/useHeroSummary");
const mockUseHeroSummary = vi.mocked(useHeroSummary);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderHeroStats = (mockData?: Partial<SummaryInformationResponse>) => {
  if (mockData) {
    mockUseHeroSummary.mockReturnValue({
      data: mockData,
    } as unknown as ReturnType<typeof useHeroSummary>);
  } else {
    mockUseHeroSummary.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useHeroSummary>);
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <FavoriteHeroProvider>
        <HeroStats />
      </FavoriteHeroProvider>
    </QueryClientProvider>,
  );
};

describe("heroStats", () => {
  test("should render component with default values", () => {
    renderHeroStats();

    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("should render HeroStats with mockData", () => {
    const { container } = renderHeroStats(mockSummaryData);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("Total de personajes")).toBeDefined();
    expect(screen.getByText("Favoritos")).toBeDefined();
    expect(screen.getByText("Fuerte")).toBeDefined();
    expect(screen.getByText("Inteligente")).toBeDefined();
  });

  test("should change the percentage of favorites when a hero is added to favorites", () => {
    localStorage.setItem("favorites", JSON.stringify([mockHero]));

    renderHeroStats(mockSummaryData);

    const favoritePercentageElement = screen.getByTestId("favorite-percentage");
    expect(favoritePercentageElement.innerHTML).toContain("4% of total");

    const favoriteCountElement = screen.getByTestId("favorite-count");
    expect(favoriteCountElement.innerHTML).toContain("1");
  });
});
