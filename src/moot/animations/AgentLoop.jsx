import React from "react";
import { useInView } from "../hooks/useReveal";

// Goal, Plan, Act and Observe in a loop, with a human approval gate that stays unused.
export default function AgentLoop({ still = false }) {
  const [ref, visible] = useInView();
  const play = visible && !still;
  const box = (x, y, label) => (
    <g>
      <rect x={x} y={y} width="120" height="48" fill="#FFFFFF" stroke="#E5E5E5" />
      <text x={x + 60} y={y + 29} fontSize="13" fontWeight="600" fill="#0F172A" textAnchor="middle">
        {label}
      </text>
    </g>
  );
  const loop = "M180 74 L300 74 L300 206 L180 206 L60 206 L60 74 Z";
  return (
    <svg
      ref={ref}
      className="moot-loop"
      viewBox="0 0 400 300"
      role="img"
      aria-label="An agent loop that moves from goal to plan to action to observation without a person approving any step."
    >
      <path d={loop} fill="none" stroke="#134074" strokeWidth="1.2" strokeDasharray="3 5" />
      {box(0, 50, "Goal")}
      {box(240, 50, "Plan")}
      {box(240, 182, "Act")}
      {box(0, 182, "Observe")}
      <g transform="translate(150 182)">
        <rect x="0" y="0" width="60" height="48" fill="none" stroke="#D4AF37" strokeWidth="1.4" strokeDasharray="4 3" />
        <text x="30" y="-10" fontSize="9" fontWeight="700" letterSpacing="1.6" fill="#8A6508" textAnchor="middle">
          HUMAN APPROVAL
        </text>
        <text x="30" y="70" fontSize="9" fill="#64748B" textAnchor="middle">
          not used
        </text>
      </g>
      {play ? (
        <circle r="5" fill="#D4AF37">
          <animateMotion dur="4.8s" repeatCount="2" fill="freeze" path={loop} />
        </circle>
      ) : (
        <circle cx="180" cy="74" r="5" fill="#D4AF37" />
      )}
    </svg>
  );
}
