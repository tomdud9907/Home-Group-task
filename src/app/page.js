"use client";

import { useState } from "react";
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

export default function Home() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [dashboardWeather, setDashboardWeather] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getCityId(city) {
    return `${city.name}-${city.state}-${city.country}-${city.lat}-${city.lon}`;
  }

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

    if (dashboardWeather.some((item) => item.id === getCityId(city))) {
      setError(`${city.name} is already on your dashboard.`);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        lat: city.lat,
        lon: city.lon
      });
      const response = await fetch(`/api/weather?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Weather request failed");
      }

      setDashboardWeather((currentWeather) => [
        ...currentWeather,
        {
          id: getCityId(city),
          weather: data.weather
        }
      ]);
      setCities([]);
      setQuery("");
    } catch (weatherError) {
      setError(weatherError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Weather Dashboard
          </Typography>
          <Typography color="text.secondary">
            Search for a city and add it to your dashboard.
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
            Dashboard
          </Typography>
          {dashboardWeather.length === 0 ? (
            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">
                No cities added yet. Search for a city above to get started.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {dashboardWeather.map((item) => (
                <WeatherCard key={item.id} weather={item.weather} />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
