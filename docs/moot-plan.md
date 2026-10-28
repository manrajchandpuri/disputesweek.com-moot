# IIDW Moot 2027 at disputesweek.com/moot, the plan

## Context

IIDW needs a home for the IIDW International Commercial Arbitration Moot 2027 at `disputesweek.com/moot`. Today that URL renders a blank page, because the Emergent React app has no route for it. The proposal (Draft 1, 26 Oct 2026) still awaits approval, and the proposition (Tentative Draft 1) is not final. So the launch build is a polished **coming soon** experience. It has a motion-led story hero, tentative information clearly labelled, a "notify me" route instead of registration, and a page structure that later switches to live registration, proposition download, clarifications and results by editing one config file.

Decisions already made with the user:
- **Stack**: React components and routes for the Emergent app (CRA build with shadcn tokens). This folder is empty, so I build a portable `src/moot/` module here plus a small Vite harness for local preview. The user then copies it into Emergent.
- **Type**: Plus Jakarta Sans only. No serif, no mono. Labels become tracked uppercase Jakarta.
- **Story**: abstract. No party, place, system or patch names before the proposition is released.
- **Oral rounds date**: show only "January 2027, Chandigarh". All other milestones are shown at month level and tagged Tentative.
- **Copy rules** (apply to every visible string, alt text and meta): no em dashes, no colons (times are written as "0732 hrs"), no en dash ranges ("9 to 13"), no fragment slogans, and full active-voice sentences.

---

## 1. Design assessment

### disputesweek.com (what we keep)
| Token | Value | Use on /moot |
|---|---|---|
| Navy | `#0B2545` | Dark bands, night scenes of the hero, primary buttons |
| Ink | `#0F172A` / `#020617` | Headings and body text |
| Gold | `#D4AF37`, deep gold `#B8860B` | Human approval, the Tribunal, short heading rule, eyebrow numerals. Decorative only, never body text on paper because contrast is about 3 to 1 |
| Saffron | `#F08A1D` | Used sparingly for the AMBER alert moment and the "Coming soon" pill |
| River blue | `#134074` (already on the site) | The river line, flow charts, links on dark |
| Paper / Stone | `#FBFBFA` / `#F4F4F0` | Alternating section grounds |
| Hairline | `#E5E5E5` | 1px borders |

The structure carries over too. It uses square corners (radius 0), 1px hairline cards, a 1024px content column, 128px section padding, numbered eyebrows above each H2 with a short gold rule beneath, outlined plus solid navy buttons, a floating vertical tab on the right edge and a faint oversized "’27" watermark. Logo `/iidw-logo-nav.png` and photos `/first-edition-audience.jpg` and `/chandigarh-open-hand.jpg` are reused from the main site.

What we change: the serif headings become Plus Jakarta Sans 600 with -0.02em tracking. The mono eyebrows become Jakarta 600, 11px, uppercase, 0.18em tracking. Eyebrows read "01 · The Competition", never "01 —". The main site's em dashes and slogan fragments are not repeated.

### manrajchandpuri.com/lex (motion we borrow)
- A short opening title before the content. On /moot this is the opening card of the hero film, which plays once per session and can be skipped.
- Easing `cubic-bezier(0.2, 0.6, 0.2, 1)` for every reveal, with 600 to 900ms durations and 12 to 16px rises.
- Scroll-pinned narrative scenes with oversized type, plus a side index that tracks the active scene.
- A visible "View without animation" toggle, `prefers-reduced-motion` support and keyboard control.
- Vanilla implementation with no heavy libraries. We keep that discipline.

### Combined visual idea, "The Basin Record"
The pages read like a well-kept arbitral record laid over the IIDW paper and navy system. One thin river-blue line runs through the site as a divider and a timeline spine. Gold marks moments of human authority, and saffron marks system alerts. The hero moves from daylight paper into a navy night and back into a hearing room.

---

## 2. Disclosure assessment

