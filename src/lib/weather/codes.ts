import type { Language, WeatherCategory } from "./types";

// WMO weather interpretation codes used by Open-Meteo
// https://open-meteo.com/en/docs

interface CodeInfo {
  category: WeatherCategory;
  // [pt, en]
  label: [string, string];
  // short emoji for compact lists
  emoji: string;
}

const CODE_MAP: Record<number, CodeInfo> = {
  0: { category: "clear-day", label: ["Céu limpo", "Clear sky"], emoji: "☀️" },
  1: { category: "clear-day", label: ["Predomínio de sol", "Mainly clear"], emoji: "🌤️" },
  2: { category: "cloudy", label: ["Parcialmente nublado", "Partly cloudy"], emoji: "⛅" },
  3: { category: "overcast", label: ["Encoberto", "Overcast"], emoji: "☁️" },
  45: { category: "fog", label: ["Névoa", "Fog"], emoji: "🌫️" },
  48: { category: "fog", label: ["Névoa com geada", "Depositing rime fog"], emoji: "🌫️" },
  51: { category: "drizzle", label: ["Garoa leve", "Light drizzle"], emoji: "🌦️" },
  53: { category: "drizzle", label: ["Garoa moderada", "Moderate drizzle"], emoji: "🌦️" },
  55: { category: "drizzle", label: ["Garoa intensa", "Dense drizzle"], emoji: "🌧️" },
  56: { category: "freezing", label: ["Garoa congelante", "Freezing drizzle"], emoji: "🌧️" },
  57: { category: "freezing", label: ["Garoa congelante intensa", "Dense freezing drizzle"], emoji: "🌧️" },
  61: { category: "rain", label: ["Chuva leve", "Slight rain"], emoji: "🌦️" },
  63: { category: "rain", label: ["Chuva moderada", "Moderate rain"], emoji: "🌧️" },
  65: { category: "rain", label: ["Chuva forte", "Heavy rain"], emoji: "🌧️" },
  66: { category: "freezing", label: ["Chuva congelante", "Freezing rain"], emoji: "🌧️" },
  67: { category: "freezing", label: ["Chuva congelante forte", "Heavy freezing rain"], emoji: "🌧️" },
  71: { category: "snow", label: ["Neve leve", "Slight snow"], emoji: "🌨️" },
  73: { category: "snow", label: ["Neve moderada", "Moderate snow"], emoji: "🌨️" },
  75: { category: "snow", label: ["Neve forte", "Heavy snow"], emoji: "❄️" },
  77: { category: "snow", label: ["Grãos de neve", "Snow grains"], emoji: "❄️" },
  80: { category: "showers", label: ["Pancadas leves", "Slight showers"], emoji: "🌦️" },
  81: { category: "showers", label: ["Pancadas moderadas", "Moderate showers"], emoji: "🌧️" },
  82: { category: "showers", label: ["Pancadas violentas", "Violent showers"], emoji: "⛈️" },
  85: { category: "snow", label: ["Pancadas de neve leves", "Slight snow showers"], emoji: "🌨️" },
  86: { category: "snow", label: ["Pancadas de neve fortes", "Heavy snow showers"], emoji: "❄️" },
  95: { category: "thunderstorm", label: ["Tempestade", "Thunderstorm"], emoji: "⛈️" },
  96: { category: "thunderstorm", label: ["Tempestade com granizo leve", "Thunderstorm with slight hail"], emoji: "⛈️" },
  99: { category: "thunderstorm", label: ["Tempestade com granizo forte", "Thunderstorm with heavy hail"], emoji: "⛈️" },
};

const DEFAULT_INFO: CodeInfo = {
  category: "cloudy",
  label: ["Indisponível", "Unavailable"],
  emoji: "❓",
};

export function getWeatherInfo(code: number): CodeInfo {
  return CODE_MAP[code] ?? DEFAULT_INFO;
}

export function getWeatherLabel(code: number, lang: Language): string {
  const info = getWeatherInfo(code);
  return info.label[lang === "pt" ? 0 : 1];
}

export function getWeatherEmoji(code: number): string {
  return getWeatherInfo(code).emoji;
}

export function getWeatherCategory(code: number, isDay: boolean): WeatherCategory {
  const base = getWeatherInfo(code).category;
  // Clear sky shows different visuals at night
  if (base === "clear-day") {
    return isDay ? "clear-day" : "clear-night";
  }
  return base;
}
