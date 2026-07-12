"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

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

        <Paper component="form" onSubmit={handleSearch} sx={{ p: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="City"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="London"
            />
            <Button type="submit" variant="contained" disabled={!query.trim() || loading}>
              Search
            </Button>
          </Stack>
        </Paper>

        {loading && <CircularProgress aria-label="Loading" />}
        {error && <Alert severity="error">{error}</Alert>}

        {cities.length > 0 && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
              Search results
            </Typography>
            <List>
              {cities.map((city) => (
                <ListItem
                  key={`${city.name}-${city.state}-${city.country}-${city.lat}-${city.lon}`}
                  disableGutters
                  secondaryAction={
                    <Button size="small" onClick={() => handleLoadWeather(city)}>
                      Load weather
                    </Button>
                  }
                >
                  {city.name}
                  {city.state ? `, ${city.state}` : ""}, {city.country}
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {weather && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" component="h2">
              Weather response
            </Typography>
            <Box component="pre" sx={{ overflowX: "auto", m: 0 }}>
              {JSON.stringify(weather, null, 2)}
            </Box>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