| Disclose now as confirmed | Disclose now, tagged Tentative | Coming soon (placeholder with notify) | Keep internal |
|---|---|---|---|
| Competition name, organised by IIDW with CIAC as the CIAC legacy moot, and the first moot under the CIAC Rules 2026 | Annual return of the moot with each edition of IIDW | Proposition PDF and Procedural Order No. 1 | Budget ceiling and expense heads |
| Theme of agentic AI, automated contracting and commercial risk in critical infrastructure, with an environmental dimension | Two-stage registration model | Rules of the Competition, word limits and citation style | Sponsorship tiers and amounts |
| An international commercial arbitration under the CIAC (Arbitration Proceedings) Rules 2026, seated in Chandigarh | Written qualifier online, with twenty-four teams advancing | Registration form and fees | Risk table and evaluator pool sizing |
| Oral rounds in person in Chandigarh in January 2027, alongside IIDW 2027 | Team of two speakers and one researcher | Clarifications portal and Procedural Order No. 2 | Scoring weights, until the Rules publish them |
| Open to teams from recognised institutions in India and abroad | Month-level timeline from November 2026 to January 2027 | Submission portal | Organising Committee names, until approval |
| Contact address | Award categories (six) | Results, draw, judges, venue rooms | Fictional names in the record, until release |

The home page leads with a **status board** of four rows. The Proposition row reads "Release expected in November 2026". The Registration row reads "Opens soon". The Rules row reads "In preparation". The Oral rounds row reads "January 2027, Chandigarh".

## 3. Contact and registration links

- The main site sends all mail to `iidw@disputesweek.com` and offers an "Express your interest" form. Proposal Part 12 asks for role-based addresses.
- The site uses one public moot address, `moot@disputesweek.com`, which now exists. When the portals open, `registrations@`, `clarifications@` and `submissions@` are added in config.
- No page shows a live "Register" link. Every registration CTA reads "Notify me when registration opens". It opens a short form (name, email, institution, country) that posts to a configurable endpoint and falls back to a `mailto` if no endpoint is set.
- `registrationStatus` in config takes the values `soon`, `open` or `closed`. That one flag switches every CTA, the status board and the registration page.

---

## 4. Sitemap

Primary sub-navigation at launch is Overview, The Problem, Format, Timeline, Registration, FAQ and Contact.

| Route | Launch state | Content |
|---|---|---|
| `/moot` | Live, coming soon landing | Cinematic hero film, CIAC legacy section, about, status board, the dispute in brief, format at a glance, tentative timeline, notify band, organisers, contact |
| `/moot/problem` | Live teaser | Abstract dispute summary, four issue areas (jurisdiction and joinder, interim measures and inspection, attribution of agentic AI conduct, ceiling and excuse and recoverable costs), the agent loop animation, and a disabled "Download the proposition" button |
| `/moot/format` | Live, tentative | Team composition, written qualifier, oral round structure, awards, and the AI use policy noted as forthcoming in the Rules |
| `/moot/timeline` | Live, tentative | Four phases at month level on an animated river-line spine |
| `/moot/registration` | Live, soon state | How the two stages work, eligibility, what teams will need, and the notify form |
| `/moot/rules` | Coming soon | Placeholder that later holds the Rules, code of conduct and AI policy |
| `/moot/clarifications` | Coming soon, not in nav | Placeholder that later holds the request form and Procedural Order No. 2 |
| `/moot/submissions` | Coming soon, not in nav | Placeholder for the memorandum portal |
| `/moot/faq` | Live | Questions with confirmed answers only |
| `/moot/contact` | Live | Moot address, response expectation, notify form |
| `/moot/results`, `/moot/schedule` | Reserved | Not routed until December 2026 |
| `/moot/*` | Live | Shared Coming Soon template, so no moot URL ever renders blank |

The main site gets a "Moot" link in its top nav and a fifth "Compete" card in Get Involved, delivered as a snippet.

---

## 5. Home page, section by section

1. **Cinematic hero film** (Claude Design). It is full-bleed with no frame and plays on load, telling the five beats in ASCII and dither before it rests on the title frame with the CIAC credit. Its opening title card replaces the separate gateway. A fallback with the same props ships until the export arrives.
2. **CIAC legacy section** (Claude Design). It presents the Centre, the first moot under the CIAC Rules 2026, a rulebook visual and a four-step legacy timeline.
3. **01 · The Competition**. Two paragraphs and three hairline cards for Arbitration, Technology and Environment.
4. **Status board**. Four rows, each with a Confirmed, Tentative or Coming soon pill.
5. **02 · The Dispute in Brief**. The abstract story told in sentences, plus a link to `/moot/problem`.
6. **03 · Format at a Glance**. Teams, written qualifier, oral rounds and awards, all tagged Tentative.
7. **04 · Timeline**. A month-level river-line spine linking to `/moot/timeline`.
8. **Notify band** on navy. The form, plus a floating vertical "Notify me" tab on the right edge on every moot page.
9. **05 · Organisers**. IIDW, with CIAC shown only after sign-off and the high-court line only if approved for use.
10. **06 · Contact** and footer.

