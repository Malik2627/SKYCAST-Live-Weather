import React from 'react';
import { Loader2, Radio } from 'lucide-react';

/**
 * LoadingSpinner Component for SKYCAST
 * Features an animated multi-layered spinner with atmospheric pulse rings
 * and user-friendly live status messaging.
 * 
 * @param {Object} props
 * @param {string} [props.message='Retrieving live atmospheric telemetry...']
 * @param {string} [props.subtitle='Connecting to Open-Meteo high-resolution feed...']
 */
export function LoadingSpinner({ 
  message = 'Retrieving live atmospheric telemetry...',
  subtitle = 'Connecting to Open-Meteo satellite feed...'
}) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner-radar-orbit">
        <div className="spinner-radar-pulse"></div>
        <div className="spinner-icon-shell">
          <Loader2 size={32} className="spinner-icon-spinning" aria-hidden="true" />
        </div>
      </div>
      <div className="loading-content-wrap">
        <div className="loading-message-row">
          <Radio size={14} className="loading-pulse-dot" aria-hidden="true" />
          <h4 className="loading-text">{message}</h4>
        </div>
        {subtitle && <p className="loading-subtext">{subtitle}</p>}
      </div>
    </div>
  );
}

export default LoadingSpinner;
