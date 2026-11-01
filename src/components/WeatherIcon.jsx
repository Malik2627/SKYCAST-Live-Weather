import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Moon,
  CloudMoon,
  Wind
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherUtils';

/**
 * Animated WeatherIcon Component for SKYCAST
 * Maps WMO code or icon name to animated Lucide icons with smooth CSS micro-interactions:
 * - Sunny: Solar rotation & warmth glow
 * - Cloudy: Gentle cloud floating
 * - Rainy: Raindrop bounce & pulse
 * - Snow: Snowflake spin & icy shimmer
 * - Lightning: Thunder flash pulse
 * - Night: Crescent glow & star twinkle
 * 
 * @param {Object} props
 * @param {string} [props.icon] - Lucide icon name (e.g. 'Sun', 'CloudRain')
 * @param {number} [props.weatherCode] - WMO weather code (if icon not provided)
 * @param {boolean} [props.isDay=true] - Day/night flag
 * @param {number} [props.size=48] - Icon size in pixels
 * @param {boolean} [props.animated=true] - Whether micro-animations are enabled
 * @param {string} [props.className=''] - Additional CSS classes
 */
export function WeatherIcon({
  icon,
  weatherCode,
  isDay = true,
  size = 48,
  animated = true,
  className = ''
}) {
  // Resolve icon name from weatherCode if icon is not directly passed
  let resolvedIcon = icon;
  if (!resolvedIcon && weatherCode !== undefined) {
    const condition = getWeatherCondition(weatherCode, isDay);
    resolvedIcon = condition.icon;
  }
  if (!resolvedIcon) {
    resolvedIcon = isDay ? 'Sun' : 'Moon';
  }

  // Animation class category based on icon type
  let animationClass = '';
  if (animated) {
    switch (resolvedIcon) {
      case 'Sun':
      case 'SunMedium':
        animationClass = 'anim-weather-sun';
        break;
      case 'CloudSun':
        animationClass = 'anim-weather-cloud-sun';
        break;
      case 'CloudMoon':
        animationClass = 'anim-weather-cloud-moon';
        break;
      case 'Moon':
        animationClass = 'anim-weather-moon';
        break;
      case 'CloudRain':
      case 'CloudDrizzle':
        animationClass = 'anim-weather-rain';
        break;
      case 'CloudLightning':
        animationClass = 'anim-weather-lightning';
        break;
      case 'CloudSnow':
      case 'Snowflake':
        animationClass = 'anim-weather-snow';
        break;
      case 'CloudFog':
        animationClass = 'anim-weather-fog';
        break;
      case 'Cloud':
      default:
        animationClass = 'anim-weather-cloud';
        break;
    }
  }

  // Render matching Lucide Icon
  const iconProps = {
    size,
    className: `skycast-weather-icon ${animationClass} ${className}`.trim(),
    'aria-hidden': 'true'
  };

  switch (resolvedIcon) {
    case 'Sun':
      return <Sun {...iconProps} />;
    case 'SunMedium':
      return <SunMedium {...iconProps} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} />;
    case 'Moon':
      return <Moon {...iconProps} />;
    case 'Cloud':
      return <Cloud {...iconProps} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} />;
    case 'Wind':
      return <Wind {...iconProps} />;
    default:
      return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
  }
}

export default React.memo(WeatherIcon);

