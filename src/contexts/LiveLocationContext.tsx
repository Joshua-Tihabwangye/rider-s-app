/**
 * LiveLocationContext — tiny isolated context for the rider's live GPS position.
 *
 * Keeping this separate from AppDataContext means a GPS update only re-renders
 * components that actually consume this context (map screens), NOT the entire
 * AppDataContext tree. This eliminates the device freeze caused by the full
 * AppDataContext reducer running on every GPS tick.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Coordinates } from "../services/maps";
import { useRiderLiveLocation } from "../hooks/useRiderLiveLocation";

interface LiveLocationValue {
  riderLocation: Coordinates | null;
}

const LiveLocationContext = createContext<LiveLocationValue>({ riderLocation: null });

export function LiveLocationProvider({ children }: { children: React.ReactNode }) {
  const [riderLocation, setRiderLocation] = useState<Coordinates | null>(null);

  const handleLocation = useCallback((coords: Coordinates) => {
    setRiderLocation(coords);
  }, []);

  useRiderLiveLocation({ enabled: true, onLocation: handleLocation });

  const value = useMemo(() => ({ riderLocation }), [riderLocation]);

  return (
    <LiveLocationContext.Provider value={value}>
      {children}
    </LiveLocationContext.Provider>
  );
}

export function useLiveLocation(): LiveLocationValue {
  return useContext(LiveLocationContext);
}
