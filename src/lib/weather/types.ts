// Core weather domain types

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string; // state / region
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  isDay: boolean;
  weatherCode: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  cloudCover: number;
  precipitation: number;
  uvIndex: number;
  time: string;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface AirQuality {
  pm10: number;
  pm2_5: number;
  europeanAqi: number;
  usAqi: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  airQuality: AirQuality | null;
  fetchedAt: number;
}

export type Units = "metric" | "imperial";
export type Language = "pt" | "en";
export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  units: Units;
  language: Language;
  themeMode: ThemeMode;
}

export interface SavedCity extends GeoLocation {
  savedAt: number;
}

export type WeatherCategory =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "freezing"
  | "snow"
  | "showers"
  | "thunderstorm";
