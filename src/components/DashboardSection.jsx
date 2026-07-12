import { Box, Paper, Typography } from "@mui/material";
import WeatherCard from "@/components/WeatherCard";

export default function DashboardSection({ items, onRemoveCity }) {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Your Cities
      </Typography>
      {items.length === 0 ? (
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
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))"
            }
          }}
        >
          {items.map((item) => (
            <WeatherCard
              key={item.id}
              onRemove={() => onRemoveCity(item.id)}
              weather={item.weather}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
