import React from "react";
import { contacts } from "../mootConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import NotifyForm from "../components/NotifyForm";
import { Arrow, Eyebrow, PageHead, Reveal, SectionHeading } from "../components/ui";

export default function Contact() {
  usePageMeta("Contact", "Contact the Organising Committee of the IIDW Moot 2027.");
  return (
    <>
      <PageHead
        eyebrow="Contact"
        title="Write to the Organising Committee, and we will reply within a few working days."
        lead="We welcome questions about eligibility, institutional participation, judging and partnership."
      />
      <section className="moot-section">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading num="01" eyebrow="Email" title="A single address reaches every member of the Organising Committee." />
          </Reveal>
          <Reveal className="moot-prose" delay={120}>
            <p>
              Please write to <a href={`mailto:${contacts.primary}`}>{contacts.primary}</a> and mention the IIDW Moot 2027
              in your subject line. We will publish separate addresses for registration, clarifications and submissions
              when each of those processes opens.
            </p>
            <div className="moot-btn-row" style={{ marginTop: 24 }}>
              <a className="moot-btn moot-btn--solid" href={`mailto:${contacts.primary}?subject=IIDW%20Moot%202027`}>
                <span>Email the Organising Committee</span>
                <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="moot-section moot-section--navy">
        <div className="moot-container moot-notify">
          <Reveal>
            <Eyebrow>Registration</Eyebrow>
            <h2 className="moot-h2">We will notify you as soon as registration opens.</h2>
            <hr className="moot-rule" />
          </Reveal>
          <Reveal delay={120}>
            <NotifyForm idPrefix="contact-notify" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
