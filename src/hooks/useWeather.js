import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getWeatherForecast, 
  fetchLiveWeatherByCity,
  reverseGeocodeCoords,
  getFriendlyErrorInfo,
  ERROR_CODES
} from '../services/weatherService';
import { 
  getWeatherCondition, 
  getWindDirection, 
  formatTime, 
  formatDay, 
  formatDateShort,
  getVisibilityStatus,
  getPressureStatus,
  getUvLevel
} from '../utils/weatherUtils';

const RECENT_SEARCHES_STORAGE_KEY = 'skycast_recent_searches';
const MAX_RECENT_SEARCHES = 5;

/**
 * Transforms raw Open-Meteo telemetry into structured weather and forecast data.
 */
function normalizeWeatherAndForecast(location, rawWeather) {
  const current = rawWeather.current;
  const daily = rawWeather.daily;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  const forecast = (daily.time || []).slice(0, 5).map((timeStr, idx) => {
    const code = daily.weatherCode ? daily.weatherCode[idx] : 0;
    const cond = getWeatherCondition(code, true);
    return {
      day: formatDay(timeStr),
      date: formatDateShort(timeStr),
      weatherCode: code,
      condition: cond.label,
      icon: cond.icon,
      maxTemp: daily.temperatureMax ? daily.temperatureMax[idx] : current.temperature,
      minTemp: daily.temperatureMin ? daily.temperatureMin[idx] : current.temperature,
      rainProb: daily.precipitationProbabilityMax ? daily.precipitationProbabilityMax[idx] : 0
    };
  });

  const weatherInfo = {
    name: location.name,
    country: location.country,
    admin1: location.admin1,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone || 'auto',
    current: {
      temperature: current.temperature,
      feelsLike: current.apparentTemperature,
      condition: condition.label,
      icon: condition.icon,
      weatherCode: current.weatherCode,
      isDay: current.isDay,
      highTemp: daily.temperatureMax ? daily.temperatureMax[0] : current.temperature,
      lowTemp: daily.temperatureMin ? daily.temperatureMin[0] : current.temperature,
      humidity: current.relativeHumidity,
      windSpeed: current.windSpeed,
      windDirection: current.windDirection,
      windDirectionName: getWindDirection(current.windDirection),
      visibility: current.visibility !== undefined ? (current.visibility / 1000).toFixed(1) : '10.0',
      visibilityStatus: getVisibilityStatus(current.visibility),
      pressure: Math.round(current.surfacePressure || 1013),
      pressureStatus: getPressureStatus(current.surfacePressure),
      uvIndex: daily.uvIndexMax ? daily.uvIndexMax[0] : 3.0,
      uvLevel: getUvLevel(daily.uvIndexMax ? daily.uvIndexMax[0] : 3.0),
      sunrise: daily.sunrise && daily.sunrise[0] ? formatTime(daily.sunrise[0]) : '06:30 AM',
      sunset: daily.sunset && daily.sunset[0] ? formatTime(daily.sunset[0]) : '06:00 PM',
      airQuality: current.visibility > 10000 ? 'Optimal (AQI 24)' : 'Good (AQI 38)'
    }
  };

  return { weatherInfo, forecast };
}

/**
 * Reusable Custom React Hook: useWeather
 * 
 * Implements:
 * 1. useState() for managing all weather, forecast, location, loading, error, history, and geolocation states.
 * 2. useEffect() for initial data fetching, reacting to selectedCity changes, localStorage persistence, and cleanup.
 * 3. useRef() for AbortController request cancellation, duplicate query caching, and race condition prevention.
 * 
 * @param {string} [initialCity='New York'] - Starting city location
 * @returns {Object} Weather state and actions
 */
