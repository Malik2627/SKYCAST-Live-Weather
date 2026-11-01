/**
 * Utility functions for SKYCAST Live Weather Application
 * Handles WMO weather code translations, unit conversions, and formatting.
 */

/**
 * Maps WMO (World Meteorological Organization) weather interpretation codes
 * to human-readable descriptions and Lucide icon identifiers.
 * 
 * @param {number} code - WMO weather code
 * @param {boolean} isDay - Whether it is daytime (1) or nighttime (0)
 * @returns {{ label: string, icon: string }}
 */
export function getWeatherCondition(code, isDay = true) {
  const weatherMap = {
    0: { label: 'Clear Sky', icon: isDay ? 'Sun' : 'Moon' },
    1: { label: 'Mainly Clear', icon: isDay ? 'SunMedium' : 'Moon' },
    2: { label: 'Partly Cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon' },
    3: { label: 'Overcast', icon: 'Cloud' },
    45: { label: 'Fog', icon: 'CloudFog' },
    48: { label: 'Depositing Rime Fog', icon: 'CloudFog' },
    51: { label: 'Light Drizzle', icon: 'CloudDrizzle' },
    53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle' },
    55: { label: 'Dense Drizzle', icon: 'CloudDrizzle' },
    56: { label: 'Freezing Drizzle', icon: 'CloudDrizzle' },
    57: { label: 'Dense Freezing Drizzle', icon: 'CloudDrizzle' },
    61: { label: 'Slight Rain', icon: 'CloudRain' },
    63: { label: 'Moderate Rain', icon: 'CloudRain' },
    65: { label: 'Heavy Rain', icon: 'CloudRain' },
    66: { label: 'Freezing Rain', icon: 'CloudRain' },
    67: { label: 'Heavy Freezing Rain', icon: 'CloudRain' },
    71: { label: 'Slight Snow Fall', icon: 'CloudSnow' },
    73: { label: 'Moderate Snow Fall', icon: 'CloudSnow' },
    75: { label: 'Heavy Snow Fall', icon: 'CloudSnow' },
    77: { label: 'Snow Grains', icon: 'Snowflake' },
    80: { label: 'Slight Rain Showers', icon: 'CloudRain' },
    81: { label: 'Moderate Rain Showers', icon: 'CloudRain' },
    82: { label: 'Violent Rain Showers', icon: 'CloudLightning' },
    85: { label: 'Slight Snow Showers', icon: 'CloudSnow' },
    86: { label: 'Heavy Snow Showers', icon: 'CloudSnow' },
    95: { label: 'Thunderstorm', icon: 'CloudLightning' },
    96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning' },
    99: { label: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning' },
  };

  return weatherMap[code] || { label: 'Partly Cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon' };
}

/**
 * Determines the dynamic background theme based on WMO code and day/night state.
 * Supports 5 visual themes:
 * - 'sunny': Warm golden amber gradient
 * - 'cloudy': Cool grey-blue gradient
 * - 'rainy': Deep blue gradient
 * - 'snow': Light icy cyan gradient
 * - 'night': Dark navy gradient
 * 
 * @param {number} code - WMO weather code
 * @param {boolean} [isDay=true] - Daytime flag
 * @returns {'sunny' | 'cloudy' | 'rainy' | 'snow' | 'night'}
 */
export function getWeatherTheme(code, isDay = true) {
  // 1. Night condition
  if (!isDay) {
    return 'night';
  }

  // 2. Snow conditions (71, 73, 75, 77, 85, 86)
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return 'snow';
  }

  // 3. Rain, Drizzle & Thunderstorm conditions (51-67, 80-82, 95-99)
  if (
    (code >= 51 && code <= 67) || 
    (code >= 80 && code <= 82) || 
    (code >= 95 && code <= 99)
  ) {
    return 'rainy';
  }

  // 4. Cloudy & Fog conditions (2, 3, 45, 48)
  if ([2, 3, 45, 48].includes(code)) {
    return 'cloudy';
  }

  // 5. Sunny & Clear conditions (0, 1)
  if ([0, 1].includes(code)) {
    return 'sunny';
  }

  return 'sunny';
}

