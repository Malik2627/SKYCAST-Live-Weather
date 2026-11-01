import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * WeatherSkeleton Component for SKYCAST
 * Provides an ultra-modern glassmorphic skeleton loading state matching the dashboard layout:
 * - Animated loading spinner with live status message
 * - Main Weather Card skeleton
 * - 6 Weather Highlight Details skeleton cards
 * - 5-Day Forecast skeleton cards
 * 
 * Prevents blank screens and eliminates layout shift while telemetry is being fetched.
 * 
 * @param {Object} props
 * @param {string} [props.message='Retrieving live atmospheric telemetry from Open-Meteo...']
 */
export function WeatherSkeleton({ message = 'Retrieving live atmospheric telemetry from Open-Meteo...' }) {
  return (
    <div className="weather-skeleton-wrapper" role="status" aria-label="Loading weather telemetry">
      {/* Dynamic Animated Spinner & Loading Message Header */}
      <LoadingSpinner message={message} />

      {/* Main Weather Card Skeleton */}
      <div className="main-weather-card skeleton-card">
        <div className="skeleton-main-header">
          <div className="skeleton-box skeleton-title-pill"></div>
          <div className="skeleton-box skeleton-badge-pill"></div>
        </div>

        <div className="skeleton-main-body">
          <div className="skeleton-temp-wrap">
            <div className="skeleton-box skeleton-huge-temp"></div>
            <div className="skeleton-box skeleton-condition-pill"></div>
          </div>
          <div className="skeleton-box skeleton-icon-circle"></div>
        </div>

        <div className="skeleton-main-footer">
          <div className="skeleton-box skeleton-meta-chip"></div>
          <div className="skeleton-box skeleton-meta-chip"></div>
          <div className="skeleton-box skeleton-meta-chip"></div>
        </div>
      </div>

      {/* Weather Highlights / Details Skeleton Grid (6 cards) */}
      <div className="weather-details-section">
        <div className="details-header-wrap">
          <div className="skeleton-box skeleton-section-heading"></div>
        </div>

        <div className="details-grid">
          {/* Card 1: Humidity Skeleton */}
          <div className="detail-card skeleton-card">
            <div className="skeleton-card-top">
              <div className="skeleton-box skeleton-icon-sm"></div>
              <div className="skeleton-box skeleton-line-sm"></div>
            </div>
            <div className="skeleton-card-middle">
              <div className="skeleton-box skeleton-gauge-circle"></div>
            </div>
            <div className="skeleton-card-bottom">
              <div className="skeleton-box skeleton-line-full"></div>
            </div>
          </div>

          {/* Card 2: Wind Speed Skeleton */}
          <div className="detail-card skeleton-card">
            <div className="skeleton-card-top">
              <div className="skeleton-box skeleton-icon-sm"></div>
              <div className="skeleton-box skeleton-line-sm"></div>
            </div>
            <div className="skeleton-card-middle">
              <div className="skeleton-box skeleton-metric-lg"></div>
              <div className="skeleton-box skeleton-compass-circle"></div>
            </div>
            <div className="skeleton-card-bottom">
              <div className="skeleton-box skeleton-line-full"></div>
            </div>
          </div>

          {/* Card 3: Visibility Skeleton */}
          <div className="detail-card skeleton-card">
            <div className="skeleton-card-top">
              <div className="skeleton-box skeleton-icon-sm"></div>
              <div className="skeleton-box skeleton-line-sm"></div>
            </div>
            <div className="skeleton-card-middle">
              <div className="skeleton-box skeleton-metric-lg"></div>
            </div>
            <div className="skeleton-card-bottom">
              <div className="skeleton-box skeleton-line-full"></div>
            </div>
          </div>

          {/* Card 4: Pressure Skeleton */}
          <div className="detail-card skeleton-card">
            <div className="skeleton-card-top">
              <div className="skeleton-box skeleton-icon-sm"></div>
              <div className="skeleton-box skeleton-line-sm"></div>
            </div>
            <div className="skeleton-card-middle">
              <div className="skeleton-box skeleton-metric-lg"></div>
            </div>
            <div className="skeleton-card-bottom">
              <div className="skeleton-box skeleton-line-full"></div>
            </div>
          </div>

          {/* Card 5: UV Index Skeleton */}
          <div className="detail-card skeleton-card">
            <div className="skeleton-card-top">
              <div className="skeleton-box skeleton-icon-sm"></div>
              <div className="skeleton-box skeleton-line-sm"></div>
            </div>
            <div className="skeleton-card-middle">
              <div className="skeleton-box skeleton-metric-lg"></div>
            </div>
            <div className="skeleton-card-bottom">
              <div className="skeleton-box skeleton-line-full"></div>
            </div>
          </div>

          {/* Card 6: Solar Sunrise/Sunset Skeleton */}
          <div className="detail-card skeleton-card">
            <div className="skeleton-card-top">
              <div className="skeleton-box skeleton-icon-sm"></div>
              <div className="skeleton-box skeleton-line-sm"></div>
            </div>
            <div className="skeleton-solar-dual">
              <div className="skeleton-box skeleton-solar-slot"></div>
              <div className="skeleton-box skeleton-solar-slot"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Five-Day Forecast Skeleton Grid */}
      <div className="forecast-section">
        <div className="forecast-header">
          <div className="skeleton-box skeleton-section-heading"></div>
        </div>

        <div className="forecast-cards-grid">
          {[1, 2, 3, 4, 5].map((dayIdx) => (
            <div key={`forecast-skeleton-${dayIdx}`} className="forecast-card skeleton-card">
              <div className="skeleton-box skeleton-forecast-day"></div>
              <div className="skeleton-box skeleton-forecast-date"></div>
              <div className="skeleton-box skeleton-forecast-icon"></div>
              <div className="skeleton-box skeleton-forecast-bar"></div>
              <div className="skeleton-box skeleton-forecast-condition"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;

