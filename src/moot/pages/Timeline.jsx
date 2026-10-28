import React from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import RiverTimeline from "../components/RiverTimeline";
import { PageHead, Reveal } from "../components/ui";

export default function Timeline() {
  usePageMeta("Timeline", "The tentative timeline of the IIDW Moot 2027, from the release of the proposition to the oral rounds in January 2027.");
  return (
    <>
      <PageHead
        eyebrow="Timeline"
        title="The competition unfolds in four phases between November 2026 and January 2027."
        lead="We show each phase by month while the Organising Committee finalises the schedule. The Rules of the Competition will fix the exact dates, and we will update this page when they do."
      />
      <section className="moot-section">
        <div className="moot-container">
          <Reveal>
            <RiverTimeline />
          </Reveal>
        </div>
      </section>
    </>
  );
}
