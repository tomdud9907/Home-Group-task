# Weather Dashboard

A small weather dashboard built for the Home Group web developer coding exercise.

It lets you search for a city, add it to your dashboard, check the current weather, refresh the data, and remove cities you no longer want to track. Saved cities stay in the browser after a refresh thanks to `localStorage`.

Live deployment: https://home-group-task.vercel.app/

## Features

- Search for cities and add the right result to your dashboard
- See current weather in a simple responsive layout
- Keep selected cities saved between browser sessions
- Refresh or remove cities when needed
- Show clear loading and error messages
- Cover the main API/helper logic with unit tests

## Tech Stack

- Next.js
- React
- JavaScript
- Material UI
- Vitest

## Project Structure

```txt
src/
  app/
    api/
      search/route.js      # City search API route
      weather/route.js     # Current weather API route
    globals.css            # Global styling
    layout.jsx             # Next.js root layout
    page.jsx               # Next.js page wrapper

  components/
    App.jsx                # Main app composition
    CitySearch.jsx         # Search form
    DashboardHeader.jsx    # Page heading
    DashboardSection.jsx   # Saved city cards
    DashboardToolbar.jsx   # Saved city count and refresh action
    SearchResults.jsx      # City search results
    WeatherCard.jsx        # Weather display card

  hooks/
    useWeatherDashboard.js       # Dashboard state and actions
    useWeatherDashboard.test.js  # Hook unit tests

  lib/
    openWeather.js         # Server-side weather API helper
    openWeather.test.js    # API helper unit tests
```

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```bash
OPENWEATHER_API_KEY=your_openweather_api_key
```

You can create a free API key here:

https://openweathermap.org/api

## Running Locally

Start the development server:

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## Available Scripts

Run tests:

```bash
npm test
```

## Approach

The app uses Next.js API routes so the weather API key stays on the server side. The browser talks to local API endpoints, and those endpoints call the external weather service.

Most of the dashboard behaviour lives in the `useWeatherDashboard` hook. That keeps the React components focused on the UI while the hook handles searching, adding cities, removing cities, refreshing weather, and syncing saved cities to `localStorage`.

The UI is split into small components so `App.jsx` can stay focused on composing the page.

## Notes and Assumptions

- Weather data refreshes when a saved city loads, when a city is added, and when the user clicks `Refresh weather`.
- Saved cities live in `localStorage`; there is no database or login flow.
- I avoided automatic polling so the app does not burn through API calls in the background.
- The free API tier is enough for the current feature set.

## What I Would Improve With More Time

- Add autocomplete search, but with a debounce so it does not call the API on every key press.
- Make refresh more forgiving if one saved city fails to update, so the rest of the dashboard can still refresh.
- Add a few UI-level tests around the main user flow.
- Spend more time on accessibility details like focus states and screen reader labels.
- Add deployment notes and screenshots once the final deployment is stable.
