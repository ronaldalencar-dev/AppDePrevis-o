"use client";

import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { formatShortDay, formatTemp, t } from "@/lib/weather/i18n";
import { getWeatherCategory, getWeatherLabel } from "@/lib/weather/codes";
import type { DailyForecastItem, Language, Units } from "@/lib/weather/types";

interface DailyForecastProps {
  daily: DailyForecastItem[];
  language: Language;
  units: Units;
  accent?: string;
  cardBg?: string;
}

export function DailyForecast({ daily, language, units, accent, cardBg }: DailyForecastProps) {
  if (!daily || daily.length === 0) return null;
  const days = daily.slice(0, 5);
  const globalMin = Math.min(...days.map((d) => d.tempMin));
  const globalMax = Math.max(...days.map((d) => d.tempMax));
  const span = Math.max(globalMax - globalMin, 1);

  const dayName = (i: number, date: string) => {
    if (i === 0) return t("today", language);
    if (i === 1) return t("tomorrow", language);
    return formatShortDay(date, language);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-3xl border border-white/15 p-4 shadow-sm backdrop-blur-md"
      style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.14)" }}
      aria-label={t("forecast5", language)}
    >
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide opacity-70">
        {t("forecast5", language)}
      </h3>
      <ul className="flex flex-col gap-1">
        {days.map((d, i) => {
          const category = getWeatherCategory(d.weatherCode, true);
          const label = getWeatherLabel(d.weatherCode, language);
          const left = ((d.tempMin - globalMin) / span) * 100;
          const width = ((d.tempMax - d.tempMin) / span) * 100;
          const showRain = d.precipitationProbability >= 10;
          return (
            <motion.li
              key={d.date}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-2 py-1.5"
            >
              <span className="w-14 shrink-0 text-sm font-medium">{dayName(i, d.date)}</span>
              <WeatherIcon category={category} size={36} />
              <span className="hidden min-w-0 flex-1 truncate text-xs opacity-70 sm:block">
                {label}
              </span>
              <span
                className="flex w-10 shrink-0 items-center justify-end gap-0.5 text-xs"
                style={{ color: accent ?? "currentColor", opacity: showRain ? 1 : 0 }}
              >
                {showRain && (
                  <>
                    <Droplet className="size-3 fill-current" />
                    {d.precipitationProbability}%
                  </>
                )}
              </span>
              {/* Temperature range bar */}
              <div className="flex w-32 shrink-0 items-center gap-2">
                <span className="w-8 text-right text-sm font-medium opacity-80">
                  {formatTemp(d.tempMin, units)}
                </span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/20">
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left: `${left}%`,
                      width: `${Math.max(width, 4)}%`,
                      background: `linear-gradient(90deg, rgba(125,211,252,0.9), ${accent ?? "#fbbf24"})`,
                    }}
                  />
                </div>
                <span className="w-8 text-sm font-semibold">{formatTemp(d.tempMax, units)}</span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}

export default DailyForecast;
