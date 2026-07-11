import { Heart, Trophy, Users, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HeroStatCard } from "./HeroStatCard";

import { useHeroSummary } from "../hooks/useHeroSummary";
import { use } from "react";
import { FavoriteHeroContext } from "../context/FavoriteHeroContext";

export const HeroStats = () => {
  const { data: summary } = useHeroSummary();
  const { favoriteCount } = use(FavoriteHeroContext);

  const totalPercentage = summary ? (favoriteCount / summary.total) * 100 : 0;

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">{summary?.total}</div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {summary?.hero_count} Heroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {summary?.villian_count} Villains
          </Badge>
        </div>
      </HeroStatCard>

      <HeroStatCard
        title="Favoritos"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        {/* //TODO: calcular este valor*/}
        <div
          className="text-2xl font-bold text-red-600"
          data-testid="favorite-count"
        >
          {favoriteCount}
        </div>
        <p
          className="text-xs text-muted-foreground"
          data-testid="favorite-percentage"
        >
          {totalPercentage}% of total{" "}
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.strongest_hero.alias}</div>
        <p className="text-xs text-muted-foreground">
          Strength: {summary?.strongest_hero.strength}/ 10
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Inteligente"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">{summary?.smartest_hero.alias} </div>
        <p className="text-xs text-muted-foreground">
          Intelligence: {summary?.smartest_hero.intelligence}/10
        </p>
      </HeroStatCard>
    </div>
  );
};
