import React from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import { useMotion } from "../hooks/useMotionPref";
import AgentLoop from "../animations/AgentLoop";
import { Eyebrow, PageHead, Reveal, SectionHeading, StatusPill } from "../components/ui";
import { heroCopy } from "../mootConfig";

const ISSUES = [
  {
    group: "Procedural issues",
    title: "Jurisdiction and joinder",
    body: "Teams will argue whether the company that developed the AI system is bound by an arbitration agreement that it never signed, and whether the tribunal can join it after the tribunal has been constituted.",
  },
  {
    group: "Procedural issues",
    title: "Interim measures and inspection",
    body: "Teams will argue whether the tribunal should confirm emergency relief and order an inspection of software, configuration and credential records, and on what terms of confidentiality.",
  },
  {
    group: "Merits issues",
    title: "Attribution of agentic AI conduct",
    body: "Teams will argue whether the actions of an autonomous system are attributable to the operator that deploys it, and whether the operator met its duties of human oversight and verification.",
  },
  {
    group: "Merits issues",
    title: "Ceiling, excuse and recoverable costs",
    body: "Teams will argue how the contract measures water use, whether a drought excuses performance, and whether emergency costs are recoverable despite a limitation of liability.",
  },
];

export default function Problem() {
  usePageMeta(
    "The Problem",
    "The moot problem concerns an agentic AI system, a shared river and a drought, and asks a tribunal to decide who bears the resulting commercial loss."
  );
  const { still } = useMotion();

  return (
    <>
      <PageHead
        eyebrow="The Problem"
        title="An autonomous system acts during a drought, and the parties dispute who bears responsibility for the consequences."
        lead="The problem sets a public water authority against the operator of an upstream data centre. We will release the full record with the proposition, and this page offers an anonymised preview of the dispute."
        pills={<StatusPill state="soon" />}
      />

      <section className="moot-section">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading num="01" eyebrow="The Story" title="The record follows a single dry season in five steps." />
          </Reveal>
          <Reveal delay={120}>
            <ol className="moot-story">
              {heroCopy.captions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="moot-section moot-section--white">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading
              num="02"
              eyebrow="The Agent"
              title="The system plans and acts through connected tools without a person approving each step."
              lead="An agentic system pursues a goal by planning its next step, acting through a connected tool and observing the result. The problem asks what happens in law when the approval gate that the contract required is never used."
            />
          </Reveal>
          <Reveal delay={120}>
            <AgentLoop still={still} />
          </Reveal>
        </div>
      </section>

      <section className="moot-section">
        <div className="moot-container">
          <Reveal>
            <SectionHeading
              num="03"
              eyebrow="Issues for Determination"
              title="The tribunal will decide two procedural issues and two issues on the merits."
              lead="The tribunal reserves quantum to a later phase, and it will not decide whether any State complied with its treaty obligations."
            />
          </Reveal>
          <div className="moot-grid moot-grid--2" style={{ marginTop: 16 }}>
            {ISSUES.map((issue, i) => (
              <Reveal key={issue.title} className="moot-card" delay={i * 90}>
                <span className="moot-card__num">
                  Issue {i + 1} · {issue.group}
                </span>
                <h3 className="moot-h3">{issue.title}</h3>
                <p>{issue.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="moot-section moot-section--stone moot-section--tight">
        <div className="moot-container moot-split">
          <Reveal>
            <Eyebrow>The Proposition</Eyebrow>
            <h2 className="moot-h2">We will publish the complete proposition on this page.</h2>
            <hr className="moot-rule" />
          </Reveal>
          <Reveal className="moot-prose" delay={120}>
            <p>
              The proposition will contain the request for arbitration, the response, the exhibits, the procedural
              orders and the extracts of law that teams need. We expect to release it in November 2026.
            </p>
            <div className="moot-btn-row" style={{ marginTop: 24 }}>
              <button className="moot-btn" type="button" disabled aria-disabled="true">
                The proposition will be available on release
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
