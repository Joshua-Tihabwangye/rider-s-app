/**
 * Application color constants
 * Centralized color definitions for consistent theming
 */

export interface ColorPalette {
  primary: string;
  secondary?: string;
  light?: string;
  dark?: string;
}

export interface Colors {
  green: ColorPalette;
  orange: ColorPalette;
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  neutral: {
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
}

export const COLORS: Colors = {
  // Primary brand colors
  green: {
    primary: "#03CD8C",
    secondary: "#22C55E",
    light: "#D1FAE5",
    dark: "#064E3B"
  },
  
  // Secondary/CTA colors
  orange: {
    primary: "#F77F00",
    light: "rgba(247,127,0,0.15)",
    dark: "rgba(247,127,0,0.25)"
  },
  
  // Status colors
  status: {
    success: "#16A34A",
    warning: "#CA8A04",
    error: "#EF4444",
    info: "#1D4ED8"
  },
  
  // Neutral colors
  neutral: {
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827"
    }
  }
};

export default COLORS;

