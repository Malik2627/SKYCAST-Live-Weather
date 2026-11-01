import React from 'react';
import { Droplets, Wind, Eye, Gauge, Sun, Compass, Activity } from 'lucide-react';
import { formatWindSpeed } from '../utils/weatherUtils';

/**
 * WeatherHighlights Component for SKYCAST
 * Displays the 5 required weather highlights:
 * 1. Humidity
 * 2. Wind Speed
 * 3. Visibility
 * 4. Pressure
 * 5. UV Index
 * 
 * @param {Object} props
 * @param {Object} props.data - Current city weather data object
 */
export const WeatherHighlights = React.memo(function WeatherHighlights({ data }) {
  if (!data || !data.current) return null;

  const current = data.current;

  // Determine UV color style
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

  return (
    <section className="highlights-container" aria-label="Weather Highlights">
      <div className="section-header-row">
        <h3 className="section-heading">
          <Activity size={18} className="heading-icon" />
          Today's Weather Highlights
        </h3>
        <span className="section-caption">Real-time Atmospheric Telemetry</span>
      </div>

      <div className="highlights-card-grid">
        {/* 1. Humidity Card */}
        <div className="highlight-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Humidity</span>
            <div className="metric-icon-badge humidity-theme">
              <Droplets size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.humidity}%</span>
          </div>
          <div className="metric-footer">
            <div className="progress-track">
              <div 
                className="progress-fill humidity-fill" 
                style={{ width: `${current.humidity}%` }}
              ></div>
            </div>
            <span className="metric-subtext">The dew point is {Math.round(current.temperature * 0.7)}°C right now</span>
          </div>
        </div>

        {/* 2. Wind Speed Card */}
        <div className="highlight-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Wind Speed</span>
            <div className="metric-icon-badge wind-theme">
              <Wind size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{formatWindSpeed(current.windSpeed, 'kmh')}</span>
          </div>
          <div className="metric-footer">
            <div className="compass-indicator">
              <Compass 
                size={16} 
                style={{ 
                  transform: `rotate(${current.windDirection}deg)`, 
                  transition: 'transform 0.6s ease' 
                }} 
              />
              <span>{current.windDirectionName} ({current.windDirection}°)</span>
            </div>
            <span className="metric-subtext">Gentle, steady breeze</span>
          </div>
        </div>

        {/* 3. Visibility Card */}
        <div className="highlight-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Visibility</span>
            <div className="metric-icon-badge visibility-theme">
              <Eye size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.visibility} <small className="unit-label">km</small></span>
          </div>
          <div className="metric-footer">
            <span className="status-chip positive">{current.visibilityStatus}</span>
            <span className="metric-subtext">Full horizon clarity</span>
          </div>
        </div>

        {/* 4. Pressure Card */}
        <div className="highlight-metric-card">
          <div className="card-top-row">
            <span className="metric-title">Pressure</span>
            <div className="metric-icon-badge pressure-theme">
              <Gauge size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-number">{current.pressure} <small className="unit-label">hPa</small></span>
          </div>
          <div className="metric-footer">
            <span className="status-chip neutral">{current.pressureStatus}</span>
            <span className="metric-subtext">Standard atmospheric barometry</span>
          </div>
        </div>

        {/* 5. UV Index Card */}
        <div className="highlight-metric-card">
          <div className="card-top-row">
            <span className="metric-title">UV Index</span>
            <div className="metric-icon-badge uv-theme">
              <Sun size={20} />
            </div>
          </div>
          <div className="metric-body">
            <div className="uv-score-row">
              <span className="metric-number">{current.uvIndex}</span>
              <span className={`uv-level-pill ${getUvColorClass(current.uvLevel)}`}>
                {current.uvLevel}
              </span>
            </div>
          </div>
          <div className="metric-footer">
            <div className="progress-track">
              <div 
                className="progress-fill uv-fill" 
                style={{ width: `${Math.min((current.uvIndex / 12) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="metric-subtext">Sun protection recommended at midday</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default WeatherHighlights;
