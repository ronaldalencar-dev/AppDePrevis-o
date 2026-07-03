import type { ThemeMode, WeatherCategory } from "./types";

export interface WeatherTheme {
  // Tailwind gradient classes for the app background
  gradient: string;
  // Accent color (hex) for highlights, progress bars
  accent: string;
  // Soft text color
  text: string;
  // Glass card background
  cardBg: string;
  // Sub-label color
  subtext: string;
  // Emoji/label for the theme
  label: string;
}

// Light-mode gradients per weather category
const LIGHT: Record<WeatherCategory, WeatherTheme> = {
  "clear-day": {
    gradient: "from-sky-400 via-sky-500 to-blue-600",
    accent: "#fbbf24",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.85)",
    cardBg: "rgba(255,255,255,0.18)",
    label: "Ensolarado",
  },
  "clear-night": {
    gradient: "from-indigo-950 via-slate-900 to-blue-950",
    accent: "#818cf8",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.8)",
    cardBg: "rgba(255,255,255,0.08)",
    label: "Noite limpa",
  },
  cloudy: {
    gradient: "from-sky-500 via-slate-500 to-slate-600",
    accent: "#38bdf8",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.85)",
    cardBg: "rgba(255,255,255,0.16)",
    label: "Parcialmente nublado",
  },
  overcast: {
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    accent: "#94a3b8",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.8)",
    cardBg: "rgba(255,255,255,0.14)",
    label: "Encoberto",
  },
  fog: {
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    accent: "#cbd5e1",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.85)",
    cardBg: "rgba(255,255,255,0.18)",
    label: "Névoa",
  },
  drizzle: {
    gradient: "from-sky-600 via-slate-600 to-slate-700",
    accent: "#7dd3fc",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.85)",
    cardBg: "rgba(255,255,255,0.14)",
    label: "Garoa",
  },
  rain: {
    gradient: "from-blue-700 via-blue-800 to-slate-900",
    accent: "#60a5fa",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.82)",
    cardBg: "rgba(255,255,255,0.12)",
    label: "Chuvoso",
  },
  freezing: {
    gradient: "from-cyan-600 via-slate-600 to-slate-800",
    accent: "#67e8f9",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.82)",
    cardBg: "rgba(255,255,255,0.14)",
    label: "Congelante",
  },
  snow: {
    gradient: "from-slate-300 via-slate-400 to-slate-500",
    accent: "#e0f2fe",
    text: "#1e293b",
    subtext: "rgba(30,41,59,0.75)",
    cardBg: "rgba(255,255,255,0.45)",
    label: "Nevando",
  },
  showers: {
    gradient: "from-blue-600 via-slate-700 to-slate-800",
    accent: "#38bdf8",
    text: "#ffffff",
    subtext: "rgba(255,255,255,0.82)",
    cardBg: "rgba(255,255,255,0.12)",
    label: "Pancadas",
  },
  thunderstorm: {
    gradient: "from-slate-800 via-indigo-950 to-slate-900",
    accent: "#a78bfa",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.8)",
    cardBg: "rgba(255,255,255,0.1)",
    label: "Tempestade",
  },
};

// Dark-mode gradients are deeper / richer
const DARK: Record<WeatherCategory, WeatherTheme> = {
  "clear-day": {
    gradient: "from-sky-700 via-blue-800 to-indigo-900",
    accent: "#fcd34d",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.8)",
    cardBg: "rgba(255,255,255,0.08)",
    label: "Ensolarado",
  },
  "clear-night": {
    gradient: "from-slate-950 via-indigo-950 to-black",
    accent: "#818cf8",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.75)",
    cardBg: "rgba(255,255,255,0.07)",
    label: "Noite limpa",
  },
  cloudy: {
    gradient: "from-slate-700 via-slate-800 to-slate-900",
    accent: "#38bdf8",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.78)",
    cardBg: "rgba(255,255,255,0.08)",
    label: "Parcialmente nublado",
  },
  overcast: {
    gradient: "from-slate-700 via-slate-800 to-zinc-900",
    accent: "#94a3b8",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.75)",
    cardBg: "rgba(255,255,255,0.07)",
    label: "Encoberto",
  },
  fog: {
    gradient: "from-slate-700 via-slate-800 to-slate-900",
    accent: "#cbd5e1",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.78)",
    cardBg: "rgba(255,255,255,0.09)",
    label: "Névoa",
  },
  drizzle: {
    gradient: "from-slate-800 via-blue-900 to-slate-950",
    accent: "#7dd3fc",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.78)",
    cardBg: "rgba(255,255,255,0.08)",
    label: "Garoa",
  },
  rain: {
    gradient: "from-blue-900 via-slate-900 to-black",
    accent: "#60a5fa",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.75)",
    cardBg: "rgba(255,255,255,0.07)",
    label: "Chuvoso",
  },
  freezing: {
    gradient: "from-cyan-900 via-slate-900 to-black",
    accent: "#67e8f9",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.75)",
    cardBg: "rgba(255,255,255,0.08)",
    label: "Congelante",
  },
  snow: {
    gradient: "from-slate-600 via-slate-700 to-slate-800",
    accent: "#e0f2fe",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.8)",
    cardBg: "rgba(255,255,255,0.12)",
    label: "Nevando",
  },
  showers: {
    gradient: "from-blue-900 via-slate-900 to-black",
    accent: "#38bdf8",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.75)",
    cardBg: "rgba(255,255,255,0.07)",
    label: "Pancadas",
  },
  thunderstorm: {
    gradient: "from-slate-950 via-indigo-950 to-black",
    accent: "#a78bfa",
    text: "#f8fafc",
    subtext: "rgba(248,250,252,0.75)",
    cardBg: "rgba(255,255,255,0.07)",
    label: "Tempestade",
  },
};

export function getWeatherTheme(category: WeatherCategory, mode: "light" | "dark"): WeatherTheme {
  return (mode === "dark" ? DARK : LIGHT)[category];
}

export function resolveThemeMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }
  return mode;
}
