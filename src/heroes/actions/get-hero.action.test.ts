import { describe, expect, test } from "vitest";
import { getHeroAction } from "./get-hero.action";
console.log(import.meta.env.VITE_API_URL);

describe("getHeroAction", () => {
  test("should fetch hero data and return with complete image url", async () => {
    const result = await getHeroAction("bruce-wayne");

    expect(result.image).toContain("http");
    expect(result).toStrictEqual({
      alias: "Batman",
      category: "Hero",
      description:
        "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
      durability: 7,
      first_appearance: "1939",
      id: "cca55be1-1e8e-46ad-8112-7816c2eed97c",
      image: "http://localhost:8001/static/images/heroes/2.jpeg",
      intelligence: 10,
      name: "Bruce Wayne",
      powers: [
        "Artes marciales",
        "Habilidades de detective",
        "Tecnología avanzada",
        "Sigilo",
        "Genio táctico",
      ],
      slug: "bruce-wayne",
      speed: 6,
      status: "Active",
      strength: 6,
      team: "Liga de la Justicia",
      universe: "DC",
    });
  });

  test("should throw an error if hero is not found", async () => {
    const idSlug = "clark-kent2";

    const result = await getHeroAction(idSlug).catch((error) => {
      expect(error).toBeDefined();
      expect(error.message).toBe("Request failed with status code 404");
    });

    expect(result).toBeUndefined();
  });
});
