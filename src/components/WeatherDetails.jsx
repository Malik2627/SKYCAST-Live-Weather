import React from 'react';
import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Compass,
  Activity
} from 'lucide-react';
import { formatWindSpeed } from '../utils/weatherUtils';

/**
 * WeatherDetails Component for SKYCAST
 * Displays comprehensive real-time atmospheric telemetry from Open-Meteo:
 * 8.  Humidity (%)
 * 9.  Wind Speed (km/h or mph) & direction
 * 10. Visibility (km)
 * 11. Atmospheric Pressure (hPa)
 * 12. UV Index
 * 13. Sunrise
 * 14. Sunset
 * 
 * @param {Object} props
 * @param {Object} props.data - Weather telemetry data object
 * @param {'C' | 'F'} [props.unit='C'] - Temperature unit
 */
export const WeatherDetails = React.memo(function WeatherDetails({ data, unit = 'C' }) {
  if (!data || !data.current) return null;

  const current = data.current;

  // 8. Humidity
  const humidity = current.humidity !== undefined && current.humidity !== null
    ? `${current.humidity}%`
    : '--';
  const humidityNum = typeof current.humidity === 'number' ? current.humidity : 0;

  // 9. Wind Speed
  const windUnit = unit === 'F' ? 'mph' : 'kmh';
  const windSpeed = formatWindSpeed(current.windSpeed, windUnit);
  const windDirection = current.windDirection !== undefined ? current.windDirection : 0;
  const windDirectionName = current.windDirectionName || 'N';

  // 10. Visibility
  const visibility = current.visibility !== undefined && current.visibility !== null
    ? `${current.visibility} km`
    : '--';
  const visibilityStatus = current.visibilityStatus || 'Standard atmospheric clarity';

  // 11. Atmospheric Pressure
  const pressure = current.pressure !== undefined && current.pressure !== null
    ? `${current.pressure} hPa`
    : '--';
  const pressureStatus = current.pressureStatus || 'Normal barometric pressure';

  // 12. UV Index
  const uvIndex = current.uvIndex !== undefined && current.uvIndex !== null
    ? (typeof current.uvIndex === 'number' ? current.uvIndex.toFixed(1) : current.uvIndex)
    : '--';
  const uvLevel = current.uvLevel || 'Moderate';
  const uvNum = typeof current.uvIndex === 'number' ? current.uvIndex : 3;

  const getUvColorClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'level-low';
      case 'moderate': return 'level-mod';
      case 'high': return 'level-high';
      case 'very high':
      case 'extreme': return 'level-extreme';
      default: return 'level-mod';
    }
  };

  // 13 & 14. Sunrise & Sunset
  const sunrise = current.sunrise || '--';
  const sunset = current.sunset || '--';

  return (
    <section className="weather-details-section" aria-label="Detailed Weather Telemetry">
      <div className="section-header-row">
        <h3 className="section-heading">
          <Activity size={18} className="heading-icon" aria-hidden="true" />
          Atmospheric Telemetry & Solar Cycle
        </h3>
        <span className="section-caption">Real-time Open-Meteo Observations</span>
      </div>

      <div className="details-cards-grid">
        {/* 8. Humidity Card */}
        <div className="detail-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Humidity</span>
            <div className="metric-icon-badge humidity-theme">
              <Droplets size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{humidity}</span>
          </div>
          <div className="metric-footer">
            <div className="progress-track" aria-hidden="true">
              <div
                className="progress-fill humidity-fill"
                style={{ width: `${Math.min(humidityNum, 100)}%` }}
              ></div>
            </div>
            <span className="metric-subtext">
              {humidityNum > 70 ? 'High moisture level' : humidityNum < 35 ? 'Dry atmospheric air' : 'Comfortable ambient moisture'}
            </span>
          </div>
        </div>

        {/* 9. Wind Speed Card */}
        <div className="detail-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Wind Speed</span>
            <div className="metric-icon-badge wind-theme">
              <Wind size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{windSpeed}</span>
          </div>
          <div className="metric-footer">
            <div className="compass-indicator" title={`Wind direction: ${windDirectionName} (${windDirection}°)`}>
              <Compass
                size={16}
                aria-hidden="true"
                style={{
                  transform: `rotate(${windDirection}deg)`,
                  transition: 'transform 0.6s ease'
                }}
              />
              <span>{windDirectionName} ({windDirection}°)</span>
            </div>
            <span className="metric-subtext">Surface anemometer reading at 10m</span>
          </div>
        </div>

        {/* 10. Visibility Card */}
        <div className="detail-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Visibility</span>
            <div className="metric-icon-badge visibility-theme">
              <Eye size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{visibility}</span>
          </div>
          <div className="metric-footer">
            <span className="status-chip positive">{visibilityStatus}</span>
            <span className="metric-subtext">Horizontal line of sight clarity</span>
          </div>
        </div>

        {/* 11. Atmospheric Pressure Card */}
        <div className="detail-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Pressure</span>
            <div className="metric-icon-badge pressure-theme">
              <Gauge size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{pressure}</span>
          </div>
          <div className="metric-footer">
            <span className="status-chip neutral">{pressureStatus}</span>
            <span className="metric-subtext">Surface barometric pressure</span>
          </div>
        </div>

        {/* 12. UV Index Card */}
        <div className="detail-metric-card">
          <div className="card-top-row">
            <span className="metric-title">UV Index</span>
            <div className="metric-icon-badge uv-theme">
              <Sun size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="metric-body">
            <div className="uv-score-row">
              <span className="metric-number">{uvIndex}</span>
              <span className={`uv-level-pill ${getUvColorClass(uvLevel)}`}>
                {uvLevel}
              </span>
            </div>
          </div>
          <div className="metric-footer">
            <div className="progress-track" aria-hidden="true">
              <div
                className="progress-fill uv-fill"
                style={{ width: `${Math.min((uvNum / 12) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="metric-subtext">Solar ultraviolet radiation measure</span>
          </div>
        </div>

        {/* 13 & 14. Sunrise & Sunset Card */}
        <div className="detail-metric-card solar-cycle-card">
          <div className="card-top-row">
            <span className="metric-title">Sunrise & Sunset</span>
            <div className="metric-icon-badge solar-theme">
              <Sunrise size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="solar-cycle-body">
            <div className="solar-time-slot">
              <div className="solar-icon-circle sunrise-circle">
                <Sunrise size={18} className="solar-slot-icon sunrise-icon" aria-hidden="true" />
              </div>
              <div className="solar-slot-info">
                <span className="solar-slot-label">Sunrise</span>
                <span className="solar-slot-time">{sunrise}</span>
              </div>
            </div>

            <div className="solar-divider" aria-hidden="true"></div>

            <div className="solar-time-slot">
              <div className="solar-icon-circle sunset-circle">
                <Sunset size={18} className="solar-slot-icon sunset-icon" aria-hidden="true" />
              </div>
              <div className="solar-slot-info">
                <span className="solar-slot-label">Sunset</span>
                <span className="solar-slot-time">{sunset}</span>
              </div>
            </div>
          </div>
          <div className="metric-footer">
            <span className="metric-subtext">Calculated for city geographical horizon</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default WeatherDetails;
