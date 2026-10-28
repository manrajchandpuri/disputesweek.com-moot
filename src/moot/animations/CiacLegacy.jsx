import React from "react";
import IIDW from "./iidw";

// The Claude Design CIAC legacy section. Without an official logo it shows a plain
// text wordmark, and it never draws a logo of its own.
const { LegacySection } = IIDW.legacy.react(React);

export default function CiacLegacy({ eyebrow, heading, paragraphs, ruleHeadings, seal, timeline, logoSrc, reducedMotion }) {
  return (
    <LegacySection
      eyebrow={eyebrow}
      heading={heading}
      paragraphs={paragraphs}
      rules={ruleHeadings}
      sealText={seal}
      timeline={timeline}
      logoSrc={logoSrc || undefined}
      reducedMotion={reducedMotion}
    />
  );
}
