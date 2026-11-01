import React, { useState } from 'react';
import { 
  AlertTriangle, 
  WifiOff, 
  MapPinOff, 
  Clock, 
  ShieldAlert, 
  RefreshCw, 
  X,
  HelpCircle
} from 'lucide-react';
import { ERROR_CODES } from '../services/weatherService';

/**
 * ErrorMessage Component for SKYCAST
 * Displays empathetic, human-friendly error messages without exposing technical stack traces.
 * Features contextual icons, actionable advice, and an animated Retry button.
 * 
 * @param {Object} props
 * @param {string|Object} props.message - Error message string or error descriptor object
 * @param {string} [props.title] - Optional custom title
 * @param {string} [props.code] - Error code classification
 * @param {Function} [props.onRetry] - Callback to retry the failed operation
 * @param {Function} [props.onDismiss] - Optional callback to dismiss the banner
 */
export function ErrorMessage({ 
  message, 
  title, 
  code, 
  onRetry, 
  onDismiss 
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!message) return null;

  // Extract clean text message
  const textMessage = typeof message === 'string' ? message : message.message;
  const lowerMsg = textMessage.toLowerCase();

  // Determine error code if not explicitly passed
  let resolvedCode = code || (typeof message === 'object' ? message.code : null);
  if (!resolvedCode) {
    if (lowerMsg.includes('internet') || lowerMsg.includes('network') || lowerMsg.includes('connection')) {
      resolvedCode = ERROR_CODES.OFFLINE;
    } else if (lowerMsg.includes('not found') || lowerMsg.includes('matching location') || lowerMsg.includes('check the spelling')) {
      resolvedCode = ERROR_CODES.INVALID_CITY;
    } else if (lowerMsg.includes('timed out') || lowerMsg.includes('timeout')) {
      resolvedCode = ERROR_CODES.TIMEOUT;
    } else if (lowerMsg.includes('permission denied')) {
      resolvedCode = ERROR_CODES.GEOLOCATION_DENIED;
    } else if (lowerMsg.includes('temporarily unavailable') || lowerMsg.includes('server')) {
      resolvedCode = ERROR_CODES.SERVER_ERROR;
    } else if (lowerMsg.includes('incomplete') || lowerMsg.includes('unavailable')) {
      resolvedCode = ERROR_CODES.MISSING_DATA;
    } else {
      resolvedCode = ERROR_CODES.UNKNOWN;
    }
  }

  // Derive title, icon, and contextual tip
  let errorIcon = <AlertTriangle size={24} className="error-icon" aria-hidden="true" />;
  let defaultTitle = 'Unable to Load Weather Data';
  let tipText = 'You can retry or search for another global city using the search bar above.';

  switch (resolvedCode) {
    case ERROR_CODES.INVALID_CITY:
      errorIcon = <MapPinOff size={24} className="error-icon error-icon-mappin" aria-hidden="true" />;
      defaultTitle = 'Location Not Found';
      tipText = 'Check for spelling mistakes, try adding a country name, or choose from popular cities below.';
      break;

    case ERROR_CODES.EMPTY_SEARCH:
      errorIcon = <HelpCircle size={24} className="error-icon" aria-hidden="true" />;
      defaultTitle = 'City Name Required';
      tipText = 'Type a city name such as "Chennai", "London", or "New York" to view live telemetry.';
      break;

    case ERROR_CODES.OFFLINE:
      errorIcon = <WifiOff size={24} className="error-icon error-icon-offline" aria-hidden="true" />;
      defaultTitle = 'No Internet Connection';
      tipText = 'Please check your Wi-Fi, Ethernet, or mobile data connection and try again.';
      break;

    case ERROR_CODES.TIMEOUT:
      errorIcon = <Clock size={24} className="error-icon error-icon-timeout" aria-hidden="true" />;
      defaultTitle = 'Connection Request Timed Out';
      tipText = 'The server took too long to respond. This usually resolves quickly—tap Try Again.';
      break;

    case ERROR_CODES.SERVER_ERROR:
      errorIcon = <AlertTriangle size={24} className="error-icon error-icon-server" aria-hidden="true" />;
      defaultTitle = 'Weather Service Temporarily Unavailable';
      tipText = 'The Open-Meteo telemetry servers are momentarily busy. Please try again shortly.';
      break;

    case ERROR_CODES.MISSING_DATA:
      errorIcon = <AlertTriangle size={24} className="error-icon" aria-hidden="true" />;
      defaultTitle = 'Incomplete Weather Telemetry';
      tipText = 'Telemetry is partially unavailable for this coordinate. Please select an adjacent city.';
      break;

    case ERROR_CODES.GEOLOCATION_DENIED:
      errorIcon = <ShieldAlert size={24} className="error-icon error-icon-geo" aria-hidden="true" />;
      defaultTitle = 'Location Permission Denied';
      tipText = 'Click the lock icon in your browser address bar to allow location permissions, or use manual search.';
      break;

    default:
      errorIcon = <AlertTriangle size={24} className="error-icon" aria-hidden="true" />;
      defaultTitle = 'Weather Data Unavailable';
      tipText = 'An unexpected error occurred. Tap Try Again or search for another city.';
      break;
  }

  const finalTitle = title || defaultTitle;

  const handleRetryClick = async () => {
    if (!onRetry || isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={`error-banner error-type-${resolvedCode.toLowerCase()}`} role="alert" aria-live="assertive">
      <div className="error-icon-column">
        <div className="error-icon-wrap">
          {errorIcon}
        </div>
      </div>

      <div className="error-content">
        <div className="error-header-row">
          <h4 className="error-title">{finalTitle}</h4>
          {onDismiss && (
            <button 
              type="button" 
              className="error-dismiss-btn" 
              onClick={onDismiss}
              aria-label="Dismiss error notification"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className="error-description">{textMessage}</p>
        <p className="error-tip-text">
          <span className="error-tip-badge">SUGGESTION:</span> {tipText}
        </p>
      </div>

      {onRetry && (
        <div className="error-action-wrap">
          <button 
            type="button" 
            className={`error-retry-btn ${isRetrying ? 'loading' : ''}`}
            onClick={handleRetryClick}
            disabled={isRetrying}
            aria-label="Retry weather request"
          >
            <RefreshCw size={15} className={isRetrying ? 'spinner-icon' : 'retry-icon'} />
            <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ErrorMessage;
