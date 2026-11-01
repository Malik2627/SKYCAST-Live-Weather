import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import WeatherSkeleton from './components/WeatherSkeleton';
import WeatherBackground from './components/WeatherBackground';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import useWeather from './hooks/useWeather';
import { getWeatherTheme } from './utils/weatherUtils';
import './App.css';

/**
 * SKYCAST Live Weather Application (Premium Edition)
 * 
 * Features:
 * 1. Dynamic weather backgrounds (Sunny, Cloudy, Rainy, Snow, Night)
 * 2. Weather-based animations (sunbeams, cloud mist, raindrops, snowflakes, stars)
 * 3. Smooth transitions (fade, elevation, transform)
 * 4. Animated weather icons (solar spin, cloud float, rain drip, snowflake spark)
 * 5. Recent search history with active chip highlight & individual remove
 * 6. Current location shortcut (Navbar + inside SearchBar + top dropdown item)
 * 7. Better search suggestions with match highlight & empty recovery chips
 * 8. Improved loading animations with multi-tier progress and skeleton shimmer
 * 9. Accessible controls (full ARIA support, keyboard nav, :focus-visible rings)
 * 10. Attractive empty states across search, history, and dashboard
 */
function App() {
  const {
    weatherInfo,
    fiveDayForecast,
    selectedCity,
    loading,
    loadingMessage,
    errorInfo,
    errorMessage,
    recentSearches,
    geolocationState,
    unit,
    searchCity,
    requestCurrentLocation,
    toggleUnit,
    clearRecentSearches,
    removeRecentSearch,
    retryLastFetch,
    clearError
  } = useWeather('New York');

  // 1. useState: notification toast message
  const [notification, setNotification] = useState(null);

  // 2. useRef: toast timer reference to prevent memory leaks on rapid clicks or unmount
  const toastTimerRef = useRef(null);

  // 3. useEffect: Clean up notification timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Show notification toast with automatic timer cleanup
  const triggerToast = useCallback((message) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setNotification(message);
    toastTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  // Handle GPS location click
  const handleCurrentLocationClick = useCallback(() => {
    triggerToast('Detecting your GPS location...');
    requestCurrentLocation();
  }, [triggerToast, requestCurrentLocation]);

  // Toast feedback when GPS coordinates are successfully detected and loaded
  useEffect(() => {
    if (selectedCity?.type === 'coords' && weatherInfo?.name && !loading) {
      const locationText = weatherInfo.country 
        ? `${weatherInfo.name}, ${weatherInfo.country}` 
        : weatherInfo.name;
      triggerToast(`Location updated: ${locationText}`);
    }
  }, [selectedCity?.type, weatherInfo?.name, weatherInfo?.country, loading, triggerToast]);

  // Derive dynamic background theme (Sunny, Cloudy, Rainy, Snow, Night)
  const weatherTheme = useMemo(() => {
    return getWeatherTheme(
      weatherInfo?.current?.weatherCode,
      weatherInfo?.current?.isDay !== undefined ? weatherInfo.current.isDay : true
    );
  }, [weatherInfo?.current?.weatherCode, weatherInfo?.current?.isDay]);

  return (
    <div className={`skycast-app-root theme-${weatherTheme}`} data-theme={weatherTheme}>
      {/* Dynamic Top Progress Loading Bar */}
      {loading && (
        <div className="skycast-top-loading-bar" role="progressbar" aria-label="Loading weather telemetry"></div>
      )}

      {/* Dynamic Weather Background & Atmospheric Particle Canvas */}
      <WeatherBackground 
        theme={weatherTheme} 
        isDay={weatherInfo?.current?.isDay !== undefined ? weatherInfo.current.isDay : true} 
      />

      <div className="dashboard-content-shell">
        {/* Navigation Bar */}
        <Navbar
          unit={unit}
          onToggleUnit={toggleUnit}
          onCurrentLocation={handleCurrentLocationClick}
          currentCity={weatherInfo?.name}
          isLocating={geolocationState.isLocating}
        />

        {/* Global Notification Toast */}
        {notification && (
          <div className="location-toast" role="status" aria-live="polite">
            <span className="toast-dot"></span>
            <span>{notification}</span>
          </div>
        )}

        <main className="main-dashboard-viewport">
          {/* Search Bar with live geocoding suggestions, match highlight & GPS shortcut */}
          <SearchBar 
            onSearch={searchCity} 
            onCurrentLocation={handleCurrentLocationClick}
            loading={loading} 
            isLocating={geolocationState.isLocating}
            currentCity={weatherInfo?.name}
          />

          {/* Recent Searches history chips with active highlight & remove buttons */}
          <RecentSearches
            searches={recentSearches}
            onSelect={searchCity}
            onClear={clearRecentSearches}
            onRemoveCity={removeRecentSearch}
            currentCity={weatherInfo?.name}
          />

          {/* Friendly Error Banner with Contextual Icon, Tips & Retry Button */}
          {errorMessage && (
            <ErrorMessage
              message={errorMessage}
              title={errorInfo?.title}
              code={errorInfo?.code}
              onRetry={retryLastFetch}
              onDismiss={clearError}
            />
          )}

          {/* Loading State: Skeleton Cards + Animated Spinner & Message (No Blank Screens) */}
          {loading ? (
            <WeatherSkeleton message={loadingMessage} />
          ) : weatherInfo ? (
            <div className="telemetry-dashboard-appear">
              {/* Main Weather Card (Items 1-7: City, Country, Date/Time, Temp, Feels Like, Condition, Animated Icon) */}
              <CurrentWeather data={weatherInfo} unit={unit} />

              {/* Weather Details (Items 8-14: Humidity, Wind Speed, Visibility, Pressure, UV Index, Sunrise, Sunset) */}
              <WeatherDetails data={weatherInfo} unit={unit} />

              {/* Five-Day Forecast */}
              <Forecast forecast={fiveDayForecast} unit={unit} />
            </div>
          ) : null}
        </main>

        {/* Footer with Open-Meteo API Attribution */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
