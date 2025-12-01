# EVzone Rider Supervisor – Full RA01–RA91

This project is a **Create React App + MUI + Tailwind** supervisor shell that
hosts **all RA01–RA91 mobile canvases** for the EVzone Rider / Customer app.

- JavaScript only (no TypeScript)
- Screens implemented as **`.jsx`** files
- Shared EVzone theme, colors and mobile shell
- Safe, plug-and-play structure for your team to paste in high-fidelity UI

## Quick start

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

Use the **left sidebar** to choose any `RAxx` screen; the selected screen renders
on the right inside a mobile frame with EVzone theming and bottom navigation.

## Tech stack

- React 18 (Create React App)
- MUI v5 (`@mui/material`, `@mui/icons-material`, `@emotion/*`)
- Tailwind CSS 3 (configured via `tailwind.config.js` + `postcss.config.js`)

## Structure

- `src/theme.js` – EVzone design tokens (colors, typography, shape)
- `src/components/MobileShell.jsx` – mobile device frame + bottom nav
- `src/components/ScreenScaffold.jsx` – shared header and placeholder body
- `src/screens/RA01.jsx` … `src/screens/RA91.jsx` – one component per screen
- `src/App.jsx` – supervisor shell with screen selector (RA01–RA91)

Each RA screen currently uses `ScreenScaffold` as a safe placeholder. Your team
can now open the corresponding `RAxx.jsx` file and replace the `<ScreenScaffold />`
with the full JSX from your high-fidelity canvas for that screen.

Nothing else needs to change – the imports, routing, theming and supervisor shell
will continue to work.
