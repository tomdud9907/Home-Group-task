import { useEffect, useState } from "react";

const STORAGE_KEY = "weather-dashboard-cities";

function getCityId(city) {
  return `${city.name}-${city.state}-${city.country}-${city.lat}-${city.lon}`;
}

function loadSavedCities() {
  const savedCities = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return Array.isArray(savedCities) ? savedCities : [];
}

function saveCities(cities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

async function searchCities(query) {
  const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "City search failed");
  }

  return data.cities;
}

async function fetchWeatherForCity(city) {
  const params = new URLSearchParams({
    lat: city.lat,
    lon: city.lon
  });
  const response = await fetch(`/api/weather?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Weather request failed");
  }

  return {
    id: getCityId(city),
    city,
    weather: data.weather
  };
}

export function useWeatherDashboard() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [dashboardItems, setDashboardItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedCitiesLoaded, setSavedCitiesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const savedCities = loadSavedCities();

        if (savedCities.length === 0) {
          return;
        }

        setLoading(true);
        const savedWeather = await Promise.all(savedCities.map(fetchWeatherForCity));

        if (!cancelled) {
          setDashboardItems(savedWeather);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load your saved cities.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSavedCitiesLoaded(true);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!savedCitiesLoaded) {
      return;
    }

    saveCities(dashboardItems.map((item) => item.city));
  }, [dashboardItems, savedCitiesLoaded]);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cities = await searchCities(query);

      if (cities.length === 0) {
        setError(`No cities found for "${query.trim()}".`);
      }

      setSearchResults(cities);
    } catch (searchError) {
      setSearchResults([]);
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCity(city) {
    setError("");

    if (dashboardItems.some((item) => item.id === getCityId(city))) {
      setError(`${city.name} is already on your dashboard.`);
      return;
    }

    setLoading(true);

    try {
      const dashboardItem = await fetchWeatherForCity(city);

      setDashboardItems((currentItems) => [...currentItems, dashboardItem]);
      setSearchResults([]);
      setQuery("");
    } catch (weatherError) {
      setError(weatherError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRemoveCity(cityId) {
    setDashboardItems((currentItems) =>
      currentItems.filter((item) => item.id !== cityId)
    );
  }

  async function handleRefreshWeather() {
    setError("");
    setLoading(true);

    try {
      const refreshedItems = await Promise.all(
        dashboardItems.map((item) => fetchWeatherForCity(item.city))
      );

      setDashboardItems(refreshedItems);
    } catch (refreshError) {
      setError(refreshError.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    dashboardItems,
    error,
    handleAddCity,
    handleRefreshWeather,
    handleRemoveCity,
    handleSearch,
    loading,
    query,
    searchResults,
    setQuery
  };
}
