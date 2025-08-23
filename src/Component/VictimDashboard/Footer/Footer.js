import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="fz-footer" role="contentinfo">
      <div className="fz-footer__top container">
        {/* Brand / About */}
        <div className="fz-col fz-col--brand">
          <div className="fz-brand">
            <span className="fz-logo" aria-hidden="true" />
            <div>
              <h4 className="fz-brand__title">SafeZone</h4>
              <p className="fz-brand__sub">Victim Management Portal</p>
            </div>
          </div>
          <p className="fz-text">
            A secure platform to report incidents, request aid, and submit
            damage claims. Built with MERN for speed, reliability, and safety.
          </p>

          <div className="fz-social" aria-label="Social links">
            <a className="fz-social__btn" href="http://www.linkedin.com/in/pasindi-alawatta-489781217" aria-label="Twitter">
              {/* twitter */}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M21.5 6.4c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.9-2.6 1.1A3.7 3.7 0 0 0 12 8.8c0 .3 0 .6.1.8-3-.1-5.7-1.6-7.5-3.9-.3.6-.5 1.2-.5 1.9 0 1.3.7 2.5 1.7 3.2-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3 3.8-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 2 2.6 3.8 2.6A7.5 7.5 0 0 1 3 18.9a10.6 10.6 0 0 0 5.7 1.7c6.9 0 10.7-5.7 10.7-10.7v-.5c.7-.5 1.3-1.1 1.8-1.8z" fill="currentColor"/>
              </svg>
            </a>
            <a className="fz-social__btn" href="http://www.linkedin.com/in/pasindi-alawatta-489781217" aria-label="GitHub">
              {/* github */}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 .8a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.3.8-.6V20c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.4-1.8-1.4-1.8-1.2-.8 0-.8 0-.8 1.3.1 2 .1 2.7 1.8 1.1 2 3 1.4 3.7 1 .1-.8.4-1.4.7-1.7-2.6-.3-5.2-1.3-5.2-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.2 1.2a10.9 10.9 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A11.2 11.2 0 0 0 12 .8z" fill="currentColor"/>
              </svg>
            </a>
            <a className="fz-social__btn" href="http://www.linkedin.com/in/pasindi-alawatta-489781217" aria-label="LinkedIn">
              {/* linkedin */}
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.1h.1c.5-1 1.8-2.1 3.7-2.1 3.9 0 4.6 2.6 4.6 6V23h-4V15.3c0-1.8 0-4-2.4-4s-2.8 1.9-2.8 3.9V23h-4V8z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="fz-col">
          <h5 className="fz-heading">Quick Links</h5>
          <ul className="fz-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/report">Report Disaster</Link></li>
            <li><Link to="/aid">Request Aid</Link></li>
            <li><Link to="/claim">Damage Claiming</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="fz-col">
          <h5 className="fz-heading">Contact</h5>
          <ul className="fz-list">
            <li><span className="fz-dot fz-dot--ok" /> support@safezone.app</li>
            <li><span className="fz-dot fz-dot--warn" /> +94 70 735 5146</li>
            <li><span className="fz-dot" /> Colombo, Sri Lanka</li>
          </ul>
        </div>

        {/* Newsletter (optional) */}
        <div className="fz-col">
          <h5 className="fz-heading">Stay informed</h5>
          <form className="fz-news" onSubmit={(e)=>e.preventDefault()}>
            <input className="fz-input" type="email" placeholder="Email address" />
            <button className="fz-btn" type="submit">Subscribe</button>
          </form>
          <p className="fz-hint">We send critical updates only. No spam.</p>
        </div>
      </div>

      <div className="fz-footer__bottom">
        <div className="container fz-bottom__inner">
          <small>© {new Date().getFullYear()} SafeZone. All rights reserved.</small>
          <div className="fz-bottom__links">
            <Link to="#" className="fz-bottom__link">Privacy</Link>
            <Link to="#" className="fz-bottom__link">Terms</Link>
            <Link to="#" className="fz-bottom__link">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
