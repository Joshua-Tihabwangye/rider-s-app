/**
 * Phase 5.1 — useRiderLiveLocation
 *
 * Watches device GPS and calls onLocation ONLY when the position has moved
 * more than MIN_DISTANCE_M metres AND MIN_INTERVAL_MS has elapsed.
 *
 * Using requestAnimationFrame to batch the dispatch so it never fires in the
 * middle of a React render pass (which would cause a cascade re-render and
 * freeze on low-end devices).
 */

import { useEffect, useRef } from "react";
import type { Coordinates } from "../services/maps";

const MIN_DISTANCE_M = 8;     // skip update if moved less than 8 m
const MIN_INTERVAL_MS = 6000; // never update more often than every 6 s

function haversineMeters(a: Coordinates, b: Coordinates): number {
    const R = 6_371_000;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

interface Options {
    enabled?: boolean;
    onLocation?: (coords: Coordinates) => void;
}

export function useRiderLiveLocation({ enabled = true, onLocation }: Options = {}): void {
    const lastCoords = useRef<Coordinates | null>(null);
    const lastEmitAt = useRef(0);
    const rafHandle = useRef<number | null>(null);
    const onLocationRef = useRef(onLocation);

    // Keep callback ref fresh without re-subscribing GPS
    useEffect(() => {
        onLocationRef.current = onLocation;
    }, [onLocation]);

    useEffect(() => {
        if (!enabled || typeof navigator === "undefined" || !navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const next: Coordinates = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                const now = Date.now();
                const prev = lastCoords.current;

                // Throttle by time
                if (now - lastEmitAt.current < MIN_INTERVAL_MS) return;
                // Throttle by distance
                if (prev && haversineMeters(prev, next) < MIN_DISTANCE_M) return;

                lastCoords.current = next;
                lastEmitAt.current = now;

                // Batch via RAF so we never dispatch mid-render
                if (rafHandle.current !== null) cancelAnimationFrame(rafHandle.current);
                rafHandle.current = requestAnimationFrame(() => {
                    rafHandle.current = null;
                    onLocationRef.current?.(next);
                });
            },
            undefined,
            { enableHighAccuracy: true, maximumAge: 5_000, timeout: 20_000 },
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
            if (rafHandle.current !== null) {
                cancelAnimationFrame(rafHandle.current);
                rafHandle.current = null;
            }
        };
    }, [enabled]);
}
