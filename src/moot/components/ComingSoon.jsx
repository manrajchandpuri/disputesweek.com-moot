import React from "react";
import { Link } from "react-router-dom";
import { BASE } from "../mootConfig";
import { useInView } from "../hooks/useReveal";
import { usePageMeta } from "../hooks/usePageMeta";
import { Arrow, ButtonLink, Eyebrow } from "./ui";

// Shared placeholder for every page that is not ready yet, so no moot URL renders blank.
export default function ComingSoon({
  eyebrow = "In preparation",
  title = "We are preparing this page for publication.",
  body = "The Organising Committee will publish this page together with the related competition documents. Ask to be notified, and we will write to you as soon as it goes live.",
  meta,
}) {
  usePageMeta(meta || "Coming soon", body);
  const [ref, visible] = useInView();
  const lines = [100, 92, 96, 64, 0, 100, 88, 94, 70, 0, 100, 82];

  return (
    <section className="moot-section">
      <div className="moot-container moot-soon">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="moot-h1">{title}</h1>
          <hr className="moot-rule" />
          <p className="moot-lead">{body}</p>
          <div className="moot-btn-row" style={{ marginTop: 36 }}>
            <ButtonLink to={`${BASE}/registration#notify`} dot>
              Notify me
            </ButtonLink>
            <Link className="moot-btn moot-btn--outline" to={BASE}>
              <span>Return to the overview</span>
              <Arrow />
            </Link>
          </div>
        </div>
        <div ref={ref} className={`moot-doc ${visible ? "is-visible" : ""}`} aria-hidden="true">
          <div className="moot-doc__line moot-doc__line--title" />
          <div className="moot-doc__line moot-doc__line--gold" />
          {lines.map((w, i) =>
            w ? (
              <div
                key={i}
                className="moot-doc__line"
                style={{ width: `${w}%`, transitionDelay: `${120 + i * 70}ms` }}
              />
            ) : (
              <div key={i} style={{ height: 14 }} />
            )
          )}
          <span className="moot-doc__stamp">Coming soon</span>
        </div>
      </div>
    </section>
  );
}
