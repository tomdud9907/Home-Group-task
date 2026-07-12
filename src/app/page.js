"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography
} from "@mui/material";
import CitySearch from "@/components/CitySearch";
import SearchResults from "@/components/SearchResults";
import WeatherCard from "@/components/WeatherCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setWeather(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "City search failed");
      }

      setCities(data.cities);
    } catch (searchError) {
      setCities([]);
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadWeather(city) {
    setError("");
    setWeather(null);
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

      setWeather(data.weather);
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
            Minimal API test screen. Search for a city, then load current weather.
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

        <SearchResults cities={cities} onLoadWeather={handleLoadWeather} />
        <WeatherCard weather={weather} />
      </Stack>
    </Container>
  );
}