### Draft copy (all follows the copy rules)
- **Eyebrow**: "IIDW International Commercial Arbitration Moot 2027"
- **H1**: "When an autonomous system acts on a shared river, a tribunal must decide who answers for it."
- **Lead**: "The IIDW Moot 2027 asks teams to argue a dispute about agentic AI, critical infrastructure and environmental harm under the CIAC Arbitration Rules. The oral rounds take place in person in Chandigarh in January 2027, during the second edition of the India International Disputes Week."
- **CTAs**: "Notify me when registration opens" (solid navy) and "Read about the competition" (outline).
- **Scene captions**:
  1. "A river crosses a border and supplies every town that lies downstream."
  2. "A data centre upstream promises to draw no more than a fixed volume each day and to leave the reservoir under human control."
  3. "An overnight update changes how the system measures its own limit, and no engineer signs the change."
  4. "The system asks the reservoir to hold back its release, and the interface records an approval three minutes later without a human name."
  5. "The river falls below the agreed standard, and the downstream authority spends heavily to keep water flowing to its towns."
- **About**: "The competition places teams inside a commercial arbitration between a public water authority and a data-centre operator. Teams will examine how settled principles of contract formation, attribution and risk allocation apply when an agentic AI system acts without a person approving each step."
- **Registration notice**: "Registration has not opened yet. We will open the first stage when we release the proposition, and we will write to everyone who asks to be notified on the day it opens."
- **Contact**: "Write to the Organising Committee for questions about eligibility, institutional participation or partnership. We reply to every message within a few working days."

---

## 6. Implementation (React module for Emergent)

```
/Users/manrajsingh/disputesweek.com:moot/
  src/moot/
    mootConfig.js          status flags, contacts, milestones {label, month, tentative}, nav
    MootRoutes.jsx         <Route path="/moot/*"> tree with lazy pages
    MootLayout.jsx         IIDW header with Moot wordmark, sub-nav, floating Notify tab, footer
    styles/moot.css        tokens as CSS vars scoped to .moot-root, Jakarta only, no Tailwind dependency
    hooks/useReveal.js     IntersectionObserver reveal with lex easing
    hooks/usePageMeta.js   per-page title and description
    hooks/useMotionPref.js prefers-reduced-motion plus the "View without animation" toggle
    components/            Eyebrow, SectionHeading, StatusPill, StatusBoard, RiverTimeline,
                           NotifyForm, RiverDivider, ComingSoon
    animations/            Claude Design exports (StoryHero.jsx, AgentLoop.jsx, motifs)
    pages/                 Home, Problem, Format, Timeline, Registration, Faq, Contact, Rules, Clarifications, Submissions
  preview/                 Vite harness that mounts MootRoutes for local checks (not shipped)
  scripts/lint-copy.mjs    fails on "—", "–", or ":" in JSX text, alt or meta strings
  INTEGRATION.md           steps to copy into Emergent, add the route, add the nav link and Compete card
```

Notes:
- Plain CSS with a `.moot-` prefix avoids clashing with the Emergent Tailwind and shadcn setup. The only dependency assumed is `react-router-dom`, which I verify when the code is pasted in.
- `HeroSlot` lazy-loads the Claude Design component and shows the static final frame first, so the headline is always in the HTML.
- Countdown is omitted because no date is final. The status board replaces it.

---

## 7. Claude Design prompts

### Prompt 1, story hero

