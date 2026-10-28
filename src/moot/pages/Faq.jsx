import React from "react";
import { Link } from "react-router-dom";
import { BASE, contacts } from "../mootConfig";
import { usePageMeta } from "../hooks/usePageMeta";
import { PageHead, Reveal } from "../components/ui";

const FAQ = [
  {
    q: "Who can take part in the competition?",
    a: "Teams from any recognised institution in India or abroad can take part. The Rules of the Competition will set out the full eligibility criteria.",
  },
  {
    q: "How many members does a team have?",
    a: "We propose that each team should consist of two speakers and one researcher, all enrolled at the institution that registers the team.",
  },
  {
    q: "When does registration open?",
    a: "Registration opens together with the release of the proposition, which we expect in November 2026. You can ask us to notify you on the day it opens.",
    link: { to: `${BASE}/registration#notify`, label: "Ask to be notified" },
  },
  {
    q: "Does every team need to travel to Chandigarh?",
    a: "No team needs to travel for the written qualifier, which takes place online. Only the twenty-four teams that qualify will argue in person in Chandigarh in January 2027.",
  },
  {
    q: "Is there a registration fee?",
    a: "We plan to charge a fee at each stage of registration. We will announce the amounts once we have confirmed the costs of the competition, and a team that does not qualify will not pay the second fee.",
  },
  {
    q: "Which rules govern the arbitration in the problem?",
    a: "The arbitration in the problem runs under the CIAC (Arbitration Proceedings) Rules 2026, with its seat in Chandigarh. This is the first moot to be argued under those rules.",
  },
  {
    q: "What is the CIAC legacy moot?",
    a: "The Chandigarh International Arbitration Centre lends this competition its name as its legacy moot. The moot will be held with each edition of the India International Disputes Week.",
  },
  {
    q: "May teams use AI tools in their research?",
    a: "The Rules of the Competition will include an express policy on research assistance, originality and the verification of authorities. Teams should read that policy carefully before they begin drafting.",
  },
  {
    q: "Whom should I contact with other questions?",
    a: `Please write to ${contacts.primary}, and the Organising Committee will reply within a few working days.`,
  },
];

export default function Faq() {
  usePageMeta("Frequently asked questions", "Answers to common questions about the IIDW Moot 2027.");
  return (
    <>
      <PageHead
        eyebrow="Frequently Asked Questions"
        title="This page answers the questions that teams and institutions raise most often."
        lead="We publish only those answers that we can confirm today, and we will add further answers when the Rules of the Competition are published."
      />
      <section className="moot-section">
        <div className="moot-container">
          <Reveal className="moot-faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <div className="moot-faq__body">
                  <p>{item.a}</p>
                  {item.link ? (
                    <Link className="moot-link" to={item.link.to}>
                      {item.link.label}
                    </Link>
                  ) : null}
                </div>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
