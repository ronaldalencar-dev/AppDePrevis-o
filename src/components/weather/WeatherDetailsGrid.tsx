"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  Droplets,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatTemp, formatTime, t, uvLevel } from "@/lib/weather/i18n";
import { unitSymbol } from "@/lib/weather/api";
import type { Language, Units, WeatherData } from "@/lib/weather/types";

interface WeatherDetailsGridProps {
  data: WeatherData;
  language: Language;
  units: Units;
  cardBg?: string;
}

interface DetailItem {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  valueColor?: string;
  rotateIcon?: number;
}

function uvColor(uv: number): string {
  if (uv < 3) return "#22c55e";
  if (uv < 6) return "#eab308";
  if (uv < 8) return "#f97316";
  if (uv < 11) return "#ef4444";
  return "#a855f7";
}

export function WeatherDetailsGrid({ data, language, units, cardBg }: WeatherDetailsGridProps) {
  const { current, daily } = data;
  const sym = unitSymbol(units);
  const today = daily[0];

  const items: DetailItem[] = [
    {
      icon: Thermometer,
      label: t("feelsLike", language),
      value: formatTemp(current.apparentTemperature, units),
    },
    {
      icon: Droplets,
      label: t("humidity", language),
      value: `${Math.round(current.humidity)}%`,
    },
    {
      icon: Wind,
      label: t("wind", language),
      value: `${Math.round(current.windSpeed)} ${sym.wind}`,
      rotateIcon: current.windDirection,
    },
    {
      icon: Wind,
      label: t("gusts", language),
      value: `${Math.round(current.windGusts)} ${sym.wind}`,
    },
    {
      icon: Gauge,
      label: t("pressure", language),
      value: `${Math.round(current.pressure)} hPa`,
    },
    {
      icon: Cloud,
      label: t("cloudCover", language),
      value: `${Math.round(current.cloudCover)}%`,
    },
    {
      icon: Sun,
      label: t("uvIndex", language),
      value: String(Math.round(current.uvIndex)),
      hint: uvLevel(current.uvIndex, language),
      valueColor: uvColor(current.uvIndex),
    },
    {
      icon: CloudRain,
      label: t("precipitation", language),
      value: `${current.precipitation.toFixed(1)} ${sym.precip}`,
    },
    ...(today
      ? [
          {
            icon: Sunrise,
            label: t("sunrise", language),
            value: formatTime(today.sunrise, language),
          } as DetailItem,
          {
            icon: Sunset,
            label: t("sunset", language),
            value: formatTime(today.sunset, language),
          } as DetailItem,
        ]
      : []),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
      aria-label={t("today", language)}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
          className="flex flex-col gap-1.5 rounded-2xl border border-white/15 p-3 shadow-sm backdrop-blur-md"
          style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.14)" }}
        >
          <div className="flex items-center gap-1.5 text-xs opacity-75">
            <item.icon
              className="size-3.5"
              style={item.rotateIcon != null ? { transform: `rotate(${item.rotateIcon}deg)` } : undefined}
            />
            <span className="truncate">{item.label}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-lg font-semibold leading-none"
              style={item.valueColor ? { color: item.valueColor } : undefined}
            >
              {item.value}
            </span>
            {item.hint && <span className="truncate text-xs opacity-70">{item.hint}</span>}
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}

export default WeatherDetailsGrid;
