import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";

export const useHeroPaginated = (
  page: number,
  limit: number,
  category: string = "all",
) => {
  const query = useQuery({
    queryKey: ["heroes", "page", { page, limit, category }],
    queryFn: () => getHeroesByPageAction(+page, +limit, category),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    heroesResponse: query.data,
  };
};
