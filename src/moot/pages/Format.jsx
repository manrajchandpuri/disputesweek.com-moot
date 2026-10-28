import React from "react";
import { awards } from "../mootConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import { PageHead, Reveal, SectionHeading, StatusPill } from "../components/ui";

const FACTS = [
  ["Team", "Each team consists of two speakers and one researcher, and all three must study at the institution that registers the team.", "tentative"],
  ["Eligibility", "Any recognised institution in India or abroad may register a team.", "tentative"],
  ["Written qualifier", "Every registered team files a Memorandum for Claimant and a Memorandum for Respondent online.", "tentative"],
  ["Qualification", "The twenty-four teams that rank highest in the written qualifier advance to the oral rounds.", "tentative"],
  ["Oral rounds", "The qualifying teams argue in person in Chandigarh in January 2027.", "confirmed"],
  ["Language and seat", "The arbitration takes place in English, with its seat in Chandigarh.", "confirmed"],
];

const ROUNDS = [
  ["Preliminary rounds", "Each of the twenty-four teams argues twice, once for each party."],
  ["Quarter-finals", "The eight teams with the strongest preliminary records meet in knockout hearings."],
  ["Semi-finals", "Four teams argue for a place in the Grand Final."],
  ["Grand Final", "The two finalists argue before the bench, and the awards and valedictory ceremony follow."],
];

export default function Format() {
  usePageMeta("Format", "The proposed format of the IIDW Moot 2027, from the written qualifier to the Grand Final in Chandigarh.");

  return (
    <>
      <PageHead
        eyebrow="Format"
        title="Every team competes in the written round, and the highest-ranked teams argue in person."
        lead="The Organising Committee has proposed the format on this page. The Rules of the Competition will confirm the details, including marking, word limits and the order of rounds."
        pills={<StatusPill state="tentative" />}
      />

      <section className="moot-section">
        <div className="moot-container">
          <Reveal>
            <SectionHeading num="01" eyebrow="Structure" title="The competition moves from an online qualifier to in-person hearings." />
          </Reveal>
          <ul className="moot-facts">
            {FACTS.map(([label, value, state], i) => (
              <Reveal as="li" key={label} delay={i * 60}>
                <span className="moot-facts__label">{label}</span>
                <span className="moot-facts__value">{value}</span>
                <StatusPill state={state} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="moot-section moot-section--white">
        <div className="moot-container">
          <Reveal>
            <SectionHeading
              num="02"
              eyebrow="Oral Rounds"
              title="The oral rounds narrow twenty-four teams to two finalists."
              lead="The Rules will set out how we rank teams after the preliminary rounds. We propose to rank them first by wins and then by their aggregate oral scores."
            />
          </Reveal>
          <div className="moot-grid moot-grid--4" style={{ marginTop: 16 }}>
            {ROUNDS.map(([title, body], i) => (
              <Reveal key={title} className="moot-card" delay={i * 90}>
                <span className="moot-card__num">0{i + 1}</span>
                <h3 className="moot-h3">{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="moot-section">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading
              num="03"
              eyebrow="Awards"
              title="We will recognise excellence in advocacy, writing and research."
              lead="The Rules will set out the eligibility criteria and the method of determination for each award."
            />
          </Reveal>
          <Reveal delay={120}>
            <ul className="moot-facts">
              <li>
                <span className="moot-facts__label">Oral rounds</span>
                <span className="moot-facts__value">{awards.oral.join(", ")}</span>
                <span />
              </li>
              <li>
                <span className="moot-facts__label">Written qualifier</span>
                <span className="moot-facts__value">{awards.written.join(", ")}</span>
                <span />
              </li>
              <li>
                <span className="moot-facts__label">Separate assessment</span>
                <span className="moot-facts__value">{awards.separate.join(", ")}</span>
                <span />
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="moot-section moot-section--stone moot-section--tight">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading num="04" eyebrow="Use of AI Tools" title="The Rules will include an express policy on AI assistance." />
          </Reveal>
          <Reveal className="moot-prose" delay={120}>
            <p>
              The policy will govern research assistance, originality and the verification of authorities. The Rules will penalise any fabricated citation, since the accuracy of authority is central to a problem concerning autonomous systems.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
