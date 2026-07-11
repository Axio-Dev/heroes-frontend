import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { useHomePage } from "@/heroes/hooks/useHomePage";
import { use } from "react";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

export const HomePage = () => {
  const { selectedTab, setSearchParams, summary, heroesResponse } =
    useHomePage();

  const { favoriteCount, favorites } = use(FavoriteHeroContext);

  return (
    <>
      <>
        {/* Header */}
        <CustomJumbotron
          title="Universo de SuperHéroes"
          description="Descubre, explora y administrar SuperHéroes y Villanos"
        />

        <CustomBreadcrumbs currentPage="Super Héroes" />

        {/* Stats Dashboard */}
        <HeroStats />

        {/* Tabs */}
        <Tabs value={selectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="all"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "all");
                  prev.set("category", "all");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              All Characters ({summary?.total})
            </TabsTrigger>

            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "favorites");
                  prev.set("category", "favorites");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              Favorites ({favoriteCount})
            </TabsTrigger>
            <TabsTrigger
              value="heroes"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "heroes");
                  prev.set("category", "hero");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              Heroes ({summary?.hero_count})
            </TabsTrigger>
            <TabsTrigger
              value="villains"
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("tab", "villains");
                  prev.set("category", "villain");
                  prev.set("page", "1");
                  return prev;
                })
              }
            >
              Villains ({summary?.villian_count})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* All Characters Grid */}
            <h1>Todos los personajes</h1>
            <HeroGrid heroes={heroesResponse?.results ?? []} />
          </TabsContent>
          {/* All Favorite Carachters */}
          <TabsContent value="favorites">
            <h1>Favoritos</h1>
            <HeroGrid heroes={favorites} />
          </TabsContent>
          {/* All Heroes */}
          <TabsContent value="heroes">
            <h1>Héroes</h1>
            <HeroGrid heroes={heroesResponse?.results ?? []} />
          </TabsContent>
          {/* All Villians */}
          <TabsContent value="villains">
            <h1>Villanos</h1>
            <HeroGrid heroes={heroesResponse?.results ?? []} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {selectedTab !== "favorites" && (
          <CustomPagination totalPages={heroesResponse?.total_pages ?? 1} />
        )}
      </>
    </>
  );
};
