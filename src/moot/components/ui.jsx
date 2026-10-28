import React from "react";
import { Link } from "react-router-dom";
import { useInView } from "../hooks/useReveal";

export function Eyebrow({ num, children }) {
  return (
    <p className="moot-eyebrow">
      {num ? (
        <>
          <span className="moot-eyebrow__num">{num}</span>
          <span className="moot-eyebrow__dot" aria-hidden="true" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({ num, eyebrow, title, lead, as: Tag = "h2" }) {
  return (
    <div className="moot-sectionhead">
      {eyebrow ? <Eyebrow num={num}>{eyebrow}</Eyebrow> : null}
      <Tag className={Tag === "h1" ? "moot-h1" : "moot-h2"}>{title}</Tag>
      <hr className="moot-rule" />
      {lead ? <p className="moot-lead">{lead}</p> : null}
    </div>
  );
}

const PILL_LABEL = { confirmed: "Confirmed", tentative: "Tentative", soon: "Coming soon" };

export function StatusPill({ state }) {
  return <span className={`moot-pill moot-pill--${state}`}>{PILL_LABEL[state]}</span>;
}

export function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const [ref, visible] = useInView();
  return (
    <Tag
      ref={ref}
      className={`moot-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function RiverDivider() {
  const [ref, visible] = useInView();
  return (
    <svg
      ref={ref}
      className={`moot-river ${visible ? "is-visible" : ""}`}
      viewBox="0 0 1024 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 12 C 120 4, 220 20, 340 12 S 560 4, 680 12 S 900 20, 1024 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="512" cy="12" r="4" fill="#D4AF37" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg className="moot-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ButtonLink({ to, href, variant = "solid", dot = false, children, ...rest }) {
  const className = `moot-btn moot-btn--${variant}`;
  const inner = (
    <>
      {dot ? <span className="moot-btn__dot" aria-hidden="true" /> : null}
      <span>{children}</span>
      <Arrow />
    </>
  );
  if (href) {
    return (
      <a className={className} href={href} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={className} to={to} {...rest}>
      {inner}
    </Link>
  );
}

export function PageHead({ eyebrow, title, lead, pills }) {
  return (
    <header className="moot-pagehead">
      <div className="moot-container">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="moot-h1">{title}</h1>
          {lead ? <p className="moot-lead">{lead}</p> : null}
          {pills ? <div className="moot-pagehead__meta">{pills}</div> : null}
        </Reveal>
      </div>
    </header>
  );
}

export const Icon = {
  scales: (
    <svg className="moot-card__icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M14 4v20M8 24h12M5 8h18M5 8l-3 8h6l-3-8zM23 8l-3 8h6l-3-8z" />
    </svg>
  ),
  agent: (
    <svg className="moot-card__icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" />
      <rect x="16" y="4" width="8" height="8" />
      <rect x="4" y="16" width="8" height="8" />
      <rect x="16" y="16" width="8" height="8" />
      <path d="M12 8h4M20 12v4M16 20h-4M8 16v-4" />
    </svg>
  ),
  river: (
    <svg className="moot-card__icon" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M2 9c4-3 8 3 12 0s8-3 12 0M2 15c4-3 8 3 12 0s8-3 12 0M2 21c4-3 8 3 12 0s8-3 12 0" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z" />
      <circle cx="8" cy="6.5" r="1.8" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" />
      <path d="M2 6.5h12M5 1.5v3M11 1.5v3" />
    </svg>
  ),
  gavel: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M6 2l5 5M4 4l5 5M3.5 6.5l4-4M7.5 10.5l4-4M8 8l6 6M2 14h6" />
    </svg>
  ),
};
