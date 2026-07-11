import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useHeroPaginated } from "./useHeroPaginated";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

vi.mock("../actions/get-heroes-by-page.action", () => ({
  getHeroesByPageAction: vi.fn(),
}));

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const tanStackCustomProvider = () => {
  /**
   * - Desactiva los reintentos (`retry: false`) para tests deterministas.
   * - Usar como `wrapper` en `renderHook` o `render` para proporcionar React Query.
   */

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHeroPaginated", () => {
  beforeEach(() => {
    (vi.clearAllMocks(), queryClient.clear());
  });

  test("should return the initial state (isLoading)", () => {
    const { result } = renderHook(() => useHeroPaginated(1, 6), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    // estos dos ultimos, son lo mismo, solo es otra manera
    expect(result.current.data).toBe(undefined);
    expect(result.current.data).toBeUndefined();
  });

  test("should return success state with data when API call succeeds", async () => {
    const mockHeroesData = {
      count: 20,
      total_pages: 4,
      results: [],
      next: null,
      previous: null,
    };

    mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);

    const { result } = renderHook(() => useHeroPaginated(1, 6), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });

    expect(result.current.status).toBe("success");
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call getHeroesByPageAction with arguments", async () => {
    const mockHeroesData = {
      count: 20,
      total_pages: 4,
      results: [],
      next: null,
      previous: null,
    };

    mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);

    const { result } = renderHook(() => useHeroPaginated(1, 6, "heroes"), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });

    expect(result.current.status).toBe("success");
    expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, "heroes");
  });
});
