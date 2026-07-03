"use client";

import { useCallback, useState } from "react";
import { reverseGeocode } from "@/lib/weather/api";
import type { GeoLocation } from "@/lib/weather/types";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: GeoLocation | null;
}

export function useGeolocation(language: "pt" | "en" = "pt") {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  });

  const request = useCallback(async (): Promise<GeoLocation | null> => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ loading: false, error: "Geolocalização não suportada", location: null });
      return null;
    }
    setState({ loading: true, error: null, location: null });
    return new Promise<GeoLocation | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude, language);
            setState({ loading: false, error: null, location: loc });
            resolve(loc);
          } catch {
            const fallback: GeoLocation = {
              id: Math.round(pos.coords.latitude * 1000 + pos.coords.longitude * 1000),
              name: language === "pt" ? "Minha localização" : "My location",
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              country: "",
              countryCode: "",
            };
            setState({ loading: false, error: null, location: fallback });
            resolve(fallback);
          }
        },
        (err) => {
          let message = language === "pt" ? "Permissão de localização negada" : "Location permission denied";
          if (err.code === err.TIMEOUT) {
            message = language === "pt" ? "Tempo esgotado ao obter localização" : "Location request timed out";
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            message = language === "pt" ? "Localização indisponível" : "Location unavailable";
          }
          setState({ loading: false, error: message, location: null });
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, [language]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, location: null });
  }, []);

  return { ...state, request, reset };
}
