/**
 * Open-Meteo Weather Service for SKYCAST
 * 
 * Documentation:
 * - Geocoding API: https://geocoding-api.open-meteo.com/v1/search
 * - Weather Forecast API: https://api.open-meteo.com/v1/forecast
 * 
 * Free, open-source, and does not require an API key.
 * All units are metric (°C, km/h, mm, meters).
 * Supports AbortSignal for request cancellation, 10s timeouts, and robust error classification.
 */

export const ERROR_CODES = {
  INVALID_CITY: 'INVALID_CITY',
  EMPTY_SEARCH: 'EMPTY_SEARCH',
  OFFLINE: 'OFFLINE',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',
  MISSING_DATA: 'MISSING_DATA',
  GEOLOCATION_DENIED: 'GEOLOCATION_DENIED',
  GEOLOCATION_UNAVAILABLE: 'GEOLOCATION_UNAVAILABLE',
  GEOLOCATION_TIMEOUT: 'GEOLOCATION_TIMEOUT',
  GEOLOCATION_UNSUPPORTED: 'GEOLOCATION_UNSUPPORTED',
  UNKNOWN: 'UNKNOWN'
};

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

// Common city alias mappings for international / historical names
const CITY_ALIASES = {
  'bangalore': 'Bengaluru',
  'bombay': 'Mumbai',
  'calcutta': 'Kolkata',
  'madras': 'Chennai'
};

/**
 * Resilient fetch wrapper with network detection, timeout guard, and status normalization.
 * 
 * @param {string} url - Request endpoint
 * @param {Object} [options] - Fetch configuration
 * @param {AbortSignal} [options.signal] - Caller AbortSignal
 * @param {number} [options.timeoutMs=10000] - Request timeout in milliseconds
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(url, { signal = null, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, ...fetchOptions } = {}) {
  // 1. Detect browser offline status immediately
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const offlineErr = new Error('Internet connection unavailable. Please check your network connection and try again.');
    offlineErr.code = ERROR_CODES.OFFLINE;
    throw offlineErr;
  }

  // 2. Setup internal timeout controller
  const timeoutController = new AbortController();
  let isTimedOut = false;

  const timerId = setTimeout(() => {
    isTimedOut = true;
    timeoutController.abort(new Error('Request timed out'));
  }, timeoutMs);

  // 3. Link external signal if supplied
  const abortListener = () => {
    clearTimeout(timerId);
    timeoutController.abort(signal.reason);
  };

  if (signal) {
    if (signal.aborted) {
      clearTimeout(timerId);
      throw signal.reason || new DOMException('Aborted', 'AbortError');
    }
    signal.addEventListener('abort', abortListener, { once: true });
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: timeoutController.signal
    });

    clearTimeout(timerId);
    if (signal) {
      signal.removeEventListener('abort', abortListener);
    }

    // 4. Handle HTTP Server Failures (5xx or unexpected statuses)
    if (!response.ok) {
      if (response.status >= 500) {
        const srvErr = new Error('The weather service is temporarily unavailable. We are working on restoring connection—please try again shortly.');
        srvErr.code = ERROR_CODES.SERVER_ERROR;
        srvErr.status = response.status;
        throw srvErr;
      }

      if (response.status === 404) {
        const notFoundErr = new Error('The requested weather resource could not be found.');
        notFoundErr.code = ERROR_CODES.INVALID_CITY;
        notFoundErr.status = 404;
        throw notFoundErr;
      }

      const httpErr = new Error('Unable to complete weather request. Please try again.');
      httpErr.code = ERROR_CODES.SERVER_ERROR;
      httpErr.status = response.status;
      throw httpErr;
    }

    return response;
  } catch (err) {
    clearTimeout(timerId);
    if (signal) {
      signal.removeEventListener('abort', abortListener);
    }

    // Re-throw genuine user/parent cancellations cleanly
    if (signal && signal.aborted) {
      const abortErr = new DOMException('Aborted', 'AbortError');
      abortErr.name = 'AbortError';
      throw abortErr;
    }

    // Handle timeout error
    if (isTimedOut || err.code === ERROR_CODES.TIMEOUT) {
      const timeoutErr = new Error('The request timed out while contacting the weather service. Please check your connection and try again.');
      timeoutErr.code = ERROR_CODES.TIMEOUT;
      timeoutErr.name = 'TimeoutError';
      throw timeoutErr;
    }

    // Handle standard network failures (DNS failure, offline dropped during fetch)
    if (err.message && (err.message.includes('Failed to fetch') || err.message.toLowerCase().includes('network'))) {
      const netErr = new Error('Internet connection unavailable. Please check your network connection and try again.');
      netErr.code = ERROR_CODES.OFFLINE;
      throw netErr;
    }

    throw err;
  }
}

/**
 * Searches for geographic coordinates for a given city name.
 * 
 * @param {string} cityName - Name of the city (e.g. "Berlin", "Tokyo", "London")
 * @param {number} [count=5] - Maximum number of matching results to retrieve
 * @param {AbortSignal} [signal] - Optional AbortSignal for request cancellation
 * @returns {Promise<Array<{ id: number, name: string, country: string, admin1: string, latitude: number, longitude: number, timezone: string }>>}
 */
