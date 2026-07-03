"use client";

import { useState } from "react";
import { Globe, Monitor, Moon, Settings, Sun, Thermometer } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { t } from "@/lib/weather/i18n";
import type { AppSettings, Language, ThemeMode, Units } from "@/lib/weather/types";
import { cn } from "@/lib/utils";

interface SettingsSheetProps {
  settings: AppSettings;
  setUnits: (u: Units) => void;
  setLanguage: (l: Language) => void;
  setThemeMode: (m: ThemeMode) => void;
  cardBg?: string;
  triggerClassName?: string;
}

export function SettingsSheet({
  settings,
  setUnits,
  setLanguage,
  setThemeMode,
  cardBg,
  triggerClassName,
}: SettingsSheetProps) {
  const [open, setOpen] = useState(false);
  const lang = settings.language;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t("settings", lang)}
          className={cn(
            "flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25",
            triggerClassName
          )}
        >
          <Settings className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto w-full max-w-[430px] rounded-t-3xl border-white/15 bg-neutral-900/85 p-5 text-white backdrop-blur-2xl"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-lg font-semibold text-white">
            {t("settings", lang)}
          </SheetTitle>
          <SheetDescription className="text-white/60">
            {t("appName", lang)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-5">
          {/* Units */}
          <Field icon={Thermometer} label={t("units", lang)}>
            <Segmented
              options={[
                { value: "metric", label: "°C" },
                { value: "imperial", label: "°F" },
              ]}
              value={settings.units}
              onChange={(v) => setUnits(v as Units)}
              cardBg={cardBg}
            />
          </Field>

          {/* Language */}
          <Field icon={Globe} label={t("language", lang)}>
            <Segmented
              options={[
                { value: "pt", label: "PT" },
                { value: "en", label: "EN" },
              ]}
              value={settings.language}
              onChange={(v) => setLanguage(v as Language)}
              cardBg={cardBg}
            />
          </Field>

          {/* Theme */}
          <Field icon={settings.themeMode === "dark" ? Moon : Sun} label={t("theme", lang)}>
            <Segmented
              options={[
                { value: "light", label: t("light", lang), icon: Sun },
                { value: "dark", label: t("dark", lang), icon: Moon },
                { value: "system", label: t("system", lang), icon: Monitor },
              ]}
              value={settings.themeMode}
              onChange={(v) => setThemeMode(v as ThemeMode)}
              cardBg={cardBg}
            />
          </Field>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-white/80">
        <Icon className="size-4" />
        {label}
      </div>
      {children}
    </div>
  );
}

interface SegOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

function Segmented({
  options,
  value,
  onChange,
  cardBg,
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
  cardBg?: string;
}) {
  return (
    <div
      className="flex gap-1 rounded-2xl border border-white/15 p-1"
      style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.08)" }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const OptIcon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-white/90 text-neutral-900 shadow-sm"
                : "text-white/80 hover:bg-white/10"
            )}
            aria-pressed={active}
          >
            {OptIcon && <OptIcon className="size-4" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default SettingsSheet;
