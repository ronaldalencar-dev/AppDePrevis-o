"use client";

import { useCallback, useEffect, useState } from "react";
import { loadFavorites, toggleFavorite as toggleFavoriteStorage } from "@/lib/weather/storage";
import type { SavedCity } from "@/lib/weather/types";

export function useFavorites() {
  const [favorites, setFavorites] = useState<SavedCity[]>([]);

  useEffect(() => {
    // Hydration-safe read of persisted favorites (localStorage is only available client-side).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(loadFavorites());
  }, []);

  const toggle = useCallback((city: SavedCity) => {
    setFavorites(toggleFavoriteStorage(city));
  }, []);

  const isFav = useCallback(
    (cityId: number) => favorites.some((c) => c.id === cityId),
    [favorites]
  );

  return { favorites, toggle, isFav };
}
