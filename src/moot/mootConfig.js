// Single source of truth for the moot microsite.
// Flip the status flags here when the proposition, registration or Rules go live.
// Copy rule for every string in this file that reaches the page:
// no em dashes, no en dashes, no colons, and full active-voice sentences.

import ciacLogo from "./assets/ciac-logo.png";
import ciacLogoLight from "./assets/ciac-logo-light.png";
import ciacMark from "./assets/ciac-mark.png";
import ciacMarkLight from "./assets/ciac-mark-light.png";

export const BASE = "/moot";

// "soon" | "open" | "closed"
export const registrationStatus = "soon";

// Shows the Chandigarh International Arbitration Centre as co-organiser across the site.
export const showCiacAssociation = true;

export const contacts = {
  primary: "moot@disputesweek.com",
  registrations: null,
  clarifications: null,
  submissions: null,
};

// Set to a POST endpoint (for example "/api/moot/interest") when the Emergent
// backend accepts notify requests. While null, the form opens a prefilled email.
export const notifyEndpoint = null;

export const assets = {
  logo: "/iidw-logo-nav.png",
  audience: "/first-edition-audience.jpg",
  city: "/chandigarh-open-hand.jpg",
    // The CIAC logo, cut from the Centre's artwork onto transparent backgrounds. The full
  // lockup carries the Centre's name, and the mark is the letters alone for small spaces.
  // Light versions are for navy grounds. Replace with the official SVG files when supplied.
  ciac: { full: ciacLogo, fullLight: ciacLogoLight, mark: ciacMark, markLight: ciacMarkLight },
};

export const nav = [
  { to: BASE, label: "Overview", end: true },
  { to: `${BASE}/problem`, label: "The Problem" },
  { to: `${BASE}/format`, label: "Format" },
  { to: `${BASE}/timeline`, label: "Timeline" },
  { to: `${BASE}/registration`, label: "Registration" },
  { to: `${BASE}/faq`, label: "FAQ" },
  { to: `${BASE}/contact`, label: "Contact" },
];

// state is "confirmed" | "tentative" | "soon"
export const statusBoard = [
  {
    item: "Proposition",
    detail: "We expect to release the proposition in November 2026.",
    state: "tentative",
  },
  {
    item: "Registration",
    detail:
      registrationStatus === "open"
        ? "Stage 1 registration is now open to every eligible team."
        : "Stage 1 registration opens together with the proposition.",
    state: registrationStatus === "open" ? "confirmed" : "soon",
  },
  {
    item: "Arbitration rules",
    detail: "Teams will argue under the CIAC (Arbitration Proceedings) Rules 2026, and this is the first moot to apply them.",
    state: "confirmed",
  },
  {
    item: "Rules of the Competition",
    detail: "The Organising Committee is preparing the Rules for publication.",
    state: "soon",
  },
  {
    item: "Oral rounds",
    detail: "Teams will argue in person in Chandigarh in January 2027.",
    state: "confirmed",
  },
];

export const phases = [
  {
    phase: "Phase 1",
    title: "Launch and Stage 1 registration",
    month: "November 2026",
    tentative: true,
    items: [
      "We release the proposition and open Stage 1 registration to every eligible team.",
      "Teams submit requests for clarification, and we verify each registration and allot an anonymous team code.",
    ],
  },
  {
    phase: "Phase 2",
    title: "Written qualifier",
    month: "November to December 2026",
    tentative: true,
    items: [
      "Every registered team files a Memorandum for Claimant and a Memorandum for Respondent.",
      "Independent evaluators assess the memoranda, and we announce the twenty-four qualifying teams and a ranked wait-list.",
    ],
  },
  {
    phase: "Phase 3",
    title: "Stage 2 registration and readiness",
    month: "December 2026",
    tentative: true,
    items: [
      "Qualifying teams confirm their places and submit their final details.",
      "We offer any unconfirmed places to wait-listed teams in order of rank and issue the participant handbook.",
    ],
  },
  {
    phase: "Phase 4",
    title: "Oral rounds in Chandigarh",
    month: "January 2027",
    tentative: false,
    items: [
      "Twenty-four teams argue the preliminary rounds, and the strongest eight advance to the quarter-finals.",
      "The semi-finals lead to a Grand Final, which closes with the awards and the valedictory ceremony.",
    ],
  },
];

export const awards = {
  oral: ["Winner", "Runner-up", "Best Oralist"],
  written: ["Best Memorandum for Claimant", "Best Memorandum for Respondent"],
  separate: ["Best Researcher"],
};

// The film's opening credit, which names the Centre and the Week, is part of the
// Claude Design export in animations/vendor/iidw-hero.js.
export const heroCopy = {
  eyebrow: "The CIAC legacy moot",
  headline:
    "When an autonomous system acts on a shared river, a tribunal must decide who answers for it.",
  lead:
    "This is the first moot argued under the CIAC (Arbitration Proceedings) Rules 2026, with oral rounds in Chandigarh in January 2027.",
  secondaryLabel: "Read about the competition",
  captions: [
    "A river crosses a border and supplies every town that lies downstream.",
    "A data centre upstream undertakes to draw no more than a fixed volume each day and to keep the reservoir under human control.",
    "An overnight update changes how the system measures its own limit, and no engineer signs the change.",
    "The system asks the reservoir to hold back its release, and the interface records an approval three minutes later without a human name.",
    "The river falls below the agreed standard, and the downstream authority incurs substantial emergency costs to maintain supply to its towns.",
  ],
};

export const ciacCopy = {
  eyebrow: "The Centre and its Rules",
  heading:
    "This competition inaugurates the CIAC legacy moot, and it is the first moot to be argued under the CIAC (Arbitration Proceedings) Rules 2026.",
  paragraphs: [
    "The Chandigarh International Arbitration Centre was launched during the first edition of the India International Disputes Week, under the aegis of the High Court of Punjab and Haryana. The competition carries the Centre's name as its legacy moot and will be held with each edition of the Week.",
    "Teams will argue an arbitration administered under the Centre's own rules and seated in Chandigarh, so that every memorandum and every oral round applies those rules in practice for the first time.",
  ],
  ruleHeadings: [
    "Commencement",
    "Joinder of additional parties",
    "The emergency arbitrator",
    "Interim measures",
    "Constitution of the tribunal",
    "The hearing",
  ],
  seal: "Rules 2026, first edition",
  timeline: [
    "The Centre opens during the first edition of the India International Disputes Week.",
    "The Centre's Arbitration Proceedings Rules 2026 set the procedure for this moot.",
    "The first CIAC legacy moot reaches its oral rounds in Chandigarh in January 2027.",
    "The moot will be held with each future edition of the Week.",
  ],
};

export function notifyLabel() {
  if (registrationStatus === "open") return "Register your team";
  if (registrationStatus === "closed") return "Registration has closed";
  return "Notify me when registration opens";
}
