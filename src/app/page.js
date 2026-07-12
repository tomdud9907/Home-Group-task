"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import CitySearch from "@/components/CitySearch";
import SearchResults from "@/components/SearchResults";
import WeatherCard from "@/components/WeatherCard";

const STORAGE_KEY = "weather-dashboard-cities";

function getCityId(city) {
  return `${city.name}-${city.state}-${city.country}-${city.lat}-${city.lon}`;
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [dashboardItems, setDashboardItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedCitiesLoaded, setSavedCitiesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedCities() {
      try {
        const savedCities = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        if (!Array.isArray(savedCities) || savedCities.length === 0) {
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

    loadSavedCities();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!savedCitiesLoaded) {
      return;
    }

    const citiesToSave = dashboardItems.map((item) => item.city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citiesToSave));
  }, [dashboardItems, savedCitiesLoaded]);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "City search failed");
      }

      if (data.cities.length === 0) {
        setError(`No cities found for "${query.trim()}".`);
      }

      setCities(data.cities);
    } catch (searchError) {
      setCities([]);
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
      setCities([]);
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

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <Stack spacing={3.5}>
        <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 800, letterSpacing: 0 }}
          >
            Weather Dashboard
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18 }}>
            Track current weather for your selected cities in one simple view.
          </Typography>
        </Box>

        <CitySearch
          loading={loading}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          query={query}
        />

        {loading && <CircularProgress aria-label="Loading" />}
        {error && <Alert severity="error">{error}</Alert>}

        <SearchResults cities={cities} onAddCity={handleAddCity} />

        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Cities
          </Typography>
          {dashboardItems.length === 0 ? (
            <Paper
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.72)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                p: 2.5
              }}
            >
              <Typography color="text.secondary">
                No cities added yet. Search for a city above to get started.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {dashboardItems.map((item) => (
                <WeatherCard
                  key={item.id}
                  onRemove={() => handleRemoveCity(item.id)}
                  weather={item.weather}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
