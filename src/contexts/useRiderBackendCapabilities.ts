import { useEffect, useState } from "react";
import { BACKEND_FLAG_EVENT, getSharedRidesEnabled, loadBackendRuntimeFlag } from "../services/api/config";

export function useRiderSharedRidesEnabled(): boolean {
  const [sharedRidesEnabled, setSharedRidesEnabled] = useState<boolean>(() => getSharedRidesEnabled());

  useEffect(() => {
    let mounted = true;

    const syncSharedRidesEnabled = () => {
      if (!mounted) return;
      setSharedRidesEnabled(getSharedRidesEnabled());
    };

    syncSharedRidesEnabled();
    void loadBackendRuntimeFlag()
      .then(() => {
        syncSharedRidesEnabled();
      })
      .catch(() => undefined);

    if (typeof window === "undefined") {
      return () => {
        mounted = false;
      };
    }

    window.addEventListener(BACKEND_FLAG_EVENT, syncSharedRidesEnabled as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener(BACKEND_FLAG_EVENT, syncSharedRidesEnabled as EventListener);
    };
  }, []);

  return sharedRidesEnabled;
}
