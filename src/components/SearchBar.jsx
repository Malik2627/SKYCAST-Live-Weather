import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  X, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Compass,
  Sparkles
} from 'lucide-react';
import { geocodeCity } from '../services/weatherService';
import { POPULAR_CITIES } from '../utils/sampleData';

/**
 * SearchBar Component for SKYCAST (Premium Edition)
 * 
 * Features:
 * - 1-Click Current Location shortcut button inside search bar
 * - Premier "Use Current GPS Location" top suggestion in dropdown
 * - Substring match highlighting for search suggestions
 * - Duplicate submission prevention
 * - Empty search validation with visual shake
 * - Attractive empty state for zero-result queries
 * - Full ARIA keyboard accessibility (ArrowDown, ArrowUp, Enter, Escape)
 * 
 * @param {Object} props
 * @param {Function} props.onSearch - Callback with chosen city name
 * @param {Function} [props.onCurrentLocation] - Callback to detect GPS location
 * @param {boolean} [props.loading=false] - Whether weather query is loading
 * @param {boolean} [props.isLocating=false] - Whether GPS detection is active
 * @param {string} [props.currentCity=''] - Name of currently active city
 */
export function SearchBar({ 
  onSearch, 
  onCurrentLocation, 
  loading = false, 
  isLocating = false, 
  currentCity = '' 
}) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);
  const [validationError, setValidationError] = useState('');

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const geocodeAbortRef = useRef(null);

  // Debounced Open-Meteo Geocoding Autocomplete with AbortController
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setIsSearchingGeocode(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (geocodeAbortRef.current) {
      geocodeAbortRef.current.abort();
    }

    setIsSearchingGeocode(true);

    debounceTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      geocodeAbortRef.current = controller;

      try {
        const results = await geocodeCity(trimmed, 5, controller.signal);
        setSuggestions(results);
        setHighlightedIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsSearchingGeocode(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (geocodeAbortRef.current) {
        geocodeAbortRef.current.abort();
      }
    };
  }, [query]);

  // Outside click detection to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Determine current display list (live geocoding results or popular fallback)
  const isTypingQuery = query.trim().length >= 2;
  const displaySuggestions = isTypingQuery ? suggestions : POPULAR_CITIES;

  // Form submission (Enter key or button click)
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();

    // 1. Prevent Empty Search
    if (!trimmed) {
      setValidationError('Please enter a city or location name to search.');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // 2. Prevent Duplicate Submission while in-flight
    if (loading) {
      return;
    }

    // 3. Prevent Duplicate Submission if city is already actively loaded
    if (currentCity && trimmed.toLowerCase() === currentCity.toLowerCase()) {
      setValidationError(`Already viewing live weather for "${currentCity}".`);
      return;
    }

    setValidationError('');
    onSearch(trimmed);
    setIsFocused(false);
    setHighlightedIndex(-1);
  };

  // Suggestion selection
  const handleSelectCity = (cityName) => {
    if (!cityName || !cityName.trim()) return;
    const trimmed = cityName.trim();

    if (currentCity && trimmed.toLowerCase() === currentCity.toLowerCase()) {
      setValidationError(`Already viewing live weather for "${currentCity}".`);
      setIsFocused(false);
      return;
    }

    setQuery(trimmed);
    setValidationError('');
    onSearch(trimmed);
    setIsFocused(false);
    setHighlightedIndex(-1);
  };

  // Current Location Trigger from dropdown or searchbar shortcut
  const handleTriggerLocation = () => {
    if (onCurrentLocation && !isLocating) {
      setValidationError('');
      setIsFocused(false);
      onCurrentLocation();
    }
  };

  // Keyboard accessibility handler
  const handleKeyDown = (e) => {
    // Total interactive items in dropdown includes "Current Location" at index 0 when open
    const totalItems = displaySuggestions.length + (onCurrentLocation ? 1 : 0);

    if (!isFocused || totalItems === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex === 0 && onCurrentLocation) {
        e.preventDefault();
        handleTriggerLocation();
      } else {
        const cityIndex = onCurrentLocation ? highlightedIndex - 1 : highlightedIndex;
        if (cityIndex >= 0 && displaySuggestions[cityIndex]) {
          e.preventDefault();
          handleSelectCity(displaySuggestions[cityIndex].name);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsFocused(false);
      setHighlightedIndex(-1);
    }
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setValidationError('');
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Helper to highlight matching substring in suggestion names
  const renderHighlightedText = (text, matchStr) => {
    if (!matchStr || !matchStr.trim()) return text;
    const trimmedMatch = matchStr.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(trimmedMatch);
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <mark className="suggestion-match-highlight">{text.slice(idx, idx + trimmedMatch.length)}</mark>
        {text.slice(idx + trimmedMatch.length)}
      </>
    );
  };

  const isDropdownOpen = isFocused && (displaySuggestions.length > 0 || isTypingQuery || onCurrentLocation);

  return (
    <div className="search-section" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-form" role="search" noValidate>
        <div className="search-input-box">
          <Search 
            size={19} 
            className="search-input-icon" 
            aria-hidden="true" 
            onClick={() => inputRef.current?.focus()} 
          />
          <input
            ref={inputRef}
            type="text"
            className={`search-field ${validationError ? 'search-field-error' : ''}`}
            placeholder="Search city (e.g., Chennai, Bangalore, London, New York)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (validationError) {
                setValidationError('');
              }
              setIsFocused(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (validationError) {
                setValidationError('');
              }
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-controls="skycast-suggestions-list"
            aria-activedescendant={
              highlightedIndex >= 0 ? `suggestion-option-${highlightedIndex}` : undefined
            }
            aria-label="Search city name"
            aria-invalid={Boolean(validationError)}
            autoComplete="off"
          />

          {/* Current Location 1-Click Shortcut Button inside search box */}
          {onCurrentLocation && (
            <button
              type="button"
              className={`search-location-shortcut-btn ${isLocating ? 'locating' : ''}`}
              onClick={handleTriggerLocation}
              disabled={isLocating || loading}
              title="Detect and use your GPS location"
              aria-label="Use current location"
            >
              {isLocating ? (
                <Loader2 size={16} className="spinner-icon" aria-hidden="true" />
              ) : (
                <Navigation size={16} className="nav-shortcut-icon" aria-hidden="true" />
              )}
              <span className="shortcut-tooltip">Use GPS</span>
            </button>
          )}

          {isSearchingGeocode && (
            <div className="search-geocoding-spinner" title="Searching live cities...">
              <Loader2 size={16} className="spinner-icon" />
            </div>
          )}

          {query && !isSearchingGeocode && (
            <button
              type="button"
              className="search-clear-icon-btn"
              onClick={handleClear}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="search-action-btn"
          disabled={loading}
          aria-label="Submit city search"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="spinner-icon" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={16} className="btn-icon" />
              <span>Search</span>
            </>
          )}
        </button>
      </form>

      {/* Inline Validation Alert */}
      {validationError && (
        <div className="search-validation-msg" role="alert" aria-live="polite">
          <AlertCircle size={15} className="validation-icon" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Enhanced Suggestions Dropdown */}
      {isDropdownOpen && (
        <div className="search-suggestions-dropdown" role="region" aria-label="City suggestions">
          <div className="suggestions-header">
            <span>{isTypingQuery ? 'Matching Global Cities' : 'Suggested Locations'}</span>
            <span className="suggestions-hint">Press Enter to select</span>
          </div>

          <ul id="skycast-suggestions-list" className="suggestions-list" role="listbox">
            {/* Premier Top Option: GPS Location Shortcut */}
            {onCurrentLocation && (
              <li
                id="suggestion-option-0"
                className={`suggestion-item suggestion-gps-special ${highlightedIndex === 0 ? 'keyboard-active' : ''}`}
                onClick={handleTriggerLocation}
                onMouseEnter={() => setHighlightedIndex(0)}
                role="option"
                aria-selected={highlightedIndex === 0}
              >
                <div className="suggestion-left">
                  <div className="suggestion-icon-wrap icon-gps-glow">
                    {isLocating ? <Loader2 size={15} className="spinner-icon" /> : <Compass size={15} />}
                  </div>
                  <div className="suggestion-text">
                    <span className="suggestion-name gps-title">
                      {isLocating ? 'Detecting your GPS location...' : 'Use My Current GPS Location'}
                    </span>
                    <span className="suggestion-country gps-sub">
                      Detect live atmospheric telemetry automatically
                    </span>
                  </div>
                </div>
                <div className="suggestion-right">
                  <span className="suggestion-gps-pill">GPS AUTO</span>
                  <ChevronRight size={14} className="suggestion-arrow" />
                </div>
              </li>
            )}

            {/* City Suggestion Items */}
            {displaySuggestions.map((item, index) => {
              const itemIdx = onCurrentLocation ? index + 1 : index;
              const isSelected = highlightedIndex === itemIdx;
              return (
                <li
                  id={`suggestion-option-${itemIdx}`}
                  key={`${item.name}-${item.country}-${item.id || index}`}
                  className={`suggestion-item ${isSelected ? 'keyboard-active' : ''}`}
                  onClick={() => handleSelectCity(item.name)}
                  onMouseEnter={() => setHighlightedIndex(itemIdx)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="suggestion-left">
                    <div className="suggestion-icon-wrap">
                      <MapPin size={15} />
                    </div>
                    <div className="suggestion-text">
                      <span className="suggestion-name">
                        {renderHighlightedText(item.name, query)}
                      </span>
                      <span className="suggestion-country">
                        {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                      </span>
                    </div>
                  </div>
                  <div className="suggestion-right">
                    {item.admin1 && (
                      <span className="suggestion-state-pill" title="State / Administrative Region">
                        {item.admin1}
                      </span>
                    )}
                    {item.region && <span className="suggestion-region-badge">{item.region}</span>}
                    <ChevronRight size={14} className="suggestion-arrow" />
                  </div>
                </li>
              );
            })}

            {/* Zero-Results Empty State within Dropdown */}
            {isTypingQuery && displaySuggestions.length === 0 && !isSearchingGeocode && (
              <li className="suggestion-empty-state" role="status">
                <div className="empty-state-content">
                  <AlertCircle size={18} className="empty-state-icon" />
                  <div className="empty-state-text">
                    <p className="empty-state-title">No cities found matching "{query}"</p>
                    <p className="empty-state-desc">Try checking your spelling or search for a major city nearby.</p>
                  </div>
                </div>
                <div className="empty-state-chips">
                  {['London', 'Tokyo', 'Chennai', 'Paris'].map((quickCity) => (
                    <button
                      key={`empty-quick-${quickCity}`}
                      type="button"
                      className="empty-quick-chip"
                      onClick={() => handleSelectCity(quickCity)}
                    >
                      <Sparkles size={11} />
                      <span>{quickCity}</span>
                    </button>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default React.memo(SearchBar);