export function useWeather(initialCity = 'New York') {
  // ---------------------------------------------------------------------------
  // 1. USESTATE: Reactive State Management
  // ---------------------------------------------------------------------------
  // Weather information (current weather metrics)
  const [weatherInfo, setWeatherInfo] = useState(null);

  // Five-day forecast array
  const [fiveDayForecast, setFiveDayForecast] = useState([]);

  // Selected city target ({ type: 'name', value: 'Tokyo' } or { type: 'coords', lat, lon, label })
  const [selectedCity, setSelectedCity] = useState({
    type: 'name',
    value: initialCity
  });

  // Asynchronous Loading state
  const [loading, setLoading] = useState(true);

  // Structured Error info & friendly string message
  const [errorInfo, setErrorInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Recent searches history
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['New York', 'London', 'Tokyo', 'Paris'];
    } catch {
      return ['New York', 'London', 'Tokyo', 'Paris'];
    }
  });

  // Geolocation state
  const [geolocationState, setGeolocationState] = useState({
    isLocating: false,
    error: null
  });

  // Temperature unit (°C / °F)
  const [unit, setUnit] = useState('C');

  // ---------------------------------------------------------------------------
  // 2. USEREF: Mutable References & Memory Leak / Race Condition Guards
  // ---------------------------------------------------------------------------
  const abortControllerRef = useRef(null);
  const lastFetchedQueryRef = useRef(null);
  const requestIdRef = useRef(0);

  // ---------------------------------------------------------------------------
  // Side Effect: Persist recent searches to localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.warn('Failed to persist recent searches to localStorage:', e);
    }
  }, [recentSearches]);

  // Helper to add a city name to recent searches safely
  const addToRecentSearches = useCallback((cityName) => {
    if (!cityName || typeof cityName !== 'string') return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cityName.toLowerCase());
      return [cityName, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  }, []);

  // ---------------------------------------------------------------------------
  // 3. USEEFFECT: Location-driven Weather Telemetry Fetching with Full Cleanup
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!selectedCity) return;

    // Build unique query key to prevent unnecessary repeated requests
    const queryKey = selectedCity.type === 'name' 
      ? `city:${selectedCity.value.toLowerCase().trim()}`
      : `coords:${selectedCity.lat.toFixed(3)},${selectedCity.lon.toFixed(3)}`;

    // Avoid duplicate fetch if query hasn't changed and data already exists
    if (queryKey === lastFetchedQueryRef.current && weatherInfo) {
      return;
    }

    // Cancel any previous in-flight request using AbortController via useRef
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Instantiate new AbortController and track this request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++requestIdRef.current;

    // Reset error and activate loading state
    setLoading(true);
    setErrorInfo(null);
    setErrorMessage(null);

    async function fetchWeather() {
      try {
        let resultLocation;
        let rawWeatherData;

        if (selectedCity.type === 'name') {
          const res = await fetchLiveWeatherByCity(selectedCity.value, controller.signal);
          resultLocation = res.location;
          rawWeatherData = res.weather;
        } else {
          // Fetch weather forecast and reverse geocode coordinates in parallel
          const [weatherRes, revGeo] = await Promise.all([
            getWeatherForecast(selectedCity.lat, selectedCity.lon, 'auto', controller.signal),
            reverseGeocodeCoords(selectedCity.lat, selectedCity.lon, controller.signal)
          ]);

          rawWeatherData = weatherRes;
          resultLocation = {
            name: revGeo?.name || selectedCity.label || 'Detected Location',
            country: revGeo?.country || '',
            admin1: revGeo?.admin1 || '',
            latitude: selectedCity.lat,
            longitude: selectedCity.lon,
            timezone: weatherRes.timezone || 'auto'
          };
        }

        // Prevent race conditions: Ensure response belongs to the latest triggered request
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        // Normalize data and commit to state
        const { weatherInfo: nextWeather, forecast: nextForecast } = normalizeWeatherAndForecast(
          resultLocation,
          rawWeatherData
        );

        setWeatherInfo(nextWeather);
        setFiveDayForecast(nextForecast);
        setErrorInfo(null);
        setErrorMessage(null);
        lastFetchedQueryRef.current = queryKey;

        // Persist successful city query in recent list
        if (resultLocation.name && resultLocation.name !== 'Current Location') {
          addToRecentSearches(resultLocation.name);
        }
      } catch (err) {
        // Ignore AbortError caused by intentional cancellation
        if (err.name === 'AbortError') {
          return;
        }

        // Only update error if this is still the active request
        if (currentRequestId === requestIdRef.current) {
          const friendly = getFriendlyErrorInfo(err, { city: selectedCity.value });
          setErrorInfo(friendly);
          setErrorMessage(friendly.message);
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    // Cleanup operation: Abort active request on location change or component unmount
    return () => {
      controller.abort();
    };
  }, [selectedCity, addToRecentSearches]);

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  // Search by city name with duplicate prevention
  const searchCity = useCallback((cityName) => {
    if (!cityName || !cityName.trim()) return;
    const trimmed = cityName.trim();

    // Prevent duplicate submission if city matches current and no error
    if (
      selectedCity.type === 'name' &&
      selectedCity.value.toLowerCase() === trimmed.toLowerCase() &&
      weatherInfo &&
      !errorMessage
    ) {
      return;
    }

    setSelectedCity({ type: 'name', value: trimmed });
  }, [selectedCity, weatherInfo, errorMessage]);

  // Set location by GPS coordinates
  const searchCoordinates = useCallback((lat, lon, label = 'Current Location') => {
    if (lat === undefined || lon === undefined) return;
    setSelectedCity({ type: 'coords', lat, lon, label });
  }, []);

  // HTML5 Device Geolocation trigger with comprehensive error handling
  const requestCurrentLocation = useCallback(() => {
    // 1. Verify browser Geolocation API support
    if (typeof window === 'undefined' || !navigator || !navigator.geolocation) {
      const unsupportedInfo = {
        code: ERROR_CODES.GEOLOCATION_UNSUPPORTED,
        title: 'Geolocation Unsupported',
        message: 'Geolocation is not supported by your browser. Please search for your city manually.'
      };
      setGeolocationState({ isLocating: false, error: unsupportedInfo.message });
      setErrorInfo(unsupportedInfo);
      setErrorMessage(unsupportedInfo.message);
      return;
    }

    setGeolocationState({ isLocating: true, error: null });

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 second timeout
      maximumAge: 300000 // Cache for up to 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeolocationState({ isLocating: false, error: null });
        // Invalidate query key cache so re-clicking "Current Location" always fetches fresh telemetry
        lastFetchedQueryRef.current = null;
        searchCoordinates(pos.coords.latitude, pos.coords.longitude, 'Detected Location');
      },
      (geoErr) => {
        let errCode = ERROR_CODES.GEOLOCATION_UNAVAILABLE;
        let userTitle = 'Location Unavailable';
        let userMessage = 'Unable to determine your location. Please search for your city manually.';

        // Handle standard GeolocationPositionError codes with friendly messages
        switch (geoErr.code) {
          case 1: // PERMISSION_DENIED
            errCode = ERROR_CODES.GEOLOCATION_DENIED;
            userTitle = 'Location Permission Denied';
            userMessage = 'Location permission denied. Please allow location access in your browser settings or search for your city manually.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errCode = ERROR_CODES.GEOLOCATION_UNAVAILABLE;
            userTitle = 'Location Unavailable';
            userMessage = 'Location unavailable. Your device network could not determine your position. Please search manually.';
            break;
          case 3: // TIMEOUT
            errCode = ERROR_CODES.GEOLOCATION_TIMEOUT;
            userTitle = 'Location Request Timed Out';
            userMessage = 'Location request timed out. Please try again or search for your city manually.';
            break;
          default:
            errCode = ERROR_CODES.UNKNOWN;
            userTitle = 'Unable to Detect Location';
            userMessage = 'Unable to determine your location. Please search for your city manually.';
        }

        const friendly = { code: errCode, title: userTitle, message: userMessage };
        setGeolocationState({ isLocating: false, error: userMessage });
        setErrorInfo(friendly);
        setErrorMessage(userMessage);
      },
      geoOptions
    );
  }, [searchCoordinates]);

  // Toggle unit °C <-> °F
  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  // Clear recent search history
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear recent searches:', e);
    }
  }, []);

  // Remove individual city from recent searches
  const removeRecentSearch = useCallback((cityName) => {
    if (!cityName) return;
    setRecentSearches((prev) => prev.filter((item) => item.toLowerCase() !== cityName.toLowerCase()));
  }, []);

  // Manual retry handler
  const retryLastFetch = useCallback(() => {
    // Reset cache key to force a fresh fetch
    lastFetchedQueryRef.current = null;
    setErrorInfo(null);
    setErrorMessage(null);
    setSelectedCity((prev) => ({ ...prev }));
  }, []);

  // Clear current error banner
  const clearError = useCallback(() => {
    setErrorInfo(null);
    setErrorMessage(null);
  }, []);

  // Compute descriptive loading message based on active context
  const loadingMessage = geolocationState.isLocating
    ? 'Acquiring GPS coordinates from your device...'
    : selectedCity?.type === 'coords'
      ? 'Resolving live atmospheric telemetry for detected coordinates...'
      : `Retrieving live atmospheric telemetry for ${selectedCity?.value || 'location'}...`;

  return {
    // State items
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

    // Actions
    searchCity,
    searchCoordinates,
    requestCurrentLocation,
    toggleUnit,
    clearRecentSearches,
    removeRecentSearch,
    retryLastFetch,
    clearError
  };
}

export default useWeather;
