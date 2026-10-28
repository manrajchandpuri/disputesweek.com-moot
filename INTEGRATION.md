# Adding /moot to disputesweek.com

The `src/moot` folder is a self-contained React module. It needs React 17 or later and `react-router-dom` version 6 or later, which the Emergent app should already have. It brings its own scoped CSS, so it does not depend on the site's Tailwind or shadcn setup.

## 1. Copy the module

Copy `src/moot` into the Emergent project at `frontend/src/moot` (or wherever `App.js` lives, keeping the folder name).

## 2. Add the route

In the file that declares the app's routes (usually `App.js`), add one route.

```jsx
import MootRoutes from "./moot/MootRoutes";

// inside <Routes>
<Route path="/moot/*" element={<MootRoutes />} />
```

If the app does not use `<Routes>` yet and renders the home page directly, wrap it like this.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/moot/*" element={<MootRoutes />} />
    <Route path="/*" element={<ExistingHomePage />} />
  </Routes>
</BrowserRouter>
```

The images (`/iidw-logo-nav.png`) already exist on the live site, so no assets need copying. Hosting must serve `index.html` for `/moot` paths, which Emergent does for single-page apps.

## 3. Link to it from the main site

Add a nav item next to Contact.

```jsx
<a href="/moot">Moot</a>
```

Add a fifth card to the Get Involved grid.

```jsx
<a href="/moot" className="...same classes as the other cards...">
  <h3>Compete</h3>
  <p>Student teams can argue the IIDW International Commercial Arbitration Moot in Chandigarh in January 2027.</p>
</a>
```

## 4. Switch things on later

Everything that changes at launch lives in `src/moot/mootConfig.js`.

| When | Change |
|---|---|
| Role-based mailboxes go live | Fill in `contacts.registrations`, `contacts.clarifications` and `contacts.submissions` |
| The backend accepts notify requests | Set `notifyEndpoint` to the POST URL. The form sends JSON with name, email, institution, country and source |
| The Centre supplies official SVG logo files | Replace the PNGs in `src/moot/assets/` and update the four imports at the top of `mootConfig.js` |
| The CIAC association must be hidden again | Set `showCiacAssociation` to `false`, which removes the CIAC section, credit line and badge |
| Registration opens | Set `registrationStatus` to `"open"`, then build the registration form into `pages/Registration.jsx` |
| The Rules or proposition are published | Replace the `ComingSoon` elements in `MootRoutes.jsx` with real pages, and update `statusBoard` and `phases` |

## 5. The Claude Design visual kit

The hero film and the CIAC section come from the Claude Design canvas "IIDW Moot 2027 Visual Kit". Its three scripts sit unchanged in `src/moot/animations/vendor/`, and `animations/iidw.js` loads them in order.

| Piece | Site wrapper | What the wrapper adds |
|---|---|---|
| `iidw-engine.js` | `animations/iidw.js` | Loads the engine before the hero and the legacy section |
| `iidw-hero.js` | `animations/StoryHero.jsx` | Passes copy from `mootConfig.js`, and hands clicks on `/moot` links to the router so they do not reload the page |
| `iidw-legacy.js` | `animations/CiacLegacy.jsx` | Passes copy from `mootConfig.js` and the CIAC logo once `assets.ciacLogo` is set |

`styles/moot.css` adds only small fitting rules. They size the film to this site's header, square off its buttons, and add navy scrims so white captions and the title frame stay legible over bright dither.

To take a newer export, read the three scripts from the canvas, replace the files in `vendor/` (keeping the two comment lines at the top), and check the copy in them by hand, because the copy check skips that folder.

The film's opening credit, "Chandigarh International Arbitration Centre and India International Disputes Week present", lives in `vendor/iidw-hero.js`. Turning off `showCiacAssociation` does not remove it, so edit that line too if the association ever changes.

## 6. Local preview and checks

Double-click `launch.command` in Finder. It installs the dependencies the first time, starts the preview and opens http://localhost:5178/moot in your browser. Press Control-C in its Terminal window to stop it.

From a terminal, `npm run dev` does the same without opening the browser. Run the copy check before every deploy.

```bash
node scripts/lint-copy.mjs
```
