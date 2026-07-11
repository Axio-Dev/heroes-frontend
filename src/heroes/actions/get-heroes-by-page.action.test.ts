import { beforeEach, describe, expect, test } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";

import { getHeroesByPageAction } from "./get-heroes-by-page.action";
import { heroApi } from "../api/hero.api";

const BASE_URL = import.meta.env.VITE_API_URL;

describe("getHeroesByPageAction", () => {
  const heroesApiMock = new AxiosMockAdapter(heroApi);

  beforeEach(() => {
    heroesApiMock.reset();
  });

  test("should return default heroes", async () => {
    heroesApiMock.onGet("/").reply(200, {
      count: 10,
      total_pages: 2,
      next: null,
      previous: null,
      results: [
        {
          image: "1.jpeg",
        },
        {
          image: "2.jpeg",
        },
      ],
    });

    const response = await getHeroesByPageAction(1);

    expect(response).toStrictEqual({
      count: 10,
      total_pages: 2,
      next: null,
      previous: null,
      results: [
        { image: `${BASE_URL}/static/images/heroes/1.jpeg` },
        { image: `${BASE_URL}/static/images/heroes/2.jpeg` },
      ],
    });
  });

  test("should return a correct hero when page is not a number", async () => {
    const resposneObject = {
      count: 10,
      total_pages: 1,
      next: null,
      previous: null,
      results: [],
    };

    heroesApiMock.onGet("/").reply(200, resposneObject);

    await getHeroesByPageAction("abc" as unknown as number);

    const params = heroesApiMock.history.get[0].params;
    expect(params).toStrictEqual({ limit: 6, offset: 0, category: "all" });
  });

  test("should return a correct heroes when page is string number", async () => {
    const resposneObject = {
      count: 10,
      total_pages: 1,
      next: null,
      previous: null,
      results: [],
    };

    heroesApiMock.onGet("/").reply(200, resposneObject);

    await getHeroesByPageAction("5" as unknown as number);

    const params = heroesApiMock.history.get[0].params;
    expect(params).toStrictEqual({ limit: 6, offset: 24, category: "all" });
  });

  test("should call the api with correct params", async () => {
    const resposneObject = {
      count: 10,
      total_pages: 1,
      next: null,
      previous: null,
      results: [],
    };

    heroesApiMock.onGet("/").reply(200, resposneObject);

    await getHeroesByPageAction(2, 10, "heroes");

    const params = heroesApiMock.history.get[0].params;
    expect(params).toStrictEqual({ limit: 10, offset: 10, category: "heroes" });
  });
});
