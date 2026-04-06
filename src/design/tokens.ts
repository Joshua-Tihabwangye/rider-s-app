import { Theme } from "@mui/material/styles";

export const uiTokens = {
  colors: {
    brand: "var(--evz-brand-green)",
    brandHover: "var(--evz-brand-green-hover)",
    accent: "var(--evz-brand-orange)",
    accentHover: "var(--evz-brand-orange-hover)",
    warning: "var(--evz-warning)",
    warningDeep: "var(--evz-warning-deep)",
    warningDeepHover: "var(--evz-warning-deep-hover)",
    warningInk: "var(--evz-warning-ink)",
    warningTextLight: "var(--evz-warning-text-light)",
    warningTextDark: "var(--evz-warning-text-dark)",
    danger: "var(--evz-danger)",
    dangerHover: "var(--evz-danger-hover)",
    successBg: "var(--evz-success-bg)",
    successText: "var(--evz-success-text)",
    neutral100: "var(--evz-neutral-100)",
    neutral200: "var(--evz-neutral-200)",
    neutral600: "var(--evz-neutral-600)",
    slate700: "var(--evz-slate-700)",
    slate300: "var(--evz-slate-300)",
    amber900: "var(--evz-amber-900)",
    white: "var(--evz-white)",
    ink: "var(--evz-ink)"
  },
  spacing: {
    xxs: 0.5,
    xs: 0.75,
    sm: 1,
    smPlus: 1.25,
    md: 1.5,
    mdPlus: 1.75,
    lg: 2,
    lgPlus: 2.25,
    xl: 2.5,
    xxl: 3
  },
  radius: {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    xxl: 5,
    pill: 5
  },
  text: {
    eyebrow: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: "-0.01em"
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: "-0.01em"
    },
    itemBody: {
      fontSize: 11
    },
    statLabel: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const
    }
  },
  surfaces: {
    card: (_theme: Theme): string => "var(--evz-surface-card)",
    cardMuted: (_theme: Theme): string => "var(--evz-surface-card-muted)",
    brandSoft: (_theme: Theme): string => "var(--evz-surface-brand-soft)",
    warningSoft: (_theme: Theme): string => "var(--evz-surface-warning-soft)",
    brandTintSoft: (_theme: Theme): string => "var(--evz-surface-brand-tint-soft)",
    brandTintMedium: (_theme: Theme): string => "var(--evz-surface-brand-tint-medium)",
    accentTintSoft: (_theme: Theme): string => "var(--evz-surface-accent-tint-soft)",
    dangerTintSoft: "var(--evz-surface-danger-tint-soft)"
  },
  borders: {
    subtle: (_theme: Theme): string => "1px solid var(--evz-border-subtle)",
    brand: (_theme: Theme): string => "1px solid var(--evz-border-brand)",
    warning: (_theme: Theme): string => "1px solid var(--evz-border-warning)"
  },
  elevation: {
    card: "var(--evz-shadow-card)",
    raised: "var(--evz-shadow-raised)"
  },
  map: {
    canvas: "var(--evz-map-canvas)",
    canvasEmphasis: "var(--evz-map-canvas-emphasis)",
    gridLine: "var(--evz-map-grid-line)",
    controlBg: "var(--evz-map-control-bg)",
    controlBorder: "var(--evz-map-control-border)",
    controlIcon: "var(--evz-map-control-icon)",
    controlIconMuted: "var(--evz-map-control-icon-muted)",
    overlayBg: "var(--evz-map-overlay-bg)",
    overlayBorder: "var(--evz-map-overlay-border)",
    route: "var(--evz-map-route)",
    markerStart: "var(--evz-map-marker-start)",
    markerEnd: "var(--evz-map-marker-end)"
  }
} as const;
