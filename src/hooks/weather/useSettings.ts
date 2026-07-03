"use client";

import { useEffect, useState } from "react";
import type { AppSettings, Language, ThemeMode, Units } from "@/lib/weather/types";
import { loadSettings, saveSettings } from "@/lib/weather/storage";

let memorySettings: AppSettings | null = null;

function getInitial(): AppSettings {
  if (memorySettings) return memorySettings;
  if (typeof window === "undefined") {
    return { units: "metric", language: "pt", themeMode: "system" };
  }
  memorySettings = loadSettings();
  return memorySettings;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getInitial);

  useEffect(() => {
    saveSettings(settings);
    memorySettings = settings;
  }, [settings]);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const setUnits = (units: Units) => update({ units });
  const setLanguage = (language: Language) => update({ language });
  const setThemeMode = (themeMode: ThemeMode) => update({ themeMode });

  return { settings, setUnits, setLanguage, setThemeMode, update };
}
