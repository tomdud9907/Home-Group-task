import { Button, List, ListItem, Paper, Typography } from "@mui/material";

function formatCityName(city) {
  return `${city.name}${city.state ? `, ${city.state}` : ""}, ${city.country}`;
}

export default function SearchResults({ cities, onAddCity }) {
  if (cities.length === 0) {
    return null;
  }

  return (
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
              <Button size="small" onClick={() => onAddCity(city)}>
                Add
              </Button>
            }
          >
            {formatCityName(city)}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