> Design a full-width animated hero for the IIDW International Commercial Arbitration Moot 2027 at disputesweek.com/moot, and deliver it as one self-contained React component that uses SVG, CSS keyframes and requestAnimationFrame with no external libraries. The visual language must match a calm, institutional legal site, so use square corners, 1px hairlines, generous white space and Plus Jakarta Sans as the only typeface. Use paper #FBFBFA as the daylight ground, navy #0B2545 for night, ink #0F172A for text, river blue #134074 for water, gold #D4AF37 for anything that represents human authority and saffron #F08A1D only for a single system alert.
>
> The hero tells an abstract five-scene story as the visitor scrolls, and it pins in place until the story ends. In the first scene a single thin river line draws itself from the top left to the bottom right, and a faint dashed border crosses it to suggest two territories, with small town markers appearing downstream. In the second scene a compact data-centre block of small squares appears upstream beside a reservoir, a gold horizontal ceiling line settles across a slim gauge, and a small gold figure icon sits beside the reservoir to show human control. In the third scene the ground fades to navy as night falls, a quiet line of system text types "Limit mode changed at 0214 hrs, approver not recorded", and the gold ceiling line softens into a wavering average. In the fourth scene a pulse travels from the data centre to the reservoir, a hairline timer counts 180 seconds, an "Accepted" stamp appears, and the operator field beside it stays empty while the gold figure fades to an outline. In the fifth scene the river line thins and a flow index drops below a dashed threshold marked 80, a single saffron alert appears, and the view then lightens back to paper as three gold seats form a tribunal bench above the river.
>
> Each scene carries one caption in 18px Jakarta, which I will supply as props, and a small scene index of five ticks sits on the right edge and tracks progress. After the last scene the headline and two buttons fade up over the bench, the river line stays as a quiet underline, and the whole composition rests. Use the easing cubic-bezier(0.2, 0.6, 0.2, 1) for every movement, keep each transition between 600 and 900 milliseconds, and avoid any bounce, glow, gradient mesh or futuristic neon. The component must work from 375 pixels to 1440 pixels wide, must stack the caption below the drawing on phones, must expose props named captions, headline, lead, primaryCta, secondaryCta and reducedMotion, and must render the final resting frame with no motion when reducedMotion is true or the user prefers reduced motion. Write every visible string without em dashes and without colons, and give the SVG an accessible title and description that summarise the story in two plain sentences.

### Prompt 2, supporting motion system

> Design a set of small, reusable motion elements for the same IIDW Moot 2027 site and deliver each one as a self-contained React component with SVG and CSS only. Keep the established system of square corners, 1px #E5E5E5 hairlines, Plus Jakarta Sans as the only typeface, paper #FBFBFA and stone #F4F4F0 grounds, navy #0B2545, river blue #134074, gold #D4AF37 and saffron #F08A1D, with the easing cubic-bezier(0.2, 0.6, 0.2, 1).
>
> The first element is a river divider that draws a thin blue line across the content column when it scrolls into view and leaves a small gold node at its centre. The second element is a vertical timeline spine in which the river line grows downward as the visitor scrolls and each milestone node fills from outline to solid as it passes, with a saffron "Tentative" pill that I can toggle per milestone. The third element is an agent loop diagram for the problem page, in which four hairline boxes labelled Goal, Plan, Act and Observe connect in a loop, a small pulse travels the loop twice, and a gold "Human approval" gate on the Act edge stays open and unused to show that no person intervened. The fourth element is a status board of four rows in which each pill animates once from outline to its state colour, using navy for Confirmed, gold outline for Tentative and saffron for Coming soon. The fifth element is a coming soon panel for placeholder pages, in which a document outline assembles line by line from the top and a short sentence and a notify button fade in below it.
>
> Every element must run once on first view, must respect reduced motion by rendering its final state immediately, must stay legible from 375 pixels to 1440 pixels wide, and must accept all text as props. Write every visible string without em dashes and without colons, and keep the mood quiet, exact and institutional rather than technological or playful.

---

## 8. Build order

1. Scaffold `src/moot/`, the tokens in `moot.css`, `mootConfig.js` and the layout, and render every route, including the Coming Soon template.
2. Build the home page sections with the static hero frame and the status board.
3. Build the Problem, Format, Timeline, Registration, FAQ and Contact pages with the drafted copy.
4. Build the NotifyForm with an endpoint and mailto fallback, and add the registration status switch.
5. Add the reveal hooks and the reduced-motion toggle.
6. Leave `animations/` slots wired to static fallbacks, ready for the Claude Design exports.
7. Write `INTEGRATION.md` and the main-site nav and Compete card snippets.

## 9. Verification

- Run the Vite harness and check every route in the browser pane at 1440, 768 and 375 widths, with light theme and with reduced motion emulated.
- Confirm that no `/moot/*` URL renders blank and that every registration CTA reads "Notify me" while the status is `soon`.
- Run `scripts/lint-copy.mjs` to catch em dashes, en dashes and colons in visible text. Then read every string by hand for fragments and passive voice.
- Run a keyboard pass through the film controls, nav, form and animation toggle, and check contrast with gold kept to decoration and large text only.
- Cross-check every date and fact against the disclosure table so that nothing from the "Keep internal" column ships.

## Open items to confirm during the build
- The endpoint for the notify form on the Emergent backend, if one exists.
