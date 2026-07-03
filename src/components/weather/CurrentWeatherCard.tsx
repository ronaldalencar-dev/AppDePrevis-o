"use client";

import { motion } from "framer-motion";
import { Share2, Star } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { getWeatherCategory, getWeatherLabel } from "@/lib/weather/codes";
import { formatTemp, formatTime, t } from "@/lib/weather/i18n";
import type { Language, Units, WeatherData } from "@/lib/weather/types";
import { cn } from "@/lib/utils";

interface CurrentWeatherCardProps {
  data: WeatherData;
  language: Language;
  units: Units;
  isFav: boolean;
  onToggleFav: () => void;
  onShare: () => void;
  accent?: string;
  cardBg?: string;
}

export function CurrentWeatherCard({
  data,
  language,
  units,
  isFav,
  onToggleFav,
  onShare,
  cardBg,
}: CurrentWeatherCardProps) {
  const { current, location } = data;
  const category = getWeatherCategory(current.weatherCode, current.isDay);
  const label = getWeatherLabel(current.weatherCode, language);
  const subtitle = [location.admin1, location.country].filter(Boolean).join(", ");
  const updated = formatTime(new Date(data.fetchedAt).toISOString(), language);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/15 p-5 shadow-sm backdrop-blur-md"
      style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.14)" }}
    >
      {/* Header row: city + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-semibold leading-tight">{location.name}</h2>
          {subtitle && (
            <p className="truncate text-sm opacity-80">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onShare}
            aria-label={t("share", language)}
            className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <Share2 className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={onToggleFav}
            aria-label={isFav ? t("removeFavorite", language) : t("addFavorite", language)}
            className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <motion.span
              key={isFav ? "on" : "off"}
              initial={{ scale: 0.6, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Star
                className={cn("size-[18px]", isFav && "fill-current text-amber-300")}
              />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Hero: icon + temperature */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-7xl font-bold leading-none tracking-tight">
            {formatTemp(current.temperature, units)}
          </span>
          <span className="mt-2 text-lg font-medium">{label}</span>
          <span className="mt-0.5 text-sm opacity-80">
            {t("feelsLike", language)} {formatTemp(current.apparentTemperature, units)}
          </span>
        </div>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
          className="shrink-0"
        >
          <WeatherIcon category={category} size={108} />
        </motion.div>
      </div>

      {/* Updated time */}
      <p className="mt-4 text-xs opacity-70">
        {t("updated", language)} {updated}
      </p>
    </motion.section>
  );
}

export default CurrentWeatherCard;
