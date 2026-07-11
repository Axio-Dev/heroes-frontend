import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useHeroPaginated } from "./useHeroPaginated";
import { useHeroSummary } from "./useHeroSummary";

export const useHomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "6";
  const category = searchParams.get("category") ?? "all";

  const selectedTab = useMemo(() => {
    const validTabs = ["all", "favorites", "heroes", "villains"];

    return validTabs.includes(activeTab) ? activeTab : "all";
  }, [activeTab]);

  const { heroesResponse } = useHeroPaginated(+page, +limit, category);

  const { summary } = useHeroSummary();

  return {
    selectedTab,
    heroesResponse,
    summary,

    setSearchParams,
  };
};
