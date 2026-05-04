import { useEffect, useRef, useState } from "react";
import { searchPlaces, type Coordinates, type PlaceSuggestion } from "../services/maps";

export interface UseLocationAutocompleteOptions {
  query: string;
  near?: Coordinates | null;
  enabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
  limit?: number;
}

export interface UseLocationAutocompleteResult {
  suggestions: PlaceSuggestion[];
  loading: boolean;
  error: string | null;
}

export function useLocationAutocomplete({
  query,
  near = null,
  enabled = true,
  debounceMs = 320,
  minQueryLength = 2,
  limit = 8
}: UseLocationAutocompleteOptions): UseLocationAutocompleteResult {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < minQueryLength) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const timer = window.setTimeout(async () => {
      requestSeqRef.current += 1;
      const seq = requestSeqRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      try {
        const next = await searchPlaces(trimmed, {
          near,
          limit,
          signal: controller.signal
        });
        if (seq !== requestSeqRef.current) return;
        setSuggestions(next);
      } catch {
        if (seq !== requestSeqRef.current) return;
        setSuggestions([]);
        setError("Could not fetch location suggestions.");
      } finally {
        if (seq === requestSeqRef.current) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [debounceMs, enabled, limit, minQueryLength, near, query]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    suggestions,
    loading,
    error
  };
}
