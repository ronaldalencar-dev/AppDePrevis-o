import type { Language } from "./types";

type Dict = Record<string, [string, string]>; // [pt, en]

const DICT: Dict = {
  appName: ["Clima", "Weather"],
  searchPlaceholder: ["Buscar cidade...", "Search city..."],
  search: ["Buscar", "Search"],
  useLocation: ["Usar minha localização", "Use my location"],
  feelsLike: ["Sensação", "Feels like"],
  humidity: ["Umidade", "Humidity"],
  wind: ["Vento", "Wind"],
  pressure: ["Pressão", "Pressure"],
  uvIndex: ["Índice UV", "UV Index"],
  sunrise: ["Nascer do sol", "Sunrise"],
  sunset: ["Pôr do sol", "Sunset"],
  max: ["Máx", "Max"],
  min: ["Mín", "Min"],
  today: ["Hoje", "Today"],
  tomorrow: ["Amanhã", "Tomorrow"],
  forecast5: ["Previsão para 5 dias", "5-day forecast"],
  hourly: ["Próximas 24 horas", "Next 24 hours"],
  recent: ["Pesquisas recentes", "Recent searches"],
  favorites: ["Favoritos", "Favorites"],
  noFavorites: ["Nenhum favorito ainda", "No favorites yet"],
  noRecent: ["Nenhuma pesquisa recente", "No recent searches"],
  addFavorite: ["Adicionar aos favoritos", "Add to favorites"],
  removeFavorite: ["Remover dos favoritos", "Remove from favorites"],
  clearHistory: ["Limpar histórico", "Clear history"],
  settings: ["Configurações", "Settings"],
  units: ["Unidade", "Units"],
  celsius: ["Celsius (°C)", "Celsius (°C)"],
  fahrenheit: ["Fahrenheit (°F)", "Fahrenheit (°F)"],
  language: ["Idioma", "Language"],
  theme: ["Tema", "Theme"],
  light: ["Claro", "Light"],
  dark: ["Escuro", "Dark"],
  system: ["Sistema", "System"],
  share: ["Compartilhar", "Share"],
  shareText: ["Clima em", "Weather in"],
  retry: ["Tentar novamente", "Try again"],
  noInternet: ["Sem conexão com a internet", "No internet connection"],
  apiError: ["Erro ao buscar dados do clima", "Failed to fetch weather data"],
  cityNotFound: ["Cidade não encontrada", "City not found"],
  loading: ["Carregando...", "Loading..."],
  detectingLocation: ["Detectando localização...", "Detecting location..."],
  locationDenied: ["Permissão de localização negada", "Location permission denied"],
  pullToRefresh: ["Puxe para atualizar", "Pull to refresh"],
  releaseToRefresh: ["Solte para atualizar", "Release to refresh"],
  refreshing: ["Atualizando...", "Refreshing..."],
  airQuality: ["Qualidade do ar", "Air quality"],
  good: ["Boa", "Good"],
  moderate: ["Moderada", "Moderate"],
  unhealthy: ["Insalubre", "Unhealthy"],
  veryUnhealthy: ["Muito insalubre", "Very unhealthy"],
  hazardous: ["Perigosa", "Hazardous"],
  low: ["Baixo", "Low"],
  high: ["Alto", "High"],
  veryHigh: ["Muito alto", "Very high"],
  extreme: ["Extremo", "Extreme"],
  cloudCover: ["Nuvens", "Cloud cover"],
  gusts: ["Rajadas", "Gusts"],
  precipitation: ["Precipitação", "Precipitation"],
  rainChance: ["Chance de chuva", "Rain chance"],
  updated: ["Atualizado", "Updated"],
  myLocation: ["Minha localização", "My location"],
};

export function t(key: keyof typeof DICT | string, lang: Language): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[lang === "pt" ? 0 : 1];
}

export function formatTemp(value: number, units: "metric" | "imperial"): string {
  const sym = units === "metric" ? "°" : "°";
  return `${Math.round(value)}${sym}`;
}

export function formatDay(dateStr: string, lang: Language): string {
  const date = new Date(dateStr);
  const days =
    lang === "pt"
      ? ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
      : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

export function formatShortDay(dateStr: string, lang: Language): string {
  const date = new Date(dateStr);
  const days =
    lang === "pt"
      ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

export function formatTime(dateStr: string, lang: Language): string {
  if (!dateStr) return "--:--";
  const date = new Date(dateStr);
  return date.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatHour(dateStr: string, lang: Language): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function uvLevel(uv: number, lang: Language): string {
  if (uv < 3) return t("low", lang);
  if (uv < 6) return t("moderate", lang);
  if (uv < 8) return t("high", lang);
  if (uv < 11) return t("veryHigh", lang);
  return t("extreme", lang);
}

export function aqiLevel(aqi: number, lang: Language): string {
  // European AQI scale: 0-20 good, 20-40 fair, 40-60 moderate, 60-80 poor, 80-100 very poor, >100 extremely poor
  if (aqi <= 20) return t("good", lang);
  if (aqi <= 40) return t("good", lang);
  if (aqi <= 60) return t("moderate", lang);
  if (aqi <= 80) return t("unhealthy", lang);
  if (aqi <= 100) return t("veryUnhealthy", lang);
  return t("hazardous", lang);
}
