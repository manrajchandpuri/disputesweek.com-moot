import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "./styles/moot.css";
import { BASE, assets, contacts, nav, notifyLabel, registrationStatus, showCiacAssociation } from "./mootConfig";
import { MotionContext, useMotionState } from "./hooks/useMotionPref";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function MootLayout({ assetBase = "" }) {
  const motion = useMotionState();

  return (
    <MotionContext.Provider value={motion}>
      <div className={`moot-root ${motion.still ? "is-still" : ""}`}>
        <ScrollManager />
        <a className="moot-skip" href="#moot-main">
          Skip to the main content
        </a>

        <header className="moot-header">
          <div className="moot-container moot-container--wide moot-header__bar">
            <Link className="moot-brand" to={BASE} aria-label="IIDW Moot 2027 overview, with the Chandigarh International Arbitration Centre">
                            <img src={assetBase + assets.logo} alt="India International Disputes Week" />
              {showCiacAssociation ? (
                <>
                  <span className="moot-brand__divider moot-brand__ciac" aria-hidden="true" />
                  <img className="moot-brand__ciac moot-brand__mark" src={assets.ciac.mark} alt="Chandigarh International Arbitration Centre" />
                </>
              ) : null}
              <span className="moot-brand__divider moot-brand__divider--label" aria-hidden="true" />
              <span className="moot-brand__label">
                <strong>Moot 2027</strong>
                <span>International Commercial Arbitration</span>
              </span>
            </Link>
            <div className="moot-header__actions">
              <a className="moot-header__back" href="/">
                Visit IIDW 2027
              </a>
              <Link className="moot-btn moot-btn--outline" to={`${BASE}/registration#notify`}>
                <span className="moot-btn__dot" aria-hidden="true" />
                <span>{registrationStatus === "open" ? "Register" : "Notify me"}</span>
              </Link>
            </div>
          </div>
          <nav className="moot-subnav" aria-label="Moot sections">
            <div className="moot-container moot-container--wide">
              <ul>
                {nav.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </header>

        <main id="moot-main">
          <Outlet />
        </main>

        <Link className="moot-tab" to={`${BASE}/registration#notify`}>
          {registrationStatus === "open" ? "Register your team" : "Notify me"}
        </Link>

        <footer className="moot-footer">
          <div className="moot-container">
            <div className="moot-footer__grid">
              <div>
                <h2>IIDW International Commercial Arbitration Moot 2027</h2>
                <p>
                  {showCiacAssociation
                    ? "The India International Disputes Week organises this competition with the Chandigarh International Arbitration Centre as part of its second edition in Chandigarh in January 2027."
                    : "The India International Disputes Week organises this competition as part of its second edition in Chandigarh in January 2027."}
                </p>
                <p>
                  Write to us at <a href={`mailto:${contacts.primary}`}>{contacts.primary}</a>, and we will reply
                  within a few working days.
                </p>
              </div>
              <div>
                <h3>The competition</h3>
                <ul>
                  {nav.slice(1).map((item) => (
                    <li key={item.to}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Coming soon</h3>
                <ul>
                  <li>
                    <Link to={`${BASE}/rules`}>Rules of the Competition</Link>
                  </li>
                  <li>
                    <Link to={`${BASE}/clarifications`}>Clarifications</Link>
                  </li>
                  <li>
                    <Link to={`${BASE}/submissions`}>Memorandum submissions</Link>
                  </li>
                  <li>
                    <Link to={`${BASE}/registration#notify`}>{notifyLabel()}</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="moot-footer__base">
              <span>India International Disputes Week, Chandigarh, 2027</span>
              <button type="button" className="moot-motion-toggle" onClick={() => motion.setStill(!motion.userStill)}>
                {motion.userStill ? "View with animation" : "View without animation"}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </MotionContext.Provider>
  );
}
