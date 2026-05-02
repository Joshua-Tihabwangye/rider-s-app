import type { MapPoint } from "../store/types";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isValidMapPoint(point: MapPoint | null | undefined): point is MapPoint {
  if (!point) {
    return false;
  }
  return isFiniteNumber(point.lat) && isFiniteNumber(point.lng);
}

export function normalizeRoute(points: Array<MapPoint | null | undefined> | null | undefined): MapPoint[] {
  return (points ?? []).filter(isValidMapPoint);
}

export function interpolateBetweenPoints(start: MapPoint, end: MapPoint, progress: number): MapPoint {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  return {
    lat: start.lat + (end.lat - start.lat) * clampedProgress,
    lng: start.lng + (end.lng - start.lng) * clampedProgress
  };
}

export function getPointAtProgress(
  route: Array<MapPoint | null | undefined> | null | undefined,
  progress: number,
  fallbackStart?: MapPoint | null,
  fallbackEnd?: MapPoint | null
): MapPoint | null {
  const normalizedRoute = normalizeRoute(route);
  const clampedProgress = Math.max(0, Math.min(1, progress));

  if (normalizedRoute.length === 1) {
    return normalizedRoute[0] ?? null;
  }

  if (normalizedRoute.length >= 2) {
    const totalSegments = normalizedRoute.length - 1;
    const scaledProgress = clampedProgress * totalSegments;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(scaledProgress));
    const segmentProgress = scaledProgress - segmentIndex;
    const start = normalizedRoute[segmentIndex];
    const end = normalizedRoute[segmentIndex + 1];
    if (!start || !end) {
      return normalizedRoute[normalizedRoute.length - 1] ?? null;
    }
    return interpolateBetweenPoints(start, end, segmentProgress);
  }

  if (isValidMapPoint(fallbackStart) && isValidMapPoint(fallbackEnd)) {
    return interpolateBetweenPoints(fallbackStart, fallbackEnd, clampedProgress);
  }

  return isValidMapPoint(fallbackStart) ? fallbackStart : isValidMapPoint(fallbackEnd) ? fallbackEnd : null;
}

export function getApproachPoint(
  route: Array<MapPoint | null | undefined> | null | undefined,
  progress: number
): MapPoint | null {
  const normalizedRoute = normalizeRoute(route);
  if (normalizedRoute.length === 0) {
    return null;
  }

  if (normalizedRoute.length === 1) {
    return normalizedRoute[0] ?? null;
  }

  const start = normalizedRoute[0];
  const next = normalizedRoute[1];
  if (!start || !next) {
    return start ?? null;
  }

  const approachStart = {
    lat: start.lat - (next.lat - start.lat) * 0.9,
    lng: start.lng - (next.lng - start.lng) * 0.9
  };

  return interpolateBetweenPoints(approachStart, start, progress);
}
