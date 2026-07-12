import { Box, Typography } from "@mui/material";

export default function DashboardHeader() {
  return (
    <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 800, letterSpacing: 0 }}
      >
        Weather Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 18 }}>
        Track current weather for your selected cities in one simple view.
      </Typography>
    </Box>
  );
}
