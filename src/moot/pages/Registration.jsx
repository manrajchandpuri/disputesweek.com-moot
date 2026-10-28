import React from "react";
import { contacts, registrationStatus } from "../mootConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import NotifyForm from "../components/NotifyForm";
import { Eyebrow, PageHead, Reveal, SectionHeading, StatusPill } from "../components/ui";

const STAGES = [
  {
    num: "Stage 1",
    title: "Provisional registration",
    when: "Opens with the proposition in November 2026",
    points: [
      "Every eligible team from a recognised institution in India or abroad may register.",
      "Each team submits its details, proof of enrolment and the Stage 1 fee.",
      "We verify each team and allot it an anonymous team code for the written qualifier.",
    ],
  },
  {
    num: "Stage 2",
    title: "Final registration",
    when: "Follows the qualifier results in December 2026",
    points: [
      "Only the twenty-four qualifying teams take part in this stage.",
      "Each team confirms its place, pays the Stage 2 fee and submits an authorisation letter and travel details.",
      "We offer any unconfirmed place to the next team on the ranked wait-list.",
    ],
  },
];

export default function Registration() {
  usePageMeta("Registration", "Registration for the IIDW Moot 2027 will open in two stages. Ask to be notified when the first stage opens.");

  return (
    <>
      <PageHead
        eyebrow="Registration"
        title={
          registrationStatus === "open"
            ? "Stage 1 registration is now open to every eligible team."
            : "Registration will open in two stages, beginning with the release of the proposition."
        }
        lead={
          registrationStatus === "open"
            ? "Read how the two stages work below, and then register your team through the form on this page."
            : "Registration has not opened yet. We will open the first stage when we release the proposition, and we will write to everyone who asks to be notified on the day it opens."
        }
        pills={<StatusPill state={registrationStatus === "open" ? "confirmed" : "soon"} />}
      />

      <section className="moot-section">
        <div className="moot-container">
          <Reveal>
            <SectionHeading
              num="01"
              eyebrow="Two Stages"
              title="Every team enters the written qualifier, and only qualifying teams register for the oral rounds."
              lead="A team that does not qualify owes nothing for the second stage. We will announce the fees once we have confirmed the costs of the competition."
            />
          </Reveal>
          <div className="moot-grid moot-grid--2" style={{ marginTop: 16 }}>
            {STAGES.map((stage, i) => (
              <Reveal key={stage.num} className="moot-card" delay={i * 120}>
                <span className="moot-card__num">{stage.num}</span>
                <h3 className="moot-h3">{stage.title}</h3>
                <p style={{ marginBottom: 16, color: "#134074", fontWeight: 600 }}>{stage.when}</p>
                <ul className="moot-bullets">
                  {stage.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <StatusPill state="tentative" />
          </div>
        </div>
      </section>

      <section className="moot-section moot-section--white moot-section--tight">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading num="02" eyebrow="Before You Register" title="Institutions may begin preparing for registration now." />
          </Reveal>
          <Reveal className="moot-prose" delay={120}>
            <p>
              Each institution should identify two speakers and one researcher who are enrolled with it. Each team will
              need proof of enrolment for every member and, for the second stage, an authorisation letter from its
              institution.
            </p>
            <p>
              The Rules of the Competition will state whether an institution may register more than one team, and how
              teams may change their members before the second stage closes.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="notify" className="moot-section moot-section--navy">
        <div className="moot-container moot-notify">
          <Reveal>
            <Eyebrow>Notify me</Eyebrow>
            <h2 className="moot-h2">Leave your details, and we will notify you on the day registration opens.</h2>
            <hr className="moot-rule" />
            <p className="moot-lead">
              You can also write to us at <a href={`mailto:${contacts.primary}`}>{contacts.primary}</a> with any question
              about eligibility.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <NotifyForm idPrefix="reg-notify" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
