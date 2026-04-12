# Delivery Frontend Release Checklist

Run this full gate before sign-off:

```bash
npm run qa:delivery
```

## Quality gates

- [x] Device checks: `320px`, `375px`, `768px`, desktop
- [x] Functional checks: delivery buttons are wired and complete expected outcomes
- [x] Visual checks: runtime guard against blinking/re-render loop errors
- [x] Consistency checks: standardized tracking/map behavior across delivery states
- [x] Static cleanup gate: duplicate legacy delivery screens/routes removed

## Scope lock (final)

- [x] Canonical screens only: Dashboard, New Delivery, Tracking, Notifications, Rating, Settlement
- [x] Canonical route tree only under `/deliveries`
- [x] Standardized delivery map shell retained
- [x] Mode-based UX retained: Individual, Family, Business, Company

## Mandatory passes

- [x] No inert button pass complete
- [x] No duplicate variant page pass complete
- [x] All core states available pass complete
- [x] Mode-based UX complete pass complete

## Notes

- Static gate script: `scripts/delivery-static-gate.mjs`
- E2E sign-off suite: `tests/delivery/signoff.delivery.spec.ts`
- Playwright config for delivery gate: `playwright.delivery.config.ts`
