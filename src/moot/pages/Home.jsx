import React from "react";
import { Link } from "react-router-dom";
import { BASE, assets, ciacCopy, contacts, heroCopy, notifyLabel, showCiacAssociation } from "../mootConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import { useMotion } from "../hooks/useMotionPref";
import StatusBoard from "../components/StatusBoard";
import RiverTimeline from "../components/RiverTimeline";
import NotifyForm from "../components/NotifyForm";
import StoryHero from "../animations/StoryHero";
import CiacLegacy from "../animations/CiacLegacy";
import { Arrow, Eyebrow, Icon, Reveal, RiverDivider, SectionHeading, StatusPill } from "../components/ui";

export default function Home({ assetBase = "" }) {
  usePageMeta(
    null,
    "The CIAC legacy moot is the first moot argued under the CIAC (Arbitration Proceedings) Rules 2026. Teams argue a dispute about agentic AI, critical infrastructure and environmental harm, with oral rounds in Chandigarh in January 2027."
  );
  const { still } = useMotion();

  return (
    <>
      <StoryHero
        captions={heroCopy.captions}
        eyebrow={showCiacAssociation ? heroCopy.eyebrow : "IIDW International Commercial Arbitration Moot 2027"}
        headline={heroCopy.headline}
        lead={heroCopy.lead}
        primaryCta={{ label: notifyLabel(), to: `${BASE}/registration#notify` }}
        secondaryCta={{ label: heroCopy.secondaryLabel, href: "#competition" }}
        reducedMotion={still}
      />

      {showCiacAssociation ? (
        <CiacLegacy {...ciacCopy} logoSrc={assets.ciac.fullLight} reducedMotion={still} />
      ) : null}

      {/* 01 The Competition */}
      <section id="competition" className="moot-section">
        <div className="moot-container">
          <div className="moot-split">
            <Reveal>
              <SectionHeading num="01" eyebrow="The Competition" title="The competition is a commercial arbitration about the conduct of an autonomous system." />
            </Reveal>
            <Reveal className="moot-prose" delay={120}>
              <p>
                The competition places teams inside a commercial arbitration between a public water authority and a
                data-centre operator. Teams will examine how settled principles of contract formation, attribution and
                risk allocation apply when an agentic AI system acts without a person approving each step.
              </p>
              <p>
                The arbitration runs under the CIAC (Arbitration Proceedings) Rules 2026 with its seat in Chandigarh.
                Teams will draw on the UNIDROIT Principles 2016, the UNCITRAL Model Law on Automated Contracting 2024 and
                Indian arbitration law, and they will argue both sides of the dispute.
              </p>
            </Reveal>
          </div>
          <div className="moot-grid moot-grid--3" style={{ marginTop: 64 }}>
            {[
              {
                icon: Icon.scales,
                title: "Arbitration",
                body: "Teams will address joinder, interim measures and the inspection of evidence under the CIAC (Arbitration Proceedings) Rules 2026.",
              },
              {
                icon: Icon.agent,
                title: "Technology",
                body: "Teams will examine whether the actions of an AI agent are attributable to the company that deploys it, and what human oversight the law requires.",
              },
              {
                icon: Icon.river,
                title: "Environment",
                body: "Teams will consider how drought conditions, a shared watercourse and downstream communities bear on the allocation of commercial loss.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} className="moot-card" delay={i * 100}>
                {card.icon}
                <h3 className="moot-h3">{card.title}</h3>
                <p>{card.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Status board */}
      <section className="moot-section moot-section--stone moot-section--tight" aria-labelledby="moot-status-title">
        <div className="moot-container">
          <Reveal>
            <Eyebrow>Where things stand</Eyebrow>
            <h2 id="moot-status-title" className="moot-h2">
              We will confirm each milestone on this page as it becomes final.
            </h2>
            <hr className="moot-rule" />
          </Reveal>
          <StatusBoard />
        </div>
      </section>

      {/* 02 The dispute in brief */}
      <section className="moot-section">
        <div className="moot-container">
          <div className="moot-split">
            <Reveal>
              <SectionHeading
                num="02"
                eyebrow="The Dispute in Brief"
                title="The dispute concerns a shared river, an upstream data centre and an approval that no officer gave."
              />
              <Link className="moot-link" to={`${BASE}/problem`}>
                Read more about the problem <Arrow />
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <ol className="moot-story">
                {heroCopy.captions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
              <p className="moot-small" style={{ marginTop: 20 }}>
                We will release the full record, including the procedural orders and the issues for determination,
                together with the proposition.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="moot-container">
        <RiverDivider />
      </div>

      {/* 03 Format */}
      <section className="moot-section">
        <div className="moot-container">
          <Reveal>
            <SectionHeading
              num="03"
              eyebrow="Format at a Glance"
              title="Every registered team competes in the written round, and the twenty-four highest-ranked teams argue in Chandigarh."
              lead="The Organising Committee has proposed the format below, and the Rules of the Competition will confirm it."
            />
          </Reveal>
          <div className="moot-grid moot-grid--4" style={{ marginTop: 16 }}>
            {[
              ["01", "Teams", "Each team comprises two speakers and one researcher from the same institution."],
              ["02", "Written qualifier", "Every registered team files a memorandum for each party through an online submission process."],
              ["03", "Oral rounds", "Twenty-four teams argue in person, from the preliminary rounds to a Grand Final."],
              ["04", "Awards", "Awards will recognise the leading teams, memoranda, oralist and researcher."],
            ].map(([num, title, body], i) => (
              <Reveal key={title} className="moot-card" delay={i * 90}>
                <span className="moot-card__num">{num}</span>
                <h3 className="moot-h3">{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <StatusPill state="tentative" />
            <Link className="moot-link" to={`${BASE}/format`}>
              See the full format <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* 04 Timeline */}
      <section className="moot-section moot-section--white">
        <div className="moot-container">
          <div className="moot-split">
            <Reveal>
              <SectionHeading
                num="04"
                eyebrow="Timeline"
                title="The competition runs from November 2026 to the oral rounds in January 2027."
                lead="The competition proceeds in four phases, and the Rules of the Competition will fix the exact dates."
              />
              <Link className="moot-link" to={`${BASE}/timeline`}>
                View the full timeline <Arrow />
              </Link>
            </Reveal>
            <RiverTimeline compact />
          </div>
        </div>
      </section>

      {/* Notify band */}
      <section id="notify" className="moot-section moot-section--navy">
        <div className="moot-container moot-notify">
          <Reveal>
            <Eyebrow>Registration</Eyebrow>
            <h2 className="moot-h2">Registration has not yet opened, and you may ask to be notified when it does.</h2>
            <hr className="moot-rule" />
            <p className="moot-lead">
              We will open the first stage of registration when we release the proposition, and we will write to
              everyone on this list on the day it opens.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <NotifyForm idPrefix="home-notify" />
          </Reveal>
        </div>
      </section>

      {/* 05 Organisers */}
      <section className="moot-section moot-section--tight">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading
              num="05"
              eyebrow="Organisers"
              title={
                showCiacAssociation
                  ? "Two Chandigarh institutions organise the competition together."
                  : "The India International Disputes Week organises the competition."
              }
            />
          </Reveal>
          <Reveal className="moot-prose" delay={120}>
            <div className="moot-org" style={{ marginBottom: 28 }}>
                            <img src={assetBase + assets.logo} alt="India International Disputes Week" />
              {showCiacAssociation ? (
                <>
                  <span className="moot-org__divider" aria-hidden="true" />
                  <img className="moot-org__ciac" src={assets.ciac.full} alt="Chandigarh International Arbitration Centre, India" />
                </>
              ) : null}
            </div>
            <p>
              IIDW is a non-profit platform for dialogue across litigation, arbitration, mediation and emerging forms of
              dispute resolution. The moot brings students into the same week in which judges, arbitrators and counsel convene in Chandigarh.
            </p>
            {showCiacAssociation ? (
              <p>
                The Chandigarh International Arbitration Centre lends the competition its name as the CIAC legacy moot, and the Centre's 2026 Rules govern the arbitration that every team argues.
              </p>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* 06 Contact */}
      <section className="moot-section moot-section--stone moot-section--tight">
        <div className="moot-container moot-split">
          <Reveal>
            <SectionHeading num="06" eyebrow="Contact" title="The Organising Committee welcomes your questions." />
          </Reveal>
          <Reveal className="moot-prose" delay={120}>
            <p>
              Write to the Organising Committee for questions about eligibility, institutional participation or
              partnership. We reply to every message within a few working days.
            </p>
            <div className="moot-btn-row" style={{ marginTop: 24 }}>
              <a className="moot-btn moot-btn--solid" href={`mailto:${contacts.primary}?subject=IIDW%20Moot%202027`}>
                <span>Email {contacts.primary}</span>
                <Arrow />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
