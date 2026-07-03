"use client";

import { motion } from "framer-motion";
import { CloudOff, RefreshCw, SearchX, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/weather/i18n";
import type { Language } from "@/lib/weather/types";

type ErrorKind = "network" | "notfound" | "server" | "timeout" | null;

interface ErrorStateProps {
  message: string;
  kind: ErrorKind;
  onRetry: () => void;
  language: Language;
  cardBg?: string;
}

function renderErrorIcon(kind: ErrorKind) {
  if (kind === "network") return <WifiOff className="size-8 opacity-90" />;
  if (kind === "notfound") return <SearchX className="size-8 opacity-90" />;
  return <CloudOff className="size-8 opacity-90" />;
}

export function ErrorState({ message, kind, onRetry, language, cardBg }: ErrorStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl border border-white/15 p-7 text-center shadow-sm backdrop-blur-md"
        style={{ backgroundColor: cardBg ?? "rgba(255,255,255,0.12)" }}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-white/15">
          {renderErrorIcon(kind)}
        </div>
        <p className="text-sm leading-relaxed opacity-90">{message}</p>
        <Button
          type="button"
          onClick={onRetry}
          className="h-10 gap-2 rounded-xl bg-white/20 px-4 text-sm font-medium text-white backdrop-blur-md hover:bg-white/30"
        >
          <RefreshCw className="size-4" />
          {t("retry", language)}
        </Button>
      </motion.div>
    </div>
  );
}

export default ErrorState;
