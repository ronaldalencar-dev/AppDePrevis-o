"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, RefreshCw } from "lucide-react";
import { t } from "@/lib/weather/i18n";
import type { Language } from "@/lib/weather/types";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  language: Language;
  accent?: string;
  className?: string;
}

const THRESHOLD = 70;
const RESISTANCE = 0.5;
const MAX_PULL = 120;

export function PullToRefresh({
  onRefresh,
  children,
  language,
  accent,
  className,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const pullingRef = useRef(false);
  const pullRef = useRef(0);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const setPullBoth = useCallback((v: number) => {
    pullRef.current = v;
    setPull(v);
  }, []);

  const doRefresh = useCallback(async () => {
    setRefreshing(true);
    setPullBoth(THRESHOLD);
    try {
      await onRefreshRef.current();
    } finally {
      setRefreshing(false);
      setPullBoth(0);
    }
  }, [setPullBoth]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onStart(e: TouchEvent) {
      if (refreshing) return;
      if (el.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
        pullingRef.current = true;
      } else {
        startYRef.current = null;
        pullingRef.current = false;
      }
    }

    function onMove(e: TouchEvent) {
      if (!pullingRef.current || startYRef.current == null || refreshing) return;
      const dy = e.touches[0].clientY - startYRef.current;
      if (dy <= 0) {
        if (pullRef.current !== 0) setPullBoth(0);
        return;
      }
      if (el.scrollTop <= 0) {
        e.preventDefault();
        const distance = Math.min(dy * RESISTANCE, MAX_PULL);
        setPullBoth(distance);
      }
    }

    function onEnd() {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      startYRef.current = null;
      if (pullRef.current >= THRESHOLD) {
        void doRefresh();
      } else {
        setPullBoth(0);
      }
    }

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [refreshing, doRefresh, setPullBoth]);

  const progress = Math.min(pull / THRESHOLD, 1);

  return (
    <div className="relative min-h-0 flex-1">
      {/* Pull indicator (fixed at top of the scroll viewport) */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2"
        animate={{
          y: Math.max(pull - 34, -34),
          opacity: pull > 4 || refreshing ? 1 : 0,
        }}
        transition={{ duration: refreshing ? 0.2 : 0.12 }}
        aria-hidden
      >
        <div
          className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md"
          style={{ color: accent ?? "currentColor" }}
        >
          {refreshing ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="size-4" />
            </motion.span>
          ) : (
            <motion.span
              animate={{ rotate: progress * 180 }}
              transition={{ duration: 0.05 }}
            >
              <ChevronDown className="size-5" />
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Desktop fallback refresh button (fixed top-right of the scroll viewport) */}
      <button
        type="button"
        onClick={() => void doRefresh()}
        disabled={refreshing}
        aria-label={t("refreshing", language)}
        className="absolute right-3 top-3 z-20 hidden size-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 disabled:opacity-60 md:flex"
      >
        <motion.span
          animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0 }}
        >
          <RefreshCw className="size-4" />
        </motion.span>
      </button>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className={`thin-scrollbar h-full overflow-y-auto ${className ?? ""}`}
      >
        <motion.div
          animate={{ y: pull }}
          transition={refreshing ? { duration: 0.2 } : { type: "spring", stiffness: 350, damping: 35 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default PullToRefresh;