export async function geocodeCity(cityName, count = 5, signal = null) {
  if (!cityName || typeof cityName !== 'string' || !cityName.trim()) {
    const emptyErr = new Error('Please enter a city or location name to search.');
    emptyErr.code = ERROR_CODES.EMPTY_SEARCH;
    throw emptyErr;
  }

  const sanitizedQuery = cityName.trim();
  const lookupName = CITY_ALIASES[sanitizedQuery.toLowerCase()] || sanitizedQuery;
  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(lookupName)}&count=${count}&language=en&format=json`;

  const response = await fetchWithTimeout(url, { signal, timeoutMs: 9000 });

  let data;
  try {
    data = await response.json();
  } catch {
    const parseErr = new Error('Weather data could not be parsed. Please try again.');
    parseErr.code = ERROR_CODES.SERVER_ERROR;
    throw parseErr;
  }

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((item) => ({
    id: item.id,
    name: item.name,
    country: item.country || '',
    admin1: item.admin1 || '',
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone || 'auto'
  }));
}

/**
 * Helper to fetch primary coordinates for a single city, with friendly error handling.
 * 
 * @param {string} cityName - City to look up
 * @param {AbortSignal} [signal] - Optional AbortSignal
 * @returns {Promise<{ name: string, country: string, admin1: string, latitude: number, longitude: number, timezone: string }>}
 */
export async function getCityCoordinates(cityName, signal = null) {
  const matches = await geocodeCity(cityName, 1, signal);

  if (!matches || matches.length === 0) {
    const invalidErr = new Error(`No matching location found for "${cityName}". Please check the spelling or search for another city nearby.`);
    invalidErr.code = ERROR_CODES.INVALID_CITY;
    invalidErr.city = cityName;
    throw invalidErr;
  }

  return matches[0];
}

/**
 * Fetches current weather and daily forecasts for given latitude and longitude.
 * 
 * @param {number} latitude - Latitude coordinate (-90 to 90)
 * @param {number} longitude - Longitude coordinate (-180 to 180)
 * @param {string} [timezone='auto'] - Timezone
 * @param {AbortSignal} [signal] - Optional AbortSignal
 * @returns {Promise<Object>} Formatted live weather data object
 */
export async function getWeatherForecast(latitude, longitude, timezone = 'auto', signal = null) {
  if (latitude === undefined || latitude === null || isNaN(latitude)) {
    const latErr = new Error('A valid geographic coordinate is required to fetch weather forecast.');
    latErr.code = ERROR_CODES.MISSING_DATA;
    throw latErr;
  }
  if (longitude === undefined || longitude === null || isNaN(longitude)) {
    const lonErr = new Error('A valid geographic coordinate is required to fetch weather forecast.');
    lonErr.code = ERROR_CODES.MISSING_DATA;
    throw lonErr;
  }

  const queryParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'visibility',
      'is_day'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_probability_max'
    ].join(','),
    timezone: timezone,
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm'
  });

  const url = `${FORECAST_BASE_URL}?${queryParams.toString()}`;
  const response = await fetchWithTimeout(url, { signal, timeoutMs: 10000 });

  let data;
  try {
    data = await response.json();
  } catch {
    const parseErr = new Error('Weather data could not be parsed. Please try again.');
    parseErr.code = ERROR_CODES.SERVER_ERROR;
    throw parseErr;
  }

  // 6. Missing weather data error check
  if (!data || !data.current || !data.daily || !data.daily.time || data.daily.time.length === 0) {
    const missingErr = new Error('Weather telemetry for this location is currently incomplete. Please try again or search for another city.');
    missingErr.code = ERROR_CODES.MISSING_DATA;
    throw missingErr;
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    elevation: data.elevation,
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      relativeHumidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      surfacePressure: data.current.surface_pressure,
      visibility: data.current.visibility, // in meters
      isDay: data.current.is_day === 1,
      time: data.current.time
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      uvIndexMax: data.daily.uv_index_max,
      precipitationProbabilityMax: data.daily.precipitation_probability_max
    }
  };
}

/**
 * Reverse geocodes latitude and longitude into city, state, and country name.
 * 
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {AbortSignal} [signal] 
 * @returns {Promise<{ name: string, country: string, admin1: string } | null>}
 */
export async function reverseGeocodeCoords(latitude, longitude, signal = null) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetchWithTimeout(url, { signal, timeoutMs: 7000 });
    const data = await response.json();
    return {
      name: data.city || data.locality || data.principalSubdivision || 'Detected Location',
      country: data.countryName || '',
      admin1: data.principalSubdivision || ''
    };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return null;
  }
}

/**
 * Convenience orchestrator combining geocoding and weather forecast.
 * 
 * @param {string} cityName - Name of the city
 * @param {AbortSignal} [signal] - Optional AbortSignal
 * @returns {Promise<{ location: Object, weather: Object }>}
 */
export async function fetchLiveWeatherByCity(cityName, signal = null) {
  const location = await getCityCoordinates(cityName, signal);
  const weather = await getWeatherForecast(location.latitude, location.longitude, location.timezone, signal);

  return {
    location,
    weather
  };
}

/**
 * Normalizes any error object into friendly, empathetic user-facing copy.
 * Ensures NO technical errors or raw stack traces are ever exposed to users.
 * 
 * @param {Error|Object|string} error - The caught error
 * @param {Object} [context] - Contextual metadata (e.g. { city: 'Paris' })
 * @returns {{ code: string, title: string, message: string }}
 */
export function getFriendlyErrorInfo(error, context = {}) {
  // If browser is offline
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      code: ERROR_CODES.OFFLINE,
      title: 'Internet Connection Lost',
      message: 'Internet connection unavailable. Please check your network connection and try again.'
    };
  }

  const code = error?.code || ERROR_CODES.UNKNOWN;
  const rawMsg = (error?.message || '').toLowerCase();

  if (code === ERROR_CODES.INVALID_CITY || error?.status === 404) {
    const city = context.city || error?.city || 'this location';
    return {
      code: ERROR_CODES.INVALID_CITY,
      title: 'Location Not Found',
      message: `No matching location found for "${city}". Please check the spelling or search for another city nearby.`
    };
  }

  if (code === ERROR_CODES.EMPTY_SEARCH || rawMsg.includes('empty')) {
    return {
      code: ERROR_CODES.EMPTY_SEARCH,
      title: 'City Name Required',
      message: 'Please enter a city or location name to search (e.g., Chennai, London, New York).'
    };
  }

  if (code === ERROR_CODES.OFFLINE || rawMsg.includes('network') || rawMsg.includes('failed to fetch')) {
    return {
      code: ERROR_CODES.OFFLINE,
      title: 'Network Connection Issue',
      message: 'Internet connection unavailable. Please check your network connection and try again.'
    };
  }

  if (code === ERROR_CODES.TIMEOUT || error?.name === 'TimeoutError' || rawMsg.includes('timed out')) {
    return {
      code: ERROR_CODES.TIMEOUT,
      title: 'Request Timed Out',
      message: 'The request timed out while contacting the weather service. Please check your connection and try again.'
    };
  }

  if (code === ERROR_CODES.SERVER_ERROR || (error?.status && error.status >= 500)) {
    return {
      code: ERROR_CODES.SERVER_ERROR,
      title: 'Weather Service Unavailable',
      message: 'The weather service is temporarily unavailable. We are working on restoring connection—please try again shortly.'
    };
  }

  if (code === ERROR_CODES.MISSING_DATA) {
    return {
      code: ERROR_CODES.MISSING_DATA,
      title: 'Weather Data Unavailable',
      message: 'Weather telemetry for this location is currently incomplete. Please try again or search for another city.'
    };
  }

  if (code === ERROR_CODES.GEOLOCATION_DENIED) {
    return {
      code: ERROR_CODES.GEOLOCATION_DENIED,
      title: 'Location Access Denied',
      message: 'Location permission denied. Please allow location access in your browser settings or search for your city manually.'
    };
  }

  if (code === ERROR_CODES.GEOLOCATION_UNAVAILABLE) {
    return {
      code: ERROR_CODES.GEOLOCATION_UNAVAILABLE,
      title: 'Location Unavailable',
      message: 'Location unavailable. Your device network could not determine your position. Please search manually.'
    };
  }

  if (code === ERROR_CODES.GEOLOCATION_TIMEOUT) {
    return {
      code: ERROR_CODES.GEOLOCATION_TIMEOUT,
      title: 'Location Request Timed Out',
      message: 'Location request timed out. Please try again or search for your city manually.'
    };
  }

  if (code === ERROR_CODES.GEOLOCATION_UNSUPPORTED) {
    return {
      code: ERROR_CODES.GEOLOCATION_UNSUPPORTED,
      title: 'Geolocation Unsupported',
      message: 'Geolocation is not supported by your browser. Please search for your city manually.'
    };
  }

  // Fallback friendly message - Never expose raw technical errors to users
  return {
    code: ERROR_CODES.UNKNOWN,
    title: 'Unable to Load Weather',
    message: error?.message && !error.message.includes('fetch') && !error.message.includes('HTTP')
      ? error.message
      : 'Unable to retrieve live weather data at this time. Please try again.'
  };
}
