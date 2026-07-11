import { heroApi } from "../api/hero.api";
import type { HeroesResponse } from "../types/get-heroes.response";

interface Options {
  name?: string;
  status?: string;
  team?: string;
  category?: string;
  universe?: string;
  strength?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const searchHeroesAction = async (options: Options = {}) => {
  const { name, team, category, universe, status, strength } = options;

  if (!name && !team && !category && !universe && !status && !strength) {
    return [];
  }

  const { data } = await heroApi.get<HeroesResponse>("/search", {
    params: {
      name,
      team,
      category,
      universe,
      status,
      strength,
    },
  });

  return data.results.map((hero) => ({
    ...hero,
    results: data,
    image: `${BASE_URL}/static/images/heroes/${hero.image}`,
  }));
};
