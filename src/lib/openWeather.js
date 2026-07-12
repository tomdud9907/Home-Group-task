const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

function getApiKey() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENWEATHER_API_KEY in .env.local");
  }

  return apiKey;
}

async function fetchOpenWeather(url) {
  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || "OpenWeather request failed";
    throw new Error(message);
  }

  return data;
}

export async function searchCities(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = new URL(`${GEO_BASE_URL}/direct`);
  url.searchParams.set("q", trimmedQuery);
  url.searchParams.set("limit", "5");
  url.searchParams.set("appid", getApiKey());

  const cities = await fetchOpenWeather(url);

  return cities.map((city) => ({
    name: city.name,
    country: city.country,
    state: city.state || "",
    lat: city.lat,
    lon: city.lon
  }));
}

export async function getCurrentWeather({ lat, lon }) {
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Latitude and longitude are required");
  }

  const url = new URL(`${WEATHER_BASE_URL}/weather`);
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", getApiKey());

  const weather = await fetchOpenWeather(url);
  const primaryWeather = weather.weather?.[0] || {};

  return {
    cityName: weather.name,
    country: weather.sys?.country || "",
    temperature: weather.main?.temp,
    feelsLike: weather.main?.feels_like,
    description: primaryWeather.description || "",
    icon: primaryWeather.icon || "",
    humidity: weather.main?.humidity,
    windSpeed: weather.wind?.speed,
    updatedAt: weather.dt
  };
}
