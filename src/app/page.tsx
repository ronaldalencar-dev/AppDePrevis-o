"use client";

import { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { CloudSun } from "lucide-react";
import { PhoneFrame } from "@/components/weather/PhoneFrame";
import { SearchBar } from "@/components/weather/SearchBar";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { WeatherDetailsGrid } from "@/components/weather/WeatherDetailsGrid";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { DailyForecast } from "@/components/weather/DailyForecast";
import { AirQualityCard } from "@/components/weather/AirQualityCard";
import { RecentFavorites } from "@/components/weather/RecentFavorites";
import { SettingsSheet } from "@/components/weather/SettingsSheet";
import { ErrorState } from "@/components/weather/ErrorState";
import { LoadingState } from "@/components/weather/LoadingState";
import { PullToRefresh } from "@/components/weather/PullToRefresh";
import { useSettings } from "@/hooks/weather/useSettings";
import { useWeather } from "@/hooks/weather/useWeather";
import { useGeolocation } from "@/hooks/weather/useGeolocation";
import { useHistory } from "@/hooks/weather/useHistory";
import { useFavorites } from "@/hooks/weather/useFavorites";
import { getWeatherCategory, getWeatherLabel } from "@/lib/weather/codes";
import { getWeatherTheme } from "@/lib/weather/theme";
import { formatTemp, t } from "@/lib/weather/i18n";
import { loadLastCity, saveLastCity } from "@/lib/weather/storage";
import type {
  GeoLocation,
  Language,
  SavedCity,
  ThemeMode,
  Units,
  WeatherCategory,
} from "@/lib/weather/types";

const SAO_PAULO: SavedCity = {
  id: 3448439,
  name: "São Paulo",
  latitude: -23.5475,
  longitude: -46.6361,
  country: "Brazil",
  countryCode: "BR",
  admin1: "São Paulo",
  savedAt: 0,
};

export default function Home() {
  const { settings, setUnits, setLanguage, setThemeMode } = useSettings();
  const weather = useWeather(settings.units);
  const geo = useGeolocation(settings.language);
  const history = useHistory();
  const favorites = useFavorites();

  const [mounted, setMounted] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    // Mark as mounted on the client to switch from SSR-neutral render to the
    // theme-aware render (avoids hydration mismatch on dynamic theme/system prefs).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Resolve the actual theme mode, tracking system preference changes.
  const effectiveThemeMode: ThemeMode = mounted ? settings.themeMode : "system";
  const resolvedMode: "light" | "dark" =
    effectiveThemeMode === "system" ? (systemDark ? "dark" : "light") : effectiveThemeMode;

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // Sync the initial system preference, then subscribe to changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSystemDark(mq.matches);
    const handler = () => setSystemDark(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  // Apply the resolved theme to <html>.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", resolvedMode === "dark");
    document.documentElement.style.colorScheme = resolvedMode;
  }, [resolvedMode, mounted]);

  const effectiveLang: Language = mounted ? settings.language : "pt";
  const effectiveUnits: Units = mounted ? settings.units : "metric";

  // First paint: load the last city (or default to São Paulo).
  useEffect(() => {
    if (!mounted) return;
    const last = loadLastCity();
    const city: SavedCity = last ?? SAO_PAULO;
    const saved: SavedCity = { ...city, savedAt: Date.now() };
    weather.load(saved);
    history.add(saved);
  }, [mounted]);

  // Surface API errors as toasts (only when there is no fallback data).
  useEffect(() => {
    if (weather.error && !weather.data) {
      toast.error(weather.error);
    }
  }, [weather.error, weather.data]);

  useEffect(() => {
    if (geo.error) toast.error(geo.error);
  }, [geo.error]);

  const handleSelect = useCallback(
    (city: GeoLocation) => {
      const saved: SavedCity = { ...city, savedAt: Date.now() };
      weather.load(saved);
      history.add(saved);
      saveLastCity(saved);
    },
    [weather, history]
  );

  const handleSelectSaved = useCallback(
    (city: SavedCity) => {
      const saved: SavedCity = { ...city, savedAt: Date.now() };
      weather.load(saved);
      history.add(saved);
      saveLastCity(saved);
    },
    [weather, history]
  );

  const handleLocate = useCallback(async () => {
    const loc = await geo.request();
    if (loc) {
      const saved: SavedCity = { ...loc, savedAt: Date.now() };
      weather.load(saved);
      history.add(saved);
      saveLastCity(saved);
    }
  }, [geo, weather, history]);

  const handleToggleFav = useCallback(() => {
    if (!weather.data) return;
    const city: SavedCity = { ...weather.data.location, savedAt: Date.now() };
    const wasFav = favorites.isFav(city.id);
    favorites.toggle(city);
    toast.success(wasFav ? t("removeFavorite", effectiveLang) : t("addFavorite", effectiveLang));
  }, [weather.data, favorites, effectiveLang]);

  const handleShare = useCallback(async () => {
    if (!weather.data) return;
    const d = weather.data;
    const text = `${t("shareText", effectiveLang)} ${d.location.name}: ${formatTemp(
      d.current.temperature,
      effectiveUnits
    )} • ${getWeatherLabel(d.current.weatherCode, effectiveLang)}`;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: t("appName", effectiveLang), text });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(t("share", effectiveLang));
      } catch {
        /* ignore */
      }
    }
  }, [weather.data, effectiveUnits, effectiveLang]);

  const handleRefresh = useCallback(async () => {
    await weather.refresh();
  }, [weather]);

  // ---- Theme ----
  const category: WeatherCategory = weather.data
    ? getWeatherCategory(weather.data.current.weatherCode, weather.data.current.isDay)
    : "clear-day";
  const theme = getWeatherTheme(category, resolvedMode);

  const hasData = !!weather.data;
  const isLoading = weather.loading && !hasData;
  const isError = !!weather.error && !hasData;
  const showRecentFav =
    (history.history.length > 0 || favorites.favorites.length > 0) && !isLoading;

  return (
    <PhoneFrame themeGradient={theme.gradient}>
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ color: mounted ? theme.text : "#ffffff" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-4 md:pt-6">
          <div className="flex items-center gap-2">
            <CloudSun className="size-6" style={{ color: theme.accent }} />
            <h1 className="text-lg font-semibold">{t("appName", effectiveLang)}</h1>
          </div>
          <SettingsSheet
            settings={settings}
            setUnits={setUnits}
            setLanguage={setLanguage}
            setThemeMode={setThemeMode}
            cardBg={theme.cardBg}
          />
        </header>

        {/* Search */}
        <div className="px-4 pb-2">
          <SearchBar
            language={effectiveLang}
            onSelect={handleSelect}
            onLocate={() => void handleLocate()}
            locating={geo.loading}
          />
        </div>

        {/* Recent searches + favorites */}
        {showRecentFav && (
          <div className="px-4 pb-2">
            <RecentFavorites
              history={history.history}
              favorites={favorites.favorites}
              language={effectiveLang}
              onSelect={handleSelectSaved}
              onToggleFav={(c) => favorites.toggle(c)}
              onClearHistory={() => history.clear()}
              cardBg={theme.cardBg}
            />
          </div>
        )}

        {/* Content area */}
        {!hasData && !isError ? (
          <LoadingState language={effectiveLang} />
        ) : isError ? (
          <ErrorState
            message={weather.error ?? ""}
            kind={weather.errorKind}
            onRetry={() => weather.load(weather.location ?? SAO_PAULO, { force: true })}
            language={effectiveLang}
            cardBg={theme.cardBg}
          />
        ) : hasData && weather.data ? (
          <PullToRefresh
            onRefresh={handleRefresh}
            language={effectiveLang}
            accent={theme.accent}
            className="px-4"
          >
            <div className="flex flex-col gap-3 pb-6 pt-1">
              <CurrentWeatherCard
                data={weather.data}
                language={effectiveLang}
                units={effectiveUnits}
                isFav={favorites.isFav(weather.data.location.id)}
                onToggleFav={handleToggleFav}
                onShare={() => void handleShare()}
                accent={theme.accent}
                cardBg={theme.cardBg}
              />
              <HourlyForecast
                hourly={weather.data.hourly}
                language={effectiveLang}
                units={effectiveUnits}
                accent={theme.accent}
                cardBg={theme.cardBg}
              />
              <DailyForecast
                daily={weather.data.daily}
                language={effectiveLang}
                units={effectiveUnits}
                accent={theme.accent}
                cardBg={theme.cardBg}
              />
              <WeatherDetailsGrid
                data={weather.data}
                language={effectiveLang}
                units={effectiveUnits}
                cardBg={theme.cardBg}
              />
              <AirQualityCard
                air={weather.data.airQuality}
                language={effectiveLang}
                cardBg={theme.cardBg}
              />
            </div>
          </PullToRefresh>
        ) : null}

        {/* Footer */}
        <footer
          className="mt-auto px-4 py-3 text-center text-[11px]"
          style={{ color: mounted ? theme.subtext : "rgba(255,255,255,0.7)" }}
        >
          Dados: Open-Meteo • Feito com ♥
        </footer>
      </div>

      <Toaster position="top-center" theme={resolvedMode} richColors closeButton />
    </PhoneFrame>
  );
}
