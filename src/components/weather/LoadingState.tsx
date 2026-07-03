"use client";

import { motion } from "framer-motion";
import { WeatherIcon } from "./WeatherIcon";
import { t } from "@/lib/weather/i18n";
import type { Language } from "@/lib/weather/types";

interface LoadingStateProps {
  language: Language;
  label?: string;
}

export function LoadingState({ language, label }: LoadingStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <WeatherIcon category="overcast" size={104} className="opacity-90" />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        className="text-base font-medium"
      >
        {label ?? t("loading", language)}
      </motion.p>
    </div>
  );
}

export default LoadingState;
