import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentWeather, searchCities } from "./openWeather";

function mockOpenWeatherResponse(data, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: vi.fn().mockResolvedValue(data)
  });
}

describe("openWeather API helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENWEATHER_API_KEY;
  });

  it("returns no search results for an empty query without calling the API", async () => {
    global.fetch = vi.fn();

    await expect(searchCities("   ")).resolves.toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("searches cities and maps the OpenWeather response", async () => {
    process.env.OPENWEATHER_API_KEY = "test-api-key";
    mockOpenWeatherResponse([
      {
        name: "London",
        country: "GB",
        state: "England",
        lat: 51.5073219,
        lon: -0.1276474
      }
    ]);

    const result = await searchCities(" London ");
    const requestedUrl = new URL(global.fetch.mock.calls[0][0]);

    expect(requestedUrl.pathname).toBe("/geo/1.0/direct");
    expect(requestedUrl.searchParams.get("q")).toBe("London");
    expect(requestedUrl.searchParams.get("limit")).toBe("5");
    expect(requestedUrl.searchParams.get("appid")).toBe("test-api-key");
    expect(result).toEqual([
      {
        name: "London",
        country: "GB",
        state: "England",
        lat: 51.5073219,
        lon: -0.1276474
      }
    ]);
  });

  it("loads current weather in metric units and maps the response", async () => {
    process.env.OPENWEATHER_API_KEY = "test-api-key";
    mockOpenWeatherResponse({
      name: "London",
      sys: { country: "GB" },
      main: {
        temp: 18.4,
        feels_like: 17.9,
        humidity: 62
      },
      weather: [
        {
          description: "broken clouds",
          icon: "04d"
        }
      ],
      wind: { speed: 4.2 },
      dt: 1783856274
    });

    const result = await getCurrentWeather({
      lat: "51.5073219",
      lon: "-0.1276474"
    });
    const requestedUrl = new URL(global.fetch.mock.calls[0][0]);

    expect(requestedUrl.pathname).toBe("/data/2.5/weather");
    expect(requestedUrl.searchParams.get("units")).toBe("metric");
    expect(result).toEqual({
      cityName: "London",
      country: "GB",
      temperature: 18.4,
      feelsLike: 17.9,
      description: "broken clouds",
      icon: "04d",
      humidity: 62,
      windSpeed: 4.2,
      updatedAt: 1783856274
    });
  });

  it("rejects invalid coordinates before calling the API", async () => {
    global.fetch = vi.fn();

    await expect(getCurrentWeather({ lat: "", lon: "abc" })).rejects.toThrow(
      "Latitude and longitude are required"
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws the OpenWeather error message when a request fails", async () => {
    process.env.OPENWEATHER_API_KEY = "test-api-key";
    mockOpenWeatherResponse({ message: "Invalid API key" }, false);

    await expect(searchCities("London")).rejects.toThrow("Invalid API key");
  });
});
