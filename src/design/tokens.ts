import { Theme } from "@mui/material/styles";

export const uiTokens = {
  colors: {
    brand: "#03CD8C",
    brandHover: "#22C55E",
    accent: "#F77F00",
    accentHover: "#EA580C",
    warning: "#F59E0B",
    warningDeep: "#7C2D12",
    warningDeepHover: "#9A3412",
    warningInk: "#FFFBEB",
    warningTextLight: "rgba(67,20,7,0.9)",
    warningTextDark: "rgba(251,191,36,0.9)",
    danger: "#DC2626",
    dangerHover: "#B91C1C",
    successBg: "#D1FAE5",
    successText: "#064E3B",
    neutral100: "#F3F4F6",
    neutral200: "#E5E7EB",
    neutral600: "#4B5563",
    slate700: "#334155",
    slate300: "#CBD5E1",
    amber900: "rgba(120,53,15,0.9)",
    white: "#FFFFFF",
    ink: "#020617"
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
    card: (theme: Theme): string =>
      theme.palette.mode === "light" ? "#FFFFFF" : "rgba(15,23,42,0.98)",
    cardMuted: (theme: Theme): string =>
      theme.palette.mode === "light" ? "#F9FAFB" : "rgba(15,23,42,0.96)",
    brandSoft: (theme: Theme): string =>
      theme.palette.mode === "light"
        ? "linear-gradient(135deg, rgba(3,205,140,0.08) 0%, #FFFFFF 100%)"
        : "linear-gradient(135deg, rgba(3,205,140,0.16) 0%, rgba(15,23,42,0.98) 100%)",
    warningSoft: (theme: Theme): string =>
      theme.palette.mode === "light"
        ? "linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)"
        : "linear-gradient(180deg, rgba(124,45,18,0.45) 0%, rgba(15,23,42,0.98) 100%)",
    brandTintSoft: (theme: Theme): string =>
      theme.palette.mode === "light" ? "rgba(3,205,140,0.1)" : "rgba(3,205,140,0.2)",
    brandTintMedium: (theme: Theme): string =>
      theme.palette.mode === "light" ? "rgba(3,205,140,0.15)" : "rgba(3,205,140,0.25)",
    accentTintSoft: (theme: Theme): string =>
      theme.palette.mode === "light" ? "rgba(247,127,0,0.15)" : "rgba(247,127,0,0.25)",
    dangerTintSoft: "rgba(220,38,38,0.08)"
  },
  borders: {
    subtle: (theme: Theme): string =>
      theme.palette.mode === "light"
        ? "1px solid rgba(209,213,219,0.9)"
        : "1px solid rgba(51,65,85,0.9)",
    brand: (theme: Theme): string =>
      theme.palette.mode === "light"
        ? "1px solid rgba(3,205,140,0.25)"
        : "1px solid rgba(3,205,140,0.35)",
    warning: (theme: Theme): string =>
      theme.palette.mode === "light"
        ? "1px solid rgba(245,158,11,0.5)"
        : "1px solid rgba(251,191,36,0.6)"
  },
  elevation: {
    card: "0 4px 18px rgba(15,23,42,0.08)",
    raised: "0 10px 28px rgba(15,23,42,0.14)"
  }
} as const;