/**
 * Formats a temperature value based on the chosen unit.
 * 
 * @param {number} tempCelsius - Temperature in Celsius
 * @param {'C' | 'F'} unit - Target unit ('C' or 'F')
 * @returns {string} Formatted temperature string e.g. "24°C" or "75°F"
 */
export function formatTemperature(tempCelsius, unit = 'C') {
  if (tempCelsius === undefined || tempCelsius === null || isNaN(tempCelsius)) {
    return '--';
  }
  if (unit === 'F') {
    const fahrenheit = (tempCelsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(tempCelsius)}°C`;
}

/**
 * Formats wind speed based on unit.
 * 
 * @param {number} speedKmh - Speed in km/h
 * @param {'kmh' | 'mph'} unit - Target unit
 * @returns {string} Formatted speed string
 */
export function formatWindSpeed(speedKmh, unit = 'kmh') {
  if (speedKmh === undefined || speedKmh === null || isNaN(speedKmh)) {
    return '--';
  }
  if (unit === 'mph') {
    return `${Math.round(speedKmh * 0.621371)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Converts wind direction in degrees to a cardinal direction (N, NE, E, etc.).
 * 
 * @param {number} degrees - Direction in degrees (0-360)
 * @returns {string} Cardinal direction
 */
export function getWindDirection(degrees) {
  if (degrees === undefined || degrees === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index] || 'N';
}

/**
 * Formats an ISO date/time string to localized time (e.g., "14:30" or "2:30 PM").
 * 
 * @param {string} isoString - ISO date time string
 * @returns {string}
 */
export function formatTime(isoString) {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--';
  }
}

/**
 * Formats an ISO date string to a day name (e.g. "Monday", "Today").
 * 
 * @param {string} isoString - Date string (YYYY-MM-DD or full ISO)
 * @returns {string}
 */
export function formatDay(isoString) {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString([], { weekday: 'short' });
  } catch {
    return '--';
  }
}

/**
 * Formats an ISO date string to a short date (e.g. "Nov 2").
 * 
 * @param {string} isoString
 * @returns {string}
 */
export function formatDateShort(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Formats current date and time for a given timezone.
 * Returns e.g. "Sunday, Nov 1 • 2:51 PM"
 * 
 * @param {string} [timezone] - Valid IANA timezone e.g. "Asia/Kolkata", "America/New_York"
 * @returns {string} Formatted date and time string
 */
export function formatCityDateTime(timezone) {
  try {
    const now = new Date();
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone && timezone !== 'auto' ? timezone : undefined
    };
    const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
    // Insert a middle bullet separator between date and time
    // Intl format: "Sunday, Nov 1, 2:51 PM" -> "Sunday, Nov 1 • 2:51 PM"
    const lastCommaIndex = formatted.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      return `${formatted.slice(0, lastCommaIndex)} • ${formatted.slice(lastCommaIndex + 1).trim()}`;
    }
    return formatted;
  } catch (e) {
    const now = new Date();
    const datePart = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${datePart} • ${timePart}`;
  }
}

/**
 * Interprets visibility distance in meters to a qualitative label.
 * 
 * @param {number} meters 
 * @returns {string}
 */
export function getVisibilityStatus(meters) {
  if (!meters && meters !== 0) return 'Standard clarity';
  const km = meters / 1000;
  if (km >= 15) return 'Outstanding visibility';
  if (km >= 10) return 'Excellent clarity';
  if (km >= 5) return 'Good visibility';
  if (km >= 2) return 'Moderate haze';
  return 'Dense fog / Low view';
}

/**
 * Interprets barometric pressure in hPa.
 * 
 * @param {number} hPa 
 * @returns {string}
 */
export function getPressureStatus(hPa) {
  if (!hPa) return 'Standard atmospheric';
  if (hPa > 1022) return 'High pressure (Fair weather)';
  if (hPa < 1008) return 'Low pressure (Variable)';
  return 'Normal barometric pressure';
}

/**
 * Translates UV index to risk category.
 * 
 * @param {number} uv 
 * @returns {string}
 */
export function getUvLevel(uv) {
  if (uv === undefined || uv === null || isNaN(uv)) return 'Low';
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}
