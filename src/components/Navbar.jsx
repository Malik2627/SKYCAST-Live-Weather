import React from 'react';
import { CloudSun, Navigation, Loader2 } from 'lucide-react';

/**
 * Navbar Component for SKYCAST
 * Features the brand logo, application title, current location trigger, and °C/°F unit switch.
 * Fully responsive across all devices from 320px to 1920px+.
 * 
 * @param {Object} props
 * @param {'C' | 'F'} props.unit - Active temperature unit
 * @param {Function} props.onToggleUnit - Callback to toggle temperature unit
 * @param {Function} props.onCurrentLocation - Callback when 'Current Location' button is pressed
 * @param {string} [props.currentCity] - Name of currently active city
 * @param {boolean} [props.isLocating] - Whether location detection is currently in progress
 */
export function Navbar({ 
  unit = 'C', 
  onToggleUnit, 
  onCurrentLocation, 
  currentCity, 
  isLocating = false 
}) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-brand">
        <div className="brand-logo-wrap">
          <CloudSun size={26} className="brand-logo-icon" aria-hidden="true" />
          <span className="logo-glow"></span>
        </div>
        <div className="brand-text">
          <div className="brand-title-wrap">
            <h1 className="brand-name">SKYCAST</h1>
            <span className="brand-badge">PRO</span>
          </div>
          <p className="brand-tagline">LIVE WEATHER INTELLIGENCE</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Current Location Button - responsive icon + text + loading spinner */}
        <button
          type="button"
          className="nav-location-btn"
          onClick={onCurrentLocation}
          disabled={isLocating}
          title="Detect and switch to your current GPS location"
          aria-label="Current Location"
        >
          {isLocating ? (
            <Loader2 size={15} className="spinner-icon" aria-hidden="true" />
          ) : (
            <Navigation size={15} className="nav-location-icon" aria-hidden="true" />
          )}
          <span className="nav-location-text">
            {isLocating ? 'Detecting...' : 'Current Location'}
          </span>
          <span className="nav-location-text-short">
            {isLocating ? '...' : 'Location'}
          </span>
        </button>

        {/* Temperature Unit Switcher */}
        <div className="unit-toggle-pill" role="group" aria-label="Temperature unit selector">
          <button
            type="button"
            className={`unit-toggle-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={unit === 'F' ? onToggleUnit : undefined}
            aria-pressed={unit === 'C'}
            aria-label="Switch to Celsius"
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-toggle-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={unit === 'C' ? onToggleUnit : undefined}
            aria-pressed={unit === 'F'}
            aria-label="Switch to Fahrenheit"
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
