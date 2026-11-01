import React from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';
import ForecastCard from './ForecastCard';

/**
 * Forecast Component for SKYCAST
 * Renders the 5-Day Extended Weather Forecast cards deck.
 * 
 * @param {Object} props
 * @param {Array} props.forecast - Array of forecast day objects
 * @param {'C' | 'F'} props.unit - Temperature unit
 */
export function Forecast({ forecast = [], unit = 'C' }) {
  // Guarantee exactly 5 forecast cards as requested
  const fiveDayList = forecast.slice(0, 5);

  return (
    <section className="five-day-forecast-section" aria-label="Five-Day Forecast">
      <div className="section-header-row">
        <h3 className="section-heading">
          <CalendarRange size={18} className="heading-icon" />
          5-Day Weather Outlook
        </h3>
        <span className="forecast-badge-pill">
          <Sparkles size={13} />
          High Accuracy Model
        </span>
      </div>

      <div className="five-day-cards-grid">
        {fiveDayList.map((item, idx) => (
          <ForecastCard
            key={`${item.day}-${idx}`}
            day={item.day}
            date={item.date}
            condition={item.condition}
            icon={item.icon}
            maxTemp={item.maxTemp}
            minTemp={item.minTemp}
            rainProb={item.rainProb}
            unit={unit}
          />
        ))}
      </div>
    </section>
  );
}

export default Forecast;
