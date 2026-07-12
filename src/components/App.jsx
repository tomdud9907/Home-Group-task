"use client";

import {
  Alert,
  CircularProgress,
  Container,
  Stack
} from "@mui/material";
import CitySearch from "@/components/CitySearch";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSection from "@/components/DashboardSection";
import DashboardToolbar from "@/components/DashboardToolbar";
import SearchResults from "@/components/SearchResults";
import { useWeatherDashboard } from "@/hooks/useWeatherDashboard";

export default function App() {
  const {
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
  } = useWeatherDashboard();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
      <Stack spacing={3.5}>
        <DashboardHeader />

        <CitySearch
          loading={loading}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          query={query}
        />

        {loading && <CircularProgress aria-label="Loading" />}
        {error && <Alert severity="error">{error}</Alert>}

        <SearchResults cities={searchResults} onAddCity={handleAddCity} />

        <DashboardToolbar
          cityCount={dashboardItems.length}
          loading={loading}
          onRefresh={handleRefreshWeather}
        />

        <DashboardSection items={dashboardItems} onRemoveCity={handleRemoveCity} />
      </Stack>
    </Container>
  );
}
