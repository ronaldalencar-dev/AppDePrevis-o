"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather } from "@/lib/weather/api";
import { getCachedWeather, setCachedWeather } from "@/lib/weather/storage";
import type { GeoLocation, Units, WeatherData } from "@/lib/weather/types";

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  errorKind: "network" | "notfound" | "server" | "timeout" | null;
}

const MIN_REFRESH_MS = 30 * 1000; // avoid hammering the API on rapid refreshes

export function useWeather(units: Units) {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
    errorKind: null,
  });
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const lastFetchRef = useRef<number>(0);

  const load = useCallback(
    async (loc: GeoLocation, opts?: { force?: boolean }) => {
      const force = opts?.force ?? false;

      // Try cache first (non-forced) for instant render
      if (!force) {
        const cached = getCachedWeather(loc.id, units);
        if (cached) {
          setState({ data: cached, loading: false, error: null, errorKind: null });
          // Still refresh in background if cache is a bit old — but throttle
          if (Date.now() - lastFetchRef.current < MIN_REFRESH_MS) return;
        }
      }

      setLocation(loc);
      setState((prev) => ({ ...prev, loading: true, error: null, errorKind: null }));
      lastFetchRef.current = Date.now();
      try {
        const data = await fetchWeather(loc, units);
        setCachedWeather(loc.id, units, data);
        setState({ data, loading: false, error: null, errorKind: null });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        const kind =
          err && typeof err === "object" && "kind" in err
            ? ((err as { kind: WeatherState["errorKind"] }).kind ?? "server")
            : "server";
        setState((prev) => ({
          data: prev.data, // keep stale data if we have it
          loading: false,
          error: message,
          errorKind: kind,
        }));
      }
    },
    [units]
  );

  const refresh = useCallback(async () => {
    if (location) {
      await load(location, { force: true });
    }
  }, [location, load]);

  const clear = useCallback(() => {
    setState({ data: null, loading: false, error: null, errorKind: null });
    setLocation(null);
  }, []);

  // When units change and we have a location, refetch (cache is per-unit)
  useEffect(() => {
    if (location) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      load(location, { force: false });
    }
  }, [units]);

  return { ...state, location, load, refresh, clear };
}
