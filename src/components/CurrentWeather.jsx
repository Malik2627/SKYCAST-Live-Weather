import React from 'react';
import { 
  Thermometer,
  Clock,
  MapPin,
  ArrowUp,
  ArrowDown,
  Sparkles
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemperature, formatCityDateTime } from '../utils/weatherUtils';

/**
 * CurrentWeather Component for SKYCAST
 * Displays real-time API weather data:
 * 1. City name
 * 2. Country (and Region)
 * 3. Current date and local time
 * 4. Current temperature
 * 5. Feels-like temperature
 * 6. Weather description
 * 7. Animated Weather icon
 * (plus High / Low temperature extremes)
 * 
 * @param {Object} props
 * @param {Object} props.data - Current city weather telemetry object
 * @param {'C' | 'F'} props.unit - Active temperature unit
 */
export const CurrentWeather = React.memo(function CurrentWeather({ data, unit = 'C' }) {
  if (!data || !data.current) return null;

  const current = data.current;
  const isDay = current.isDay !== undefined ? current.isDay : true;

  // Formatted local date and time according to city timezone
  const currentDateTime = formatCityDateTime(data.timezone);

  // Fallback-safe values
  const cityName = data.name || 'Current Location';
  const countryName = data.country ? (data.admin1 ? `${data.admin1}, ${data.country}` : data.country) : (data.admin1 || '');
  const temperature = formatTemperature(current.temperature, unit);
  const feelsLike = formatTemperature(current.feelsLike, unit);
  const condition = current.condition || 'Current Conditions';
  const highTemp = current.highTemp !== undefined ? formatTemperature(current.highTemp, unit) : null;
  const lowTemp = current.lowTemp !== undefined ? formatTemperature(current.lowTemp, unit) : null;

  return (
    <section className="main-weather-card" aria-label="Current Weather Information">
      <div className="card-ambient-glow"></div>
      
      {/* 1, 2, 3: City, Country, Current Date & Time */}
      <div className="main-card-header">
        <div className="location-meta">
          <div className="location-title-row">
            <MapPin size={22} className="pin-icon" aria-hidden="true" />
            <h2 className="city-headline">{cityName}</h2>
            {countryName && <span className="country-headline">{countryName}</span>}
          </div>
          <p className="date-headline">
            <Clock size={15} className="calendar-icon" aria-hidden="true" />
            <span>{currentDateTime}</span>
          </p>
        </div>

        {/* 6. Weather Description Badge */}
        <div className="condition-status-pill" title={`Condition: ${condition}`}>
          <Sparkles size={14} className="sparkle-icon" aria-hidden="true" />
          <span>{condition}</span>
        </div>
      </div>

      {/* Main Hero Weather Display */}
      <div className="main-hero-body">
        {/* 4, 5, 7: Current Temp, Feels-like Temp, Animated Weather Icon */}
        <div className="hero-left">
          <div className="hero-icon-container" title={condition}>
            <WeatherIcon 
              icon={current.icon} 
              weatherCode={current.weatherCode} 
              isDay={isDay} 
              size={72} 
              animated={true}
              className="hero-svg-icon"
            />
            <div className="icon-backdrop-circle"></div>
          </div>

          <div className="hero-temperature-details">
            <div className="temperature-readout">
              <span className="temp-number">{temperature}</span>
            </div>
            <div className="feels-like-row">
              <Thermometer size={16} className="feels-like-icon" aria-hidden="true" />
              <span>Feels like <strong>{feelsLike}</strong></span>
            </div>
          </div>
        </div>

        {/* High & Low Temperature Extremes */}
        <div className="hero-right">
          <div className="temp-extremes">
            {highTemp && (
              <div className="extreme-pill high" title="Daily High Temperature">
                <ArrowUp size={15} aria-hidden="true" />
                <span>High: <strong>{highTemp}</strong></span>
              </div>
            )}
            {lowTemp && (
              <div className="extreme-pill low" title="Daily Low Temperature">
                <ArrowDown size={15} aria-hidden="true" />
                <span>Low: <strong>{lowTemp}</strong></span>
              </div>
            )}
          </div>

          {current.airQuality && (
            <div className="air-quality-badge" title="Live Air Quality Indicator">
              <span className="aq-dot"></span>
              <span>Air Quality: {current.airQuality}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default CurrentWeather;
