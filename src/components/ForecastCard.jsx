import React from 'react';
import { Droplet } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemperature } from '../utils/weatherUtils';

/**
 * ForecastCard Component for SKYCAST
 * Displays individual day's forecast:
 * - Day name (e.g. "Today", "Mon", "Tue")
 * - Date (e.g. "Nov 1", "Nov 2")
 * - Animated Weather icon
 * - Weather condition description
 * - Maximum temperature
 * - Minimum temperature
 * (plus rain chance probability)
 * 
 * @param {Object} props
 * @param {string} props.day - Name of the day
 * @param {string} props.date - Formatted date string
 * @param {string} props.condition - Weather condition label
 * @param {string} props.icon - Lucide icon identifier
 * @param {number} props.maxTemp - Maximum temperature in Celsius
 * @param {number} props.minTemp - Minimum temperature in Celsius
 * @param {number} [props.rainProb] - Precipitation probability percentage
 * @param {'C' | 'F'} [props.unit='C'] - Temperature unit
 */
export const ForecastCard = React.memo(function ForecastCard({
  day,
  date,
  condition,
  icon,
  maxTemp,
  minTemp,
  rainProb,
  unit = 'C'
}) {
  const formattedMax = formatTemperature(maxTemp, unit);
  const formattedMin = formatTemperature(minTemp, unit);

  return (
    <div className="five-day-card" role="article" aria-label={`Weather forecast for ${day}, ${date}: ${condition}, High ${formattedMax}, Low ${formattedMin}`}>
      {/* 1 & 2: Day Name and Date */}
      <div className="card-day-header">
        <span className="card-day-name">{day}</span>
        <span className="card-day-date">{date}</span>
      </div>

      {/* 3 & 4: Animated Weather Icon and Condition Description */}
      <div className="card-weather-graphic">
        <div className="card-icon-halo" title={condition}>
          <WeatherIcon 
            icon={icon} 
            isDay={true} 
            size={34} 
            animated={true}
            className="card-icon-svg" 
          />
        </div>
        <span className="card-condition-label">{condition}</span>
      </div>

      {/* Precipitation probability if > 0% */}
      {rainProb !== undefined && rainProb > 0 && (
        <div className="card-rain-prob" title={`${rainProb}% rain probability`}>
          <Droplet size={12} className="rain-icon" aria-hidden="true" />
          <span>{rainProb}%</span>
        </div>
      )}

      {/* 5 & 6: Maximum and Minimum Temperatures */}
      <div className="card-temp-bracket">
        <span className="temp-peak" title="Maximum Temperature">{formattedMax}</span>
        <span className="temp-divider" aria-hidden="true">/</span>
        <span className="temp-base" title="Minimum Temperature">{formattedMin}</span>
      </div>
    </div>
  );
});

export default ForecastCard;
