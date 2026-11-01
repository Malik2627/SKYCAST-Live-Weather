# SKYCAST – Live Weather Intelligence

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2.0-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-0284c7?style=for-the-badge&logo=cloud&logoColor=white)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **SKYCAST** is a premier, hyper-responsive weather intelligence and atmospheric forecasting dashboard. Built with **React 19**, **Vite**, and styled with modern **Dark Navy Glassmorphism**, SKYCAST provides real-time meteorological observations, high-precision 5-day forecasts, device GPS geolocation with reverse geocoding, and weather-driven dynamic ambient themes.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [API Architecture](#api-architecture)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Local Development & Build](#local-development--build)
- [Screenshots & UI Showcase](#screenshots--ui-showcase)
- [Error Handling & Resilience](#error-handling--resilience)
- [Developer Information](#developer-information)
- [License](#license)

---

## Overview

SKYCAST bridges high-accuracy meteorological telemetry with modern web aesthetics. Instead of cluttered tables or flat interfaces, SKYCAST delivers a sleek dark navy glassmorphic cockpit featuring soft glowing gradients, micro-animated SVG weather icons, and fluid responsive design scaling effortlessly from a 320px mobile viewport to a 1920px+ ultra-wide desktop display.

---

## Key Features

### 1. Live Current Weather Telemetry
* **City & Regional Meta:** Displays city name, administrative region/state, and country flag information.
* **Localized Timezone Clock:** Real-time localized time calculation tailored to each city's exact IANA timezone (e.g., `Asia/Kolkata`, `America/New_York`, `Europe/London`).
* **High-Accuracy Readings:** Current temperature, apparent ("Feels-like") temperature, and daily High/Low extremes.
* **Instant Unit Conversion:** Seamless 1-click toggle between Celsius (°C) and Fahrenheit (°F).

### 2. Five-Day Precision Outlook
* 5 distinct daily forecast cards with day label, short date, condition badge, maximum/minimum temperature brackets, and precipitation probability percentages.
* Full WMO weather code mapping covering clear skies, cloudy intervals, fog, freezing drizzle, rain showers, snowfall, and thunderstorms.

### 3. Atmospheric Telemetry & Solar Cycle (6 Dedicated Cards)
1. **Humidity:** Real-time relative moisture percentage with interactive progress bar and qualitative dew-point advice.
2. **Wind Speed & Compass:** Real-time velocity (km/h or mph) accompanied by a 16-point rotating directional compass needle.
3. **Horizontal Visibility:** Optical clarity in kilometers with qualitative air condition status chips.
4. **Surface Barometric Pressure:** Real-time atmospheric pressure measured in hectopascals (hPa).
5. **Solar UV Index:** Daily maximum UV index with color-coded risk level badges (*Low, Moderate, High, Extreme*).
6. **Sunrise & Sunset Cycle:** Geographical solar horizon calculations for twilight and dawn.

### 4. Dynamic Weather Backgrounds & Particle Physics
The ambient background automatically adapts to current atmospheric conditions:
* **Sunny (Day):** Warm golden-amber gradient with glowing rotating sunbeams.
* **Cloudy (Day):** Cool grey-blue gradient with soft drifting cloud mist layers.
* **Rainy / Storm:** Deep atmospheric indigo gradient with falling rain streaks.
* **Snow:** Light icy cyan gradient with drifting crystal snowflakes.
* **Night:** Deep midnight navy gradient with twinkling celestial stars.

### 5. Micro-Animated Weather Icons
GPU-accelerated CSS animations tailored to each condition:
* Slowly rotating sun with solar warmth halo.
* Floating clouds with sun peeks.
* Dripping raindrop pulses and lightning flash shimmers.
* Spinning crystalline snowflakes and glowing crescent moons.

### 6. Intelligent City Search & Autocomplete
* Debounced (280ms) real-time geocoding autocomplete with Open-Meteo.
* **Substring Match Highlighting:** Typed characters are underlined with an illuminated cyan mark.
* Full keyboard accessibility (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`).
* Deduplication and duplicate submission lock preventing redundant queries.
* Zero-result empty state featuring quick-select fallback suggestion chips.

### 7. Geolocation with Reverse Geocoding
* 1-Click GPS detection shortcut in the Navbar, inside the search input, and as the top dropdown suggestion item.
* Detects latitude and longitude via HTML5 Browser Geolocation API.
* Automatically resolves GPS coordinates into human-readable city names, states, and countries via reverse geocoding.

### 8. Recent Search History
* Automatically records the last 5 searched cities in `localStorage`.
* Highlights the actively selected city with an accent border and sparkle badge.
* Individual removal button (`×`) on each chip plus a global **"Clear"** action.
* Elegant empty history prompt.

### 9. Complete Error Handling & Skeletons
* **7 Major Error Scenarios Handled:** Invalid city, empty search, offline/network failure, 5xx server failure, 10s request timeout, missing telemetry, and geolocation permission denial.
* Zero raw technical exceptions or stack traces exposed to end-users.
* Actionable **"Try Again"** retry button with loading spinners.
* Glassmorphic skeleton cards with linear-gradient shimmer animations eliminate blank screens during data fetching.

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **UI Library** | [React 19](https://react.dev/) | Functional components, Hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`) |
| **Bundler & Tooling** | [Vite 6](https://vitejs.dev/) | Lightning-fast HMR and optimized production build |
| **Language** | JavaScript (ES6+) | Modern ECMAScript module architecture |
| **Styling** | CSS3 & Flexbox/Grid | Custom dark navy glassmorphism, CSS variables, hardware-accelerated animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible SVG iconography |
| **Data Provider** | [Open-Meteo API](https://open-meteo.com/) | Free, open-source, keyless global weather and geocoding endpoints |
| **Reverse Geocoding** | [BigDataCloud API](https://www.bigdatacloud.com/) | Keyless client-side reverse geocoding service |

---

## API Architecture

SKYCAST relies exclusively on keyless, open-source, and developer-friendly public APIs:

1. **Open-Meteo Geocoding Search API:**
   ```
   GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json
   ```
   *Resolves city queries into latitude, longitude, country, administrative region, and timezone.*

2. **Open-Meteo Weather Forecast API:**
   ```
   GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone={tz}&wind_speed_unit=kmh&precipitation_unit=mm
   ```
   *Fetches high-resolution live surface observations and 7-day daily forecast telemetry in standard metric units.*

3. **BigDataCloud Client Reverse Geocoding API:**
   ```
   GET https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={lat}&longitude={lon}&localityLanguage=en
   ```
   *Translates raw device GPS coordinates into localized city, state, and country names without requiring an API key.*

---

## Project Structure

```
d:\liveweather\
├── index.html                     # Application HTML5 entrypoint
├── package.json                   # Project metadata, dependencies & build scripts
├── vite.config.js                 # Vite configuration
├── .gitignore                     # Git exclusion rules
├── README.md                      # Comprehensive project documentation
└── src/
    ├── main.jsx                   # React root mount (React.StrictMode)
    ├── App.jsx                    # Core dashboard orchestrator & state manager
    ├── App.css                    # Glassmorphism styling, responsive layouts & keyframes
    ├── index.css                  # Typography, custom scrollbars & color variables
    ├── assets/                    # Static branding & assets
    ├── components/
    │   ├── Navbar.jsx             # Top bar, logo, GPS trigger & °C/°F unit switch
    │   ├── SearchBar.jsx          # Search bar, 1-click GPS button, autocompletion & validation
    │   ├── CurrentWeather.jsx     # Hero weather card (Items 1-7 telemetry)
    │   ├── WeatherDetails.jsx     # Atmospheric Telemetry & Solar cycle (Items 8-14)
    │   ├── WeatherHighlights.jsx  # Highlight telemetry cards deck
    │   ├── Forecast.jsx           # 5-Day forecast container
    │   ├── ForecastCard.jsx       # Individual forecast day card
    │   ├── RecentSearches.jsx     # Recent search chips with individual removal & clear
    │   ├── LoadingSpinner.jsx     # Atmospheric radar pulse loading indicator
    │   ├── ErrorMessage.jsx       # Contextual friendly error banners & retry trigger
    │   ├── WeatherSkeleton.jsx    # Glassmorphic shimmering placeholder skeleton cards
    │   ├── WeatherIcon.jsx        # Micro-animated SVG weather icon component
    │   ├── WeatherBackground.jsx  # Dynamic atmospheric background & particle canvas
    │   └── Footer.jsx             # Branding signature & Open-Meteo attribution
    ├── hooks/
    │   └── useWeather.js          # Custom React Hook managing weather state, caches & AbortControllers
    ├── services/
    │   └── weatherService.js      # Resilient API communication layer with timeout guards
    └── utils/
        ├── weatherUtils.js        # WMO translations, unit conversions, timezone formatting
        └── sampleData.js          # Offline fallback datasets & popular global cities
```

---

## Installation Guide

### Prerequisites
* [Node.js](https://nodejs.org/) version **18.0.0 or higher**
* `npm` (Node Package Manager) or `pnpm` / `yarn`

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/skycast.git
   cd skycast
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Local Development & Build

### Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the live dashboard with Hot Module Replacement (HMR).

### Build for Production
```bash
npm run build
```
Compiles and minifies assets into the `dist/` directory with zero build warnings.

### Preview the Production Build
```bash
npm run preview
```
Spins up a local server serving the compiled production assets.

---

## Screenshots & UI Showcase

```
+-----------------------------------------------------------------------------------+
|  [Logo] SKYCAST PRO   Live Weather Intelligence           [Use GPS]   ( °C | °F ) |
+-----------------------------------------------------------------------------------+
|  [ 🔍 Search city (e.g. Chennai, London, Tokyo)... ] [📍 GPS] [ Search Button ]  |
+-----------------------------------------------------------------------------------+
|  Recent: [ New York ↗ ] [ London ↗ ] [ Tokyo ↗ ] [ Chennai ↗ ]      [ 🗑 Clear ]   |
+-----------------------------------------------------------------------------------+
|  ============================== MAIN WEATHER CARD =============================== |
|  📍 London, United Kingdom                        Sunday, Nov 1 • 7:16 PM         |
|                                                                                   |
|     ( 🌤 Animated Icon )    17°C                 High: 19°C   |   Low: 11°C       |
|                             Feels like 16°C      Condition: Partly Cloudy         |
|  ================================================================================ |
+-----------------------------------------------------------------------------------+
|  ================ ATMOSPHERIC TELEMETRY & SOLAR CYCLE (6 CARDS) ================== |
|  [ 💧 Humidity: 70% ]      [ 💨 Wind: 14 km/h SW ]      [ 👁 Visibility: 10 km ]  |
|  [ ⏱ Pressure: 1013 hPa ]  [ ☀️ UV Index: 3.2 Mod ]     [ 🌅 Rise 6:30 / Set 6:00 ]|
+-----------------------------------------------------------------------------------+
|  ============================== 5-DAY OUTLOOK =================================== |
|  [ Today: 18°/12° ] [ Mon: 16°/10° ] [ Tue: 17°/11° ] [ Wed: 19°/13° ] [ Thu... ] |
+-----------------------------------------------------------------------------------+
|  Powered by Open-Meteo Weather API  •  © 2026 SKYCAST Inc. All rights reserved.   |
+-----------------------------------------------------------------------------------+
```

---

## Error Handling & Resilience

SKYCAST is engineered for resilience. In the event of network disruption or invalid inputs, the application never crashes or exposes raw stack traces:

* **No Blank Screens:** The user interface remains fully visible and operable at all times.
* **Friendly Copy:** Converts technical errors (e.g., `Failed to fetch`, `502 Bad Gateway`, `JSON.parse`) into clear explanations with actionable recovery advice.
* **One-Click Retry:** Every error card features an animated **"Try Again"** button to re-execute the request seamlessly.
* **Memory Leak Guards:** `useRef` handles all `AbortController` cancellation tokens and timeout timers on component unmount.

---

## Developer Information

* **Lead Architect:** Advanced Agentic Engineering Team
* **Project:** SKYCAST Live Weather Intelligence
* **Repository:** `https://github.com/your-username/skycast`
* **Issues & Feedback:** Contributions, bug reports, and feature requests are welcome via GitHub Issues.

---

## License

This project is open-source software licensed under the **[MIT License](https://opensource.org/licenses/MIT)**. Feel free to use, modify, and distribute with attribution.

