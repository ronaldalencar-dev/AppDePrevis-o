"use client";

import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import { aqiLevel, t } from "@/lib/weather/i18n";
import type { AirQuality, Language } from "@/lib/weather/types";

interface AirQualityCardProps {
  air: AirQuality | null;
  language: Language;
  cardBg?: string;
}

function aqiColor(aqi: number): string {
  if (aqi <= 40) return "#22c55e";
  if (aqi <= 60) return "#eab308";
  if (aqi <= 80) return "#f97316";
  if (aqi <= 100) return "#ef4444";
  return "#a855f7";
}

export function AirQualityCard({ air, language, cardBg }: AirQualityCardProps) {
  if (!air) return null;
  const aqi = air.europeanAqi;
  const level = aqiLevel(aqi, language);
  const color = aqiColor(aqi);
  const fill = Math.min(Math.max((aqi / 100) * 100, 4), 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-3xl border border-white/15 p-4 shadow-sm backdrop-blur-md"
      style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.14)" }}
      aria-label={t("airQuality", language)}
    >
      <div className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide opacity-70">
        <Wind className="size-3.5" />
        {t("airQuality", language)}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold leading-none" style={{ color }}>
            {Math.round(aqi)}
          </span>
          <span className="text-sm font-medium" style={{ color }}>
            {level}
          </span>
        </div>
        <div className="text-right text-xs opacity-75">
          <div>PM2.5 · {air.pm2_5.toFixed(1)} µg/m³</div>
          <div>PM10 · {air.pm10.toFixed(1)} µg/m³</div>
        </div>
      </div>

      {/* Gauge bar */}
      <div className="relative mt-3 h-2 w-full rounded-full bg-white/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444, #a855f7)",
          }}
        />
        <div
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${fill}%`, background: color }}
        />
      </div>
    </motion.section>
  );
}

export default AirQualityCard;
