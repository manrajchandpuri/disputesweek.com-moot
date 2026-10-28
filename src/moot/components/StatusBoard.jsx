import React from "react";
import { statusBoard } from "../mootConfig";
import { Reveal, StatusPill } from "./ui";

export default function StatusBoard({ rows = statusBoard }) {
  return (
    <div className="moot-status" role="list" aria-label="Status of the competition">
      {rows.map((row, i) => (
        <Reveal key={row.item} className="moot-status__row" role="listitem" delay={i * 90}>
          <span className="moot-status__item">{row.item}</span>
          <span className="moot-status__detail">{row.detail}</span>
          <StatusPill state={row.state} />
        </Reveal>
      ))}
    </div>
  );
}
