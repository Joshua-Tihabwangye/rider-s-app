# Visual Migration QA + PR Slicing

## Enforcement commands

Run before opening any migration PR:

```bash
npm run design:check
npm run build
npm run visual:regress
```

When intentional color/radius debt changes are introduced in `src/screens/**`, refresh the baseline explicitly:

```bash
npm run design:lint:screens:update
```

Refresh visual baselines (after approved visual updates):

```bash
npm run visual:baseline
```

## Parity checklist (executed by Playwright)

Covered routes (light + dark snapshots):

- `/home`
- `/more`
- `/settings`
- `/rides/enter`
- `/rides/enter/map`
- `/rides/trip`
- `/rides/trip/details`
- `/rides/trip/route`
- `/rides/searching`
- `/rides/driver-on-way`

Map smoke checks validate:

- map shell/controls rendered
- map controls are interactable (`zoom/layer/bearing/recenter`)
- map height behavior for `home`, `compact`, `full` (and `45vh` custom case)

## PR slices

Use independent PRs so rollback remains simple:

1. **tokens-theme**
   - `src/design/tokens.ts`
   - `src/index.css`
   - `src/theme.ts`
   - `src/contexts/ThemeContext.tsx`

2. **shell-header**
   - `src/components/MobileShell.tsx`
   - `src/components/ScreenScaffold.tsx`
   - `src/components/PageHeader.tsx`

3. **primitives**
   - `src/components/primitives/*`

4. **maps-framework**
   - `src/components/maps/*`
   - map-token wiring in shared theme/css files

5. **screens-wave-1**
   - `/home`, `/more`, `/settings`

6. **screens-wave-2**
   - dashboards and list-heavy screens

7. **screens-wave-3**
   - trip/active/tracking screens

## Suggested branch naming

- `visual/tokens-theme`
- `visual/shell-header`
- `visual/primitives`
- `visual/maps-framework`
- `visual/screens-wave-1`
- `visual/screens-wave-2`
- `visual/screens-wave-3`
