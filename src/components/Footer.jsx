import React from 'react';
import { CloudSun, Globe, ShieldCheck } from 'lucide-react';

/**
 * Footer Component for SKYCAST
 * Features brand signature, live status, and Open-Meteo Weather API attribution.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="skycast-footer">
      <div className="footer-top-divider"></div>
      
      <div className="footer-content-wrap">
        <div className="footer-brand-side">
          <div className="footer-logo-row">
            <div className="footer-icon-pill">
              <CloudSun size={18} />
            </div>
            <span className="footer-brand-name">SKYCAST</span>
            <span className="footer-version-tag">v2.4.0</span>
          </div>
          <p className="footer-description">
            Next-generation atmospheric telemetry & live forecasting dashboard.
          </p>
        </div>

        <div className="footer-meta-side">
          <div className="api-attribution-pill">
            <Globe size={14} className="attribution-icon" />
            <span>
              Weather telemetry architecture powered by{' '}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="attribution-link"
              >
                Open-Meteo Weather API
              </a>
            </span>
          </div>
          <div className="footer-copyright">
            <ShieldCheck size={13} className="shield-icon" />
            <span>&copy; {currentYear} SKYCAST Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
