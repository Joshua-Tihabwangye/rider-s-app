/**
 *
 * Watches the device GPS and keeps sharedLocationState.riderLocation in sync
 * via AppDataContext. Any screen that renders a MapShell will automatically
 * show the blue "you are here" pin because MapShell already passes riderLocation
 * down to GoogleMapView.
 *
 * Call this once at the AppDataProvider level so the watch is shared globally.
 */

import { useEffect } from "react";
import { watchLiveLocation } from "../services/location";
import type { Coordinates } from "../services/maps";

interface UseRiderLiveLocationOptions {
    enabled?: boolean;
    onLocation?: (coords: Coordinates) => void;
}

export function useRiderLiveLocation({
    enabled = true,
    onLocation,
}: UseRiderLiveLocationOptions = {}): void {
    useEffect(() => {
        if (!enabled || !onLocation) return;

        const stop = watchLiveLocation(
            (coords) => {
                onLocation(coords);
            },
            undefined,
            { enableHighAccuracy: true, minEmitIntervalMs: 5000, minDistanceMeters: 5 },
        );

        return stop;
    }, [enabled, onLocation]);
}
