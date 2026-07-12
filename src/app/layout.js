import "./globals.css";

export const metadata = {
  title: "Weather Dashboard",
  description: "A simple weather dashboard using OpenWeather"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
