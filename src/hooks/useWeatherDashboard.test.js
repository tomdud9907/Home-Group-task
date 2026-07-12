import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWeatherDashboard } from "./useWeatherDashboard";

const london = {
  name: "London",
  country: "GB",
  state: "England",
  lat: 51.5073219,
  lon: -0.1276474
};

const londonWeather = {
  cityName: "London",
  country: "GB",
  temperature: 18,
  feelsLike: 17,
  description: "clear sky",
  icon: "01d",
  humidity: 60,
  windSpeed: 4,
  updatedAt: 1783856274
};

function mockJsonResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data)
  });
}

function submitEvent() {
  return { preventDefault: vi.fn() };
}

describe("useWeatherDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with an empty dashboard", async () => {
    const { result } = renderHook(() => useWeatherDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.dashboardItems).toEqual([]);
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe("");
  });

  it("searches cities and stores the results", async () => {
    global.fetch.mockResolvedValueOnce(mockJsonResponse({ cities: [london] }));
    const { result } = renderHook(() => useWeatherDashboard());

    act(() => {
      result.current.setQuery("London");
    });

    await act(async () => {
      await result.current.handleSearch(submitEvent());
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/search?query=London");
    expect(result.current.searchResults).toEqual([london]);
    expect(result.current.error).toBe("");
  });

  it("shows an error when a city search has no results", async () => {
    global.fetch.mockResolvedValueOnce(mockJsonResponse({ cities: [] }));
    const { result } = renderHook(() => useWeatherDashboard());

    act(() => {
      result.current.setQuery("Nowhere");
    });

    await act(async () => {
      await result.current.handleSearch(submitEvent());
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe('No cities found for "Nowhere".');
  });

  it("adds a city to the dashboard and saves it to localStorage", async () => {
    global.fetch.mockResolvedValueOnce(mockJsonResponse({ weather: londonWeather }));
    const { result } = renderHook(() => useWeatherDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleAddCity(london);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/weather?lat=51.5073219&lon=-0.1276474"
    );
    expect(result.current.dashboardItems).toHaveLength(1);
    expect(result.current.dashboardItems[0].weather).toEqual(londonWeather);
    expect(JSON.parse(localStorage.getItem("weather-dashboard-cities"))).toEqual([
      london
    ]);
  });

  it("prevents adding the same city twice", async () => {
    global.fetch.mockResolvedValueOnce(mockJsonResponse({ weather: londonWeather }));
    const { result } = renderHook(() => useWeatherDashboard());

    await act(async () => {
      await result.current.handleAddCity(london);
    });
    await act(async () => {
      await result.current.handleAddCity(london);
    });

    expect(result.current.dashboardItems).toHaveLength(1);
    expect(result.current.error).toBe("London is already on your dashboard.");
  });

  it("removes a city from the dashboard and localStorage", async () => {
    global.fetch.mockResolvedValueOnce(mockJsonResponse({ weather: londonWeather }));
    const { result } = renderHook(() => useWeatherDashboard());

    await act(async () => {
      await result.current.handleAddCity(london);
    });

    act(() => {
      result.current.handleRemoveCity(result.current.dashboardItems[0].id);
    });

    expect(result.current.dashboardItems).toEqual([]);
    expect(JSON.parse(localStorage.getItem("weather-dashboard-cities"))).toEqual([]);
  });

  it("loads saved cities from localStorage on mount", async () => {
    localStorage.setItem("weather-dashboard-cities", JSON.stringify([london]));
    global.fetch.mockResolvedValueOnce(mockJsonResponse({ weather: londonWeather }));

    const { result } = renderHook(() => useWeatherDashboard());

    await waitFor(() => expect(result.current.dashboardItems).toHaveLength(1));

    expect(result.current.dashboardItems[0].city).toEqual(london);
    expect(result.current.dashboardItems[0].weather).toEqual(londonWeather);
  });

  it("shows the API error when search fails", async () => {
    global.fetch.mockResolvedValueOnce(
      mockJsonResponse({ error: "City search failed" }, false)
    );
    const { result } = renderHook(() => useWeatherDashboard());

    await act(async () => {
      await result.current.handleSearch(submitEvent());
    });

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe("City search failed");
  });
});
