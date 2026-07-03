"use client";

import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: React.ReactNode;
  /** Tailwind gradient stops, e.g. "from-sky-400 via-sky-500 to-blue-600" */
  themeGradient?: string;
}

/**
 * Responsive shell.
 * - Mobile (< md): full-screen, no frame, the weather gradient fills the screen.
 * - Desktop (>= md): renders children inside a phone mockup (430px wide) with a
 *   rounded border, drop shadow and a subtle notch, centered on a neutral stage.
 */
export function PhoneFrame({ children, themeGradient }: PhoneFrameProps) {
  const gradient = themeGradient ?? "from-sky-400 via-sky-500 to-blue-600";

  return (
    <div className="flex min-h-screen w-full items-stretch justify-center bg-neutral-200 md:bg-neutral-300 md:p-6 dark:bg-neutral-950 md:dark:bg-black">
      {/* Mobile: full screen shell */}
      <div
        className={cn(
          "relative flex h-dvh w-full flex-col overflow-hidden bg-gradient-to-br transition-colors duration-700 md:hidden",
          gradient
        )}
      >
        {children}
      </div>

      {/* Desktop: phone mockup */}
      <div
        className={cn(
          "relative hidden h-[88vh] max-h-[880px] min-h-[640px] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.5rem] border-8 border-zinc-900 bg-gradient-to-br shadow-2xl transition-colors duration-700 md:flex",
          gradient
        )}
      >
        {/* Notch */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
        {/* Subtle screen gloss */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        {children}
      </div>
    </div>
  );
}

export default PhoneFrame;
