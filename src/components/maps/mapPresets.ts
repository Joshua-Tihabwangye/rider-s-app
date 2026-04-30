export type MapHeightPreset = "home" | "compact" | "full";

export const MAP_HEIGHT_PRESETS: Record<MapHeightPreset, string> = {
  home: "clamp(260px, 46vh, 440px)",
  compact: "clamp(320px, 58vh, 560px)",
  full: "clamp(360px, 68vh, 720px)"
};
