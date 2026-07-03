"use client";

import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { t } from "@/lib/weather/i18n";
import type { Language, SavedCity } from "@/lib/weather/types";

interface RecentFavoritesProps {
  history: SavedCity[];
  favorites: SavedCity[];
  language: Language;
  onSelect: (city: SavedCity) => void;
  onToggleFav: (city: SavedCity) => void;
  onClearHistory: () => void;
  cardBg?: string;
}

function flagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "📍";
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

export function RecentFavorites({
  history,
  favorites,
  language,
  onSelect,
  onToggleFav,
  onClearHistory,
  cardBg,
}: RecentFavoritesProps) {
  const hasRecent = history.length > 0;
  const hasFav = favorites.length > 0;
  if (!hasRecent && !hasFav) return null;

  return (
    <div className="flex flex-col gap-2">
      {hasFav && (
        <ChipSection
          title={t("favorites", language)}
          cardBg={cardBg}
        >
          <div className="flex flex-wrap gap-1.5">
            {favorites.map((c) => (
              <Chip key={`fav-${c.id}`} active>
                <button
                  type="button"
                  onClick={() => onSelect(c)}
                  className="flex items-center gap-1.5"
                  aria-label={c.name}
                >
                  <span className="text-sm leading-none">{flagEmoji(c.countryCode)}</span>
                  <span className="max-w-[120px] truncate text-sm font-medium">{c.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFav(c)}
                  aria-label={t("removeFavorite", language)}
                  className="ml-0.5 flex size-5 items-center justify-center rounded-full text-amber-300 transition hover:bg-white/20"
                >
                  <Star className="size-3.5 fill-current" />
                </button>
              </Chip>
            ))}
          </div>
        </ChipSection>
      )}

      {hasRecent && (
        <ChipSection
          title={t("recent", language)}
          cardBg={cardBg}
          action={
            <button
              type="button"
              onClick={onClearHistory}
              className="flex items-center gap-1 text-xs opacity-70 transition hover:opacity-100"
            >
              <Trash2 className="size-3" />
              {t("clearHistory", language)}
            </button>
          }
        >
          <div className="flex flex-wrap gap-1.5">
            {history.map((c) => (
              <Chip key={`his-${c.id}-${c.savedAt}`}>
                <button
                  type="button"
                  onClick={() => onSelect(c)}
                  className="flex items-center gap-1.5"
                  aria-label={c.name}
                >
                  <span className="text-sm leading-none">{flagEmoji(c.countryCode)}</span>
                  <span className="max-w-[120px] truncate text-sm">{c.name}</span>
                </button>
              </Chip>
            ))}
          </div>
        </ChipSection>
      )}
    </div>
  );
}

function ChipSection({
  title,
  children,
  action,
  cardBg,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  cardBg?: string;
}) {
  return (
    <div
      className="rounded-2xl border border-white/15 p-3 shadow-sm backdrop-blur-md"
      style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.12)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide opacity-70">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Chip({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={
        "flex items-center rounded-full border border-white/20 py-1 pl-2.5 pr-1.5 text-white backdrop-blur-sm transition " +
        (active ? "bg-white/25" : "bg-white/15 hover:bg-white/20")
      }
    >
      {children}
    </motion.div>
  );
}

export default RecentFavorites;
