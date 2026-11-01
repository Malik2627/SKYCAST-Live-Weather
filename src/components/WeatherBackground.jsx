import React, { useMemo } from 'react';

/**
 * Dynamic Weather Background & Atmospheric Particle Canvas Component for SKYCAST
 * 
 * Themes:
 * - 'sunny': Warm golden amber gradient with solar rays
 * - 'cloudy': Cool grey-blue gradient with soft drifting cloud mist
 * - 'rainy': Deep blue gradient with gentle falling rain streaks
 * - 'snow': Light icy cyan gradient with drifting crystal snowflakes
 * - 'night': Dark navy gradient with twinkling celestial stars
 * 
 * Hardware-accelerated, zero-dependency, pure CSS transforms.
 * 
 * @param {Object} props
 * @param {'sunny' | 'cloudy' | 'rainy' | 'snow' | 'night'} [props.theme='night']
 * @param {boolean} [props.isDay=true]
 */
export function WeatherBackground({ theme = 'night', isDay = true }) {
  // Generate random positions for atmospheric particles (deterministic per theme)
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, idx) => ({
      id: idx,
      left: `${(idx * 7.1 + 4.5) % 95}%`,
      top: `${(idx * 8.3 + 2) % 90}%`,
      delay: `${(idx * 0.45).toFixed(2)}s`,
      duration: `${(2.8 + (idx % 4) * 0.8).toFixed(1)}s`,
      size: `${12 + (idx % 3) * 6}px`
    }));
  }, []);

  return (
    <div 
      className={`dynamic-weather-bg theme-${theme}`} 
      aria-hidden="true" 
      data-theme={theme}
    >
      {/* Dynamic Ambient Glow Orbs */}
      <div className="ambient-bg-glow glow-top-left"></div>
      <div className="ambient-bg-glow glow-top-right"></div>
      <div className="ambient-bg-glow glow-center-bottom"></div>
      <div className="ambient-bg-glow glow-accent-radial"></div>

      {/* Atmospheric Weather Particles Overlay */}
      <div className="weather-particles-container">
        {theme === 'sunny' && (
          <div className="sunbeam-halo-wrapper">
            <div className="sunbeam-core"></div>
            <div className="sunbeam-ray ray-1"></div>
            <div className="sunbeam-ray ray-2"></div>
            <div className="sunbeam-ray ray-3"></div>
          </div>
        )}

        {theme === 'cloudy' && (
          <div className="cloud-mist-wrapper">
            <div className="cloud-mist-puff puff-1"></div>
            <div className="cloud-mist-puff puff-2"></div>
            <div className="cloud-mist-puff puff-3"></div>
          </div>
        )}

        {theme === 'rainy' && (
          <div className="rain-streaks-wrapper">
            {particles.map((p) => (
              <span
                key={`rain-${p.id}`}
                className="rain-streak"
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration
                }}
              />
            ))}
          </div>
        )}

        {theme === 'snow' && (
          <div className="snow-flakes-wrapper">
            {particles.map((p) => (
              <span
                key={`snow-${p.id}`}
                className="snow-flake"
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: `${parseFloat(p.duration) + 2}s`,
                  width: p.size,
                  height: p.size
                }}
              />
            ))}
          </div>
        )}

        {theme === 'night' && (
          <div className="night-stars-wrapper">
            {particles.map((p) => (
              <span
                key={`star-${p.id}`}
                className="night-star"
                style={{
                  left: p.left,
                  top: p.top,
                  animationDelay: p.delay,
                  animationDuration: p.duration
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(WeatherBackground);

