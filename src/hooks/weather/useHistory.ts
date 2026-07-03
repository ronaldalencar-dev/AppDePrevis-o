"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addToHistory as addCityToHistory,
  clearHistory as clearHistoryStorage,
  loadHistory,
} from "@/lib/weather/storage";
import type { SavedCity } from "@/lib/weather/types";

export function useHistory() {
  const [history, setHistory] = useState<SavedCity[]>([]);

  useEffect(() => {
    // Hydration-safe read of persisted history (localStorage is only available client-side).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
  }, []);

  const add = useCallback((city: SavedCity) => {
    setHistory(addCityToHistory(city));
  }, []);

  const clear = useCallback(() => {
    clearHistoryStorage();
    setHistory([]);
  }, []);

  return { history, add, clear };
}
