"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LocateFixed, MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchCities } from "@/lib/weather/api";
import { t } from "@/lib/weather/i18n";
import type { GeoLocation, Language } from "@/lib/weather/types";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  language: Language;
  onSelect: (city: GeoLocation) => void;
  onLocate: () => void;
  locating: boolean;
}

export function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "📍";
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

export function SearchBar({ language, onSelect, onLocate, locating }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);

  // Close on outside click / Escape
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const runSearch = useCallback(
    async (q: string) => {
      const id = ++reqIdRef.current;
      setLoading(true);
      try {
        const res = await searchCities(q, language);
        if (id === reqIdRef.current) {
          setResults(res);
          setOpen(true);
        }
      } catch {
        if (id === reqIdRef.current) setResults([]);
      } finally {
        if (id === reqIdRef.current) setLoading(false);
      }
    },
    [language]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(value), 300);
  };

  const handleSelect = (city: GeoLocation) => {
    onSelect(city);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 opacity-70"
            aria-hidden
          />
          <Input
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={t("searchPlaceholder", language)}
            className="h-11 rounded-2xl border-white/20 bg-white/15 pl-9 pr-9 text-base text-white placeholder:text-white/70 backdrop-blur-md focus-visible:border-white/40 focus-visible:ring-white/20"
            autoComplete="off"
            aria-label={t("search", language)}
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear"
              className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onLocate}
          disabled={locating}
          aria-label={t("useLocation", language)}
          className="h-11 w-11 shrink-0 rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:text-white disabled:opacity-60"
        >
          {locating ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-flex"
            >
              <LocateFixed className="size-5" />
            </motion.span>
          ) : (
            <LocateFixed className="size-5" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {open && (loading || results.length > 0) && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 max-h-72 overflow-y-auto rounded-2xl border border-white/20 bg-neutral-900/80 p-1.5 shadow-2xl backdrop-blur-xl thin-scrollbar"
          >
            {loading && results.length === 0 && (
              <li className="px-3 py-3 text-sm text-white/70">{t("loading", language)}</li>
            )}
            {results.map((city) => (
              <li key={`${city.id}-${city.latitude}`}>
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/15"
                >
                  <MapPin className="size-4 shrink-0 text-white/60" />
                  <span className="text-lg leading-none">{flagEmoji(city.countryCode)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">
                      {city.name}
                    </span>
                    <span className="block truncate text-xs text-white/60">
                      {[city.admin1, city.country].filter(Boolean).join(", ")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
