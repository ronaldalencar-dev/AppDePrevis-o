"use client";

import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { formatHour, formatTemp, t } from "@/lib/weather/i18n";
import { getWeatherCategory } from "@/lib/weather/codes";
import type { HourlyForecastItem, Language, Units } from "@/lib/weather/types";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  language: Language;
  units: Units;
  accent?: string;
  cardBg?: string;
}

export function HourlyForecast({ hourly, language, units, accent, cardBg }: HourlyForecastProps) {
  if (!hourly || hourly.length === 0) return null;
  const nowLabel = language === "pt" ? "Agora" : "Now";

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-3xl border border-white/15 p-3 shadow-sm backdrop-blur-md"
      style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.14)" }}
      aria-label={t("hourly", language)}
    >
      <h3 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide opacity-70">
        {t("hourly", language)}
      </h3>
      <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
        {hourly.map((h, i) => {
          const category = getWeatherCategory(h.weatherCode, h.isDay);
          const showRain = h.precipitationProbability >= 10;
          return (
            <motion.div
              key={h.time}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.4) }}
              className="flex min-w-[58px] flex-col items-center gap-1 rounded-2xl px-2 py-2"
            >
              <span className="text-xs font-medium opacity-80">
                {i === 0 ? nowLabel : formatHour(h.time, language)}
              </span>
              <WeatherIcon category={category} size={36} />
              <span className="text-sm font-semibold">{formatTemp(h.temperature, units)}</span>
              {showRain && (
                <span
                  className="flex items-center gap-0.5 text-[11px] font-medium"
                  style={{ color: accent ?? "currentColor" }}
                >
                  <Droplet className="size-2.5 fill-current" />
                  {h.precipitationProbability}%
                </span>
              )}
              {!showRain && <span className="h-[14px]" />}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default HourlyForecast;
