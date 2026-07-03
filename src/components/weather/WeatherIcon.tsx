"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { WeatherCategory } from "@/lib/weather/types";

interface WeatherIconProps {
  category: WeatherCategory;
  size?: number;
  className?: string;
}

/**
 * Animated weather icons built from inline SVG + framer-motion.
 * Every icon uses `currentColor` so the parent controls the colour
 * (the app sets `color` from the active weather theme).
 */
export function WeatherIcon({ category, size = 96, className }: WeatherIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {renderIcon(category)}
    </svg>
  );
}

function renderIcon(category: WeatherCategory) {
  switch (category) {
    case "clear-day":
      return <ClearDay />;
    case "clear-night":
      return <ClearNight />;
    case "cloudy":
      return <Cloudy />;
    case "overcast":
      return <Overcast />;
    case "fog":
      return <Fog />;
    case "drizzle":
      return <Precipitation dropCount={4} swell={0} />;
    case "rain":
      return <Precipitation dropCount={5} swell={0} heavy />;
    case "showers":
      return <Precipitation dropCount={6} swell={0} heavy />;
    case "freezing":
      return <Precipitation dropCount={4} swell={0} freezing />;
    case "snow":
      return <Snow />;
    case "thunderstorm":
      return <Thunderstorm />;
    default:
      return <Overcast />;
  }
}

/* ---------- Reusable shapes ---------- */

function Cloud({
  cx = 50,
  cy = 52,
  scale = 1,
  opacity = 1,
}: {
  cx?: number;
  cy?: number;
  scale?: number;
  opacity?: number;
}) {
  // A soft cloud silhouette built from overlapping circles + a rounded base.
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-50} ${-50})`}
      opacity={opacity}
    >
      <circle cx="34" cy="56" r="13" fill="currentColor" />
      <circle cx="52" cy="48" r="18" fill="currentColor" />
      <circle cx="70" cy="55" r="12" fill="currentColor" />
      <rect x="28" y="54" width="48" height="16" rx="8" fill="currentColor" />
    </g>
  );
}

function Sun({
  cx = 50,
  cy = 42,
  r = 16,
  withRays = true,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  withRays?: boolean;
}) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    const inner = r + 7;
    const outer = r + 17;
    return {
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cy + Math.sin(angle) * outer,
    };
  });
  return (
    <g>
      {withRays && (
        <motion.g
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {rays.map((ray, i) => (
            <line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke="currentColor"
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
        </motion.g>
      )}
      <circle cx={cx} cy={cy} r={r} fill="currentColor" />
    </g>
  );
}

/* ---------- Category icons ---------- */

function ClearDay() {
  return <Sun cx={50} cy={46} r={17} />;
}

function ClearNight() {
  const maskId = useId();
  // Crescent moon (a circle with a bite taken out via a masking circle)
  return (
    <g>
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="black" />
          <circle cx="52" cy="50" r="22" fill="white" />
          <circle cx="62" cy="44" r="18" fill="black" />
        </mask>
      </defs>
      <circle cx="52" cy="50" r="22" fill="currentColor" mask={`url(#${maskId})`} />
      {/* Twinkling stars */}
      {[
        { cx: 24, cy: 28, r: 1.6, d: 0 },
        { cx: 78, cy: 34, r: 2.1, d: 0.6 },
        { cx: 30, cy: 66, r: 1.4, d: 1.1 },
        { cx: 74, cy: 70, r: 1.7, d: 1.7 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="currentColor"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.15, 0.7] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            delay: s.d,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
        />
      ))}
    </g>
  );
}

function Cloudy() {
  return (
    <g>
      <g opacity={0.9}>
        <Sun cx={36} cy={36} r={12} />
      </g>
      <motion.g
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud cx={54} cy={58} scale={0.92} />
      </motion.g>
    </g>
  );
}

function Overcast() {
  return (
    <g>
      <g opacity={0.55}>
        <Cloud cx={42} cy={44} scale={0.7} />
      </g>
      <motion.g
        animate={{ x: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud cx={52} cy={56} scale={1} />
      </motion.g>
    </g>
  );
}

function Fog() {
  return (
    <g>
      <Cloud cx={50} cy={44} scale={0.85} />
      {[62, 70, 78].map((y, i) => (
        <motion.line
          key={y}
          x1={22}
          y1={y}
          x2={78}
          y2={y}
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          opacity={0.75}
          animate={{ x1: [22, 30, 22], x2: [78, 70, 78] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
}

function Precipitation({
  dropCount,
  heavy = false,
  freezing = false,
}: {
  dropCount: number;
  heavy?: boolean;
  freezing?: boolean;
}) {
  const startX = 30;
  const span = 40;
  const drops = Array.from({ length: dropCount }, (_, i) => ({
    cx: startX + (span / (dropCount - 1)) * i,
    delay: (i * 0.25) % 1.2,
  }));
  return (
    <g>
      <Cloud cx={50} cy={42} scale={0.85} />
      {drops.map((d, i) => (
        <motion.line
          key={i}
          x1={d.cx}
          y1={66}
          x2={d.cx - (freezing ? 0 : 2)}
          y2={72}
          stroke="currentColor"
          strokeWidth={heavy ? 3.2 : 2.6}
          strokeLinecap="round"
          animate={{
            y1: [62, 92],
            y2: [68, 98],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: heavy ? 0.9 : 1.2,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </g>
  );
}

function Snow() {
  const flakes = Array.from({ length: 5 }, (_, i) => ({
    cx: 30 + (40 / 4) * i,
    delay: (i * 0.4) % 2,
  }));
  return (
    <g>
      <Cloud cx={50} cy={42} scale={0.85} />
      {flakes.map((f, i) => (
        <motion.circle
          key={i}
          cx={f.cx}
          cy={66}
          r={2.6}
          fill="currentColor"
          animate={{
            cy: [62, 92],
            cx: [f.cx, f.cx + 5, f.cx - 4, f.cx],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </g>
  );
}

function Thunderstorm() {
  // Lightning bolt path
  const bolt =
    "M 52 60 L 42 78 L 50 80 L 44 96 L 62 74 L 53 72 L 60 60 Z";
  return (
    <g>
      <Cloud cx={50} cy={42} scale={0.9} opacity={0.95} />
      {/* Rain underneath */}
      {[34, 46, 64].map((x, i) => (
        <motion.line
          key={i}
          x1={x}
          y1={64}
          x2={x - 2}
          y2={70}
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={0.7}
          animate={{ y1: [62, 88], y2: [68, 94], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeIn",
          }}
        />
      ))}
      <motion.path
        d={bolt}
        fill="currentColor"
        animate={{ opacity: [0, 0, 1, 0.5, 1, 0, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0, 0.45, 0.5, 0.55, 0.6, 0.7, 1],
          ease: "easeInOut",
        }}
      />
    </g>
  );
}

export default WeatherIcon;
