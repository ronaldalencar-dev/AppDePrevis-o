import type {
  AirQuality,
  CurrentWeather,
  DailyForecastItem,
  GeoLocation,
  HourlyForecastItem,
  Units,
  WeatherData,
} from "./types";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
// Use the ensemble endpoint: it exposes the same variables as the deterministic
// forecast API (current / hourly / daily incl. sunrise, sunset, uv_index,
// precipitation_probability) and is reliably reachable. We read the control
// member (`*_member01`) which corresponds to the deterministic run.
const FORECAST_URL = "https://ensemble-api.open-meteo.com/v1/ensemble";
const AIR_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const REVERSE_GEO_URL = "https://geocoding-api.open-meteo.com/v1/reverse";

const TIMEOUT_MS = 12000;

class WeatherApiError extends Error {
  constructor(message: string, public readonly kind: "network" | "notfound" | "server" | "timeout") {
    super(message);
    this.name = "WeatherApiError";
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    return res;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new WeatherApiError("Request timed out", "timeout");
    }
    throw new WeatherApiError("Network error. Check your internet connection.", "network");
  } finally {
    clearTimeout(timer);
  }
}

/** Search cities by name. Returns up to 8 results. */
export async function searchCities(query: string, language: "pt" | "en" = "pt"): Promise<GeoLocation[]> {
  const q = query.trim();
  if (!q) return [];
  const params = new URLSearchParams({
    name: q,
    count: "8",
    language,
    format: "json",
  });
  const res = await fetchWithTimeout(`${GEO_URL}?${params.toString()}`);
  if (!res.ok) throw new WeatherApiError("Search service unavailable", "server");
  const data = await res.json();
  if (!data.results || data.results.length === 0) return [];
  return data.results.map((r: Record<string, unknown>, idx: number): GeoLocation => ({
    id: (r.id as number) ?? idx,
    name: r.name as string,
    latitude: r.latitude as number,
    longitude: r.longitude as number,
    country: (r.country as string) ?? "",
    countryCode: (r.country_code as string) ?? "",
    admin1: r.admin1 as string | undefined,
    timezone: r.timezone as string | undefined,
  }));
}

