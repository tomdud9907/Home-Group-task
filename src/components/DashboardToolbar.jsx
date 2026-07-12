import { Button, Paper, Typography } from "@mui/material";

export default function DashboardToolbar({ cityCount, loading, onRefresh }) {
  if (cityCount === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        alignItems: "center",
        bgcolor: "rgba(255, 255, 255, 0.72)",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        display: "flex",
        justifyContent: "space-between",
        p: 1.5
      }}
    >
      <Typography color="text.secondary" variant="body2">
        Showing {cityCount} saved {cityCount === 1 ? "city" : "cities"}
      </Typography>
      <Button disabled={loading} onClick={onRefresh} size="small" variant="contained">
        Refresh weather
      </Button>
    </Paper>
  );
}
