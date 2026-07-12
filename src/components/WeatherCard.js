import { Box, Paper, Stack, Typography } from "@mui/material";

export default function WeatherCard({ weather }) {
  if (!weather) {
    return null;
  }

  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : "";

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        {iconUrl && (
          <Box
            component="img"
            alt={weather.description}
            src={iconUrl}
            sx={{ height: 80, width: 80 }}
          />
        )}
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" component="h2">
            {weather.cityName}, {weather.country}
          </Typography>
          <Typography variant="h3" component="p">
            {Math.round(weather.temperature)}&deg;C
          </Typography>
          <Typography color="text.secondary" sx={{ textTransform: "capitalize" }}>
            {weather.description}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
            <Typography>Feels like: {Math.round(weather.feelsLike)}&deg;C</Typography>
            <Typography>Humidity: {weather.humidity}%</Typography>
            <Typography>Wind: {weather.windSpeed} m/s</Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
