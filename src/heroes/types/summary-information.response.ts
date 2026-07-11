import type { Hero } from "./hero.interface";

export interface SummaryInformationResponse {
  strongest_hero: Hero;
  smartest_hero: Hero;
  hero_count: number;
  villian_count: number;
  total: number;
}
