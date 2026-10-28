import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IIDW from "./iidw";

// The Claude Design film, adapted to the moot site. The export renders plain links, so
// clicks on links inside /moot are handed to the router instead of reloading the page.
const { MootHero } = IIDW.hero.react(React);

export default function StoryHero({ captions, eyebrow, headline, lead, primaryCta, secondaryCta, reducedMotion, onComplete }) {
  const navigate = useNavigate();

  const onClickCapture = useCallback(
    (event) => {
      const link = event.target.closest && event.target.closest("a[href]");
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      const href = link.getAttribute("href");
      if (href && href.startsWith("/")) {
        event.preventDefault();
        navigate(href);
      }
    },
    [navigate]
  );

  return (
    <div className="moot-film" onClickCapture={onClickCapture}>
      <MootHero
        captions={captions}
        eyebrow={eyebrow}
        headline={headline}
        lead={lead}
        primaryCta={{ label: primaryCta.label, href: primaryCta.to || primaryCta.href }}
        secondaryCta={{ label: secondaryCta.label, href: secondaryCta.to || secondaryCta.href }}
        reducedMotion={reducedMotion}
        onComplete={onComplete}
      />
    </div>
  );
}
