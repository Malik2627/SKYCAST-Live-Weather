import React from 'react';
import { History, Trash2, ArrowUpRight, X, Sparkles } from 'lucide-react';

/**
 * RecentSearches Component for SKYCAST
 * Displays recently searched cities with 1-click recall, active city highlight,
 * individual chip removal, clear all history, and attractive empty state.
 * 
 * @param {Object} props
 * @param {string[]} props.searches - Array of up to 5 recently searched city names
 * @param {Function} props.onSelect - Callback when a city chip is chosen
 * @param {Function} [props.onClear] - Callback to clear entire history
 * @param {Function} [props.onRemoveCity] - Optional callback to remove a single city
 * @param {string} [props.currentCity] - Name of currently active city
 */
export function RecentSearches({ 
  searches = [], 
  onSelect, 
  onClear, 
  onRemoveCity,
  currentCity = '' 
}) {
  const displayList = (searches || []).slice(0, 5);

  // Attractive Empty State
  if (displayList.length === 0) {
    return (
      <div className="recent-searches-empty" aria-label="Recent search history empty">
        <div className="empty-history-icon-shell">
          <History size={14} className="empty-history-icon" aria-hidden="true" />
        </div>
        <span className="empty-history-text">
          Searched locations will appear here for fast 1-click access.
        </span>
      </div>
    );
  }

  return (
    <div className="recent-searches-bar" aria-label="Recent Searches">
      <div className="recent-title">
        <History size={14} className="recent-icon" aria-hidden="true" />
        <span>Recent:</span>
      </div>

      <div className="recent-chips" role="list">
        {displayList.map((city, idx) => {
          const isActive = currentCity && city.toLowerCase() === currentCity.toLowerCase();
          return (
            <div
              key={`${city}-${idx}`}
              className={`recent-chip-wrap ${isActive ? 'active-chip-wrap' : ''}`}
              role="listitem"
            >
              <button
                type="button"
                className={`recent-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(city)}
                aria-label={`Load weather for ${city}${isActive ? ' (currently active)' : ''}`}
                aria-current={isActive ? 'location' : undefined}
              >
                {isActive && <Sparkles size={11} className="active-chip-sparkle" aria-hidden="true" />}
                <span className="chip-label">{city}</span>
                <ArrowUpRight size={11} className="chip-arrow" aria-hidden="true" />
              </button>

              {onRemoveCity && (
                <button
                  type="button"
                  className="recent-chip-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveCity(city);
                  }}
                  title={`Remove ${city} from history`}
                  aria-label={`Remove ${city} from recent searches`}
                >
                  <X size={11} aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {onClear && (
        <button
          type="button"
          className="recent-clear-btn"
          onClick={onClear}
          title="Clear search history"
          aria-label="Clear all recent searches"
        >
          <Trash2 size={12} className="clear-icon" aria-hidden="true" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}

export default React.memo(RecentSearches);
