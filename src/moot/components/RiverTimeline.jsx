import React, { useEffect, useRef, useState } from "react";
import { phases } from "../mootConfig";
import { StatusPill } from "./ui";
import { useMotion } from "../hooks/useMotionPref";

// A vertical river line that grows as the reader scrolls past each phase.
export default function RiverTimeline({ items = phases, compact = false }) {
  const listRef = useRef(null);
  const { still } = useMotion();
  const [progress, setProgress] = useState(still ? 1 : 0);
  const [passed, setPassed] = useState(still ? items.length : 0);

  useEffect(() => {
    if (still) {
      setProgress(1);
      setPassed(items.length);
      return undefined;
    }
    const list = listRef.current;
    if (!list) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = list.getBoundingClientRect();
      const anchor = window.innerHeight * 0.7;
      const value = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      setProgress(value);
      const nodes = list.querySelectorAll(".moot-timeline__item");
      let count = 0;
      nodes.forEach((node) => {
        if (node.getBoundingClientRect().top + 12 < anchor) count += 1;
      });
      setPassed(count);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [still, items.length]);

  return (
    <ol ref={listRef} className={`moot-timeline ${compact ? "moot-timeline--compact" : ""}`}>
      <span className="moot-timeline__spine" aria-hidden="true">
        <span style={{ "--progress": progress }} />
      </span>
      {items.map((p, i) => (
        <li
          key={p.phase}
          className={`moot-timeline__item ${i < passed ? "is-passed" : ""} ${
            i === items.length - 1 ? "moot-timeline__item--final" : ""
          }`}
        >
          <span className="moot-timeline__node" aria-hidden="true" />
          <div className="moot-timeline__head">
            <span className="moot-timeline__phase">{p.phase}</span>
            <span className="moot-timeline__month">{p.month}</span>
            <StatusPill state={p.tentative ? "tentative" : "confirmed"} />
          </div>
          <h3 className="moot-h3">{p.title}</h3>
          {compact ? null : (
            <ul>
              {p.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
