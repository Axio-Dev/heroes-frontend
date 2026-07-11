import { describe, expect, test } from "vitest";
import { getSummaryAction } from "./get-summary.action";

describe("getSummaryAction", () => {
  test("should fetch summary and return complete information", async () => {
    const summary = await getSummaryAction();

    expect(summary).toStrictEqual({
      strongest_hero: expect.objectContaining({
        id: expect.any(String),
        slug: expect.any(String),
        name: expect.any(String),
        alias: expect.any(String),
        powers: expect.any(Array),
        description: expect.any(String),
        strength: expect.any(Number),
        intelligence: expect.any(Number),
        speed: expect.any(Number),
        durability: expect.any(Number),
        team: expect.any(String),
        image: expect.any(String),
        first_appearance: expect.any(String),
        status: expect.any(String),
        category: expect.any(String),
        universe: expect.any(String),
      }),
      smartest_hero: expect.objectContaining({
        id: expect.any(String),
        slug: expect.any(String),
        name: expect.any(String),
        alias: expect.any(String),
        powers: expect.any(Array),
        description: expect.any(String),
        strength: expect.any(Number),
        intelligence: expect.any(Number),
        speed: expect.any(Number),
        durability: expect.any(Number),
        team: expect.any(String),
        image: expect.any(String),
        first_appearance: expect.any(String),
        status: expect.any(String),
        category: expect.any(String),
        universe: expect.any(String),
      }),
      hero_count: expect.any(Number),
      villian_count: expect.any(Number),
      total: expect.any(Number),
    });
  });
});
