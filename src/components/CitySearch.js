import { Button, Paper, Stack, TextField } from "@mui/material";

export default function CitySearch({ loading, onQueryChange, onSubmit, query }) {
  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          label="City"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="London"
        />
        <Button type="submit" variant="contained" disabled={!query.trim() || loading}>
          Search
        </Button>
      </Stack>
    </Paper>
  );
}
