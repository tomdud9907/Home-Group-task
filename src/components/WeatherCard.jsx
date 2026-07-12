import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";

function formatTemperature(value) {
  return Number.isFinite(value) ? Math.round(value) : "--";
}

function formatUpdatedAt(timestamp) {
  if (!timestamp) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp * 1000));
}

function WeatherMetric({ label, value }) {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: 2,
        minWidth: 0,
        p: 1.25
      }}
    >
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography component="p" sx={{ fontWeight: 700, mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function WeatherCard({ onRemove, weather }) {
  if (!weather) {
    return null;
  }

  const updatedAt = formatUpdatedAt(weather.updatedAt);
  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : "";

  return (
    <Card
      variant="outlined"
      sx={{
        background:
          "linear-gradient(135deg, #f8fbff 0%, #eef8f3 55%, #fff8ed 100%)",
        borderColor: "rgba(15, 23, 42, 0.1)",
        borderRadius: 2,
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
        overflow: "hidden"
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.25 } }}>
        <Stack spacing={1.75}>
          <Stack
            alignItems={{ xs: "flex-start", sm: "center" }}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box>
              <Typography component="h2" variant="h5">
                {weather.cityName}, {weather.country}
              </Typography>
              {updatedAt && (
                <Typography color="text.secondary" variant="body2">
                  Updated {updatedAt}
                </Typography>
              )}
            </Box>
            <Chip
              label="Current weather"
              size="small"
              sx={{
                bgcolor: "rgba(14, 116, 144, 0.1)",
                color: "#155e75",
                fontWeight: 700
              }}
            />
          </Stack>

          <Divider />

          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="p"
                sx={{
                  color: "#0f172a",
                  fontSize: { xs: 40, sm: 52 },
                  fontWeight: 800,
                  lineHeight: 0.95
                }}
              >
                {formatTemperature(weather.temperature)}&deg;C
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 1, textTransform: "capitalize" }}
                variant="h6"
              >
                {weather.description}
              </Typography>
            </Box>

            {iconUrl && (
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: "rgba(255, 255, 255, 0.76)",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  borderRadius: 2,
                  display: "flex",
                  flex: "0 0 auto",
                  height: { xs: 72, sm: 88 },
                  justifyContent: "center",
                  width: { xs: 72, sm: 88 }
                }}
              >
                <Box
                  component="img"
                  alt={weather.description}
                  src={iconUrl}
                  sx={{ height: { xs: 66, sm: 80 }, width: { xs: 66, sm: 80 } }}
                />
              </Box>
            )}
          </Stack>

          <Box
            sx={{
              display: "grid",
              gap: { xs: 1, sm: 1.5 },
              gridTemplateColumns: {
                xs: "repeat(3, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))"
              }
            }}
          >
            <WeatherMetric
              label="Feels like"
              value={
                <>
                  {formatTemperature(weather.feelsLike)}&deg;C
                </>
              }
            />
            <WeatherMetric label="Humidity" value={`${weather.humidity}%`} />
            <WeatherMetric label="Wind" value={`${weather.windSpeed} m/s`} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button color="error" onClick={onRemove} size="small">
              Remove
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