/** Reverse geocode a coordinate into a named location. */
export async function reverseGeocode(lat: number, lon: number, language: "pt" | "en" = "pt"): Promise<GeoLocation> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    language,
    count: "1",
    format: "json",
  });
  try {
    const res = await fetchWithTimeout(`${REVERSE_GEO_URL}?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        return {
          id: r.id ?? Math.round(lat * 1000 + lon * 1000),
          name: r.name,
          latitude: r.latitude,
          longitude: r.longitude,
          country: r.country ?? "",
          countryCode: r.country_code ?? "",
          admin1: r.admin1,
          timezone: r.timezone,
        };
      }
    }
  } catch {
    // fall through to fallback
  }
  // Fallback if reverse geocoding is unavailable
  return {
    id: Math.round(lat * 1000 + lon * 1000),
    name: "Minha localização",
    latitude: lat,
    longitude: lon,
    country: "",
    countryCode: "",
    admin1: undefined,
    timezone: undefined,
  };
}

const UNIT_SUFFIX: Record<Units, { temp: string; wind: string; precip: string }> = {
  metric: { temp: "°C", wind: "km/h", precip: "mm" },
  imperial: { temp: "°F", wind: "mph", precip: "in" },
};

export function unitSymbol(units: Units) {
  return UNIT_SUFFIX[units];
}

/**
 * Pick a value from an ensemble response: prefer the control member
 * (`<key>_member01`), fall back to the aggregate `<key>`. Returns 0 when both
 * are missing/null so downstream Number() coercion stays safe.
 */
function memberValue(group: Record<string, unknown[]> | undefined, key: string, idx: number): number {
  if (!group) return 0;
  const memberArr = group[`${key}_member01`];
  if (Array.isArray(memberArr) && memberArr[idx] != null) {
    return Number(memberArr[idx]);
  }
  const baseArr = group[key];
  if (Array.isArray(baseArr) && baseArr[idx] != null) {
    return Number(baseArr[idx]);
  }
  return 0;
}

/** Fetch the full weather bundle for a location. */
export async function fetchWeather(location: GeoLocation, units: Units): Promise<WeatherData> {
  const tempUnit = units === "metric" ? "celsius" : "fahrenheit";
  const windUnit = units === "metric" ? "kmh" : "mph";
  const precipUnit = units === "metric" ? "mm" : "inch";

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ].join(","),
    hourly: ["temperature_2m", "weather_code", "precipitation_probability", "is_day", "uv_index"].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max",
    ].join(","),
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit,
    precipitation_unit: precipUnit,
    forecast_days: "7",
  });

  const res = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new WeatherApiError("Weather service unavailable", "server");
  const data = await res.json();

  const currentRaw = data.current ?? {};
  // The ensemble `current` block exposes single (non-member) values.
  const nowIso = (currentRaw.time as string | undefined) ?? new Date().toISOString();
  // current.time may carry minutes (e.g. 13:15); hourly is aligned to the
  // whole hour, so match by the `YYYY-MM-DDTHH` prefix to locate the UV value.
  const nowHourPrefix = nowIso.slice(0, 13); // "YYYY-MM-DDTHH"
  let uvIndex = 0;
  const hourlyTimesRaw = (data.hourly?.time ?? []) as string[];
  const uvHourIdx = Math.max(0, hourlyTimesRaw.findIndex((t) => String(t).slice(0, 13) === nowHourPrefix));
  if (Array.isArray(data.hourly?.uv_index)) {
    uvIndex = Number(memberValue(data.hourly, "uv_index", uvHourIdx)) || 0;
  }

  const current: CurrentWeather = {
    temperature: Number(currentRaw.temperature_2m ?? 0),
    apparentTemperature: Number(currentRaw.apparent_temperature ?? 0),
    isDay: Number(currentRaw.is_day ?? 1) === 1,
    weatherCode: Number(currentRaw.weather_code ?? 0),
    humidity: Number(currentRaw.relative_humidity_2m ?? 0),
    pressure: Number(currentRaw.pressure_msl ?? currentRaw.surface_pressure ?? 1013),
    windSpeed: Number(currentRaw.wind_speed_10m ?? 0),
    windDirection: Number(currentRaw.wind_direction_10m ?? 0),
    windGusts: Number(currentRaw.wind_gusts_10m ?? 0),
    cloudCover: Number(currentRaw.cloud_cover ?? 0),
    precipitation: Number(currentRaw.precipitation ?? 0),
    uvIndex,
    time: currentRaw.time ?? new Date().toISOString(),
  };

  const dailyGroup = data.daily ?? {};
  const daily: DailyForecastItem[] = (data.daily?.time ?? []).map((date: string, i: number) => ({
    date,
    weatherCode: memberValue(dailyGroup, "weather_code", i),
    tempMax: memberValue(dailyGroup, "temperature_2m_max", i),
    tempMin: memberValue(dailyGroup, "temperature_2m_min", i),
    // sunrise/sunset are astronomical -> same for every member, read base key
    sunrise: Array.isArray(dailyGroup.sunrise) ? String(dailyGroup.sunrise[i] ?? "") : "",
    sunset: Array.isArray(dailyGroup.sunset) ? String(dailyGroup.sunset[i] ?? "") : "",
    uvIndexMax: memberValue(dailyGroup, "uv_index_max", i),
    precipitationProbability: memberValue(dailyGroup, "precipitation_probability_max", i),
    precipitationSum: memberValue(dailyGroup, "precipitation_sum", i),
    windSpeedMax: memberValue(dailyGroup, "wind_speed_10m_max", i),
  }));

  // build hourly for next 24h starting from the current hour
  const startIdx = uvHourIdx;
  const hourlyGroup = data.hourly ?? {};
  const hourly: HourlyForecastItem[] = hourlyTimesRaw
    .slice(startIdx, startIdx + 24)
    .map((time: string, i: number) => {
      const realIdx = startIdx + i;
      return {
        time,
        temperature: memberValue(hourlyGroup, "temperature_2m", realIdx),
        weatherCode: memberValue(hourlyGroup, "weather_code", realIdx),
        precipitationProbability: memberValue(hourlyGroup, "precipitation_probability", realIdx),
        isDay: memberValue(hourlyGroup, "is_day", realIdx) === 1,
      };
    });

  // Air quality (best effort, non-fatal)
  let airQuality: AirQuality | null = null;
  try {
    const aqParams = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: ["pm10", "pm2_5", "european_aqi", "us_aqi"].join(","),
      timezone: "auto",
    });
    const aqRes = await fetchWithTimeout(`${AIR_URL}?${aqParams.toString()}`);
    if (aqRes.ok) {
      const aqData = await aqRes.json();
      const c = aqData.current ?? {};
      airQuality = {
        pm10: Number(c.pm10 ?? 0),
        pm2_5: Number(c.pm2_5 ?? 0),
        europeanAqi: Number(c.european_aqi ?? 0),
        usAqi: Number(c.us_aqi ?? 0),
      };
    }
  } catch {
    airQuality = null;
  }

  return {
    location,
    current,
    daily,
    hourly,
    airQuality,
    fetchedAt: Date.now(),
  };
}

export { WeatherApiError };
