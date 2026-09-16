"use client";

import { motion } from "framer-motion";
import { motionEase } from "@/lib/motion";

export function QuestionCard({ label, selected, onSelect, multiple = false }: { label: string; selected: boolean; onSelect: () => void; multiple?: boolean }) {
  return (
    <motion.button type="button" role={multiple ? "checkbox" : "radio"} aria-checked={selected} onClick={onSelect} whileTap={{ scale: .975 }} transition={{ duration: .18, ease: motionEase }} className={`group fm-focus-ring w-full rounded-[22px] border px-5 py-4 text-left text-[15px] font-medium tracking-[-.015em] transition-all duration-300 sm:px-6 sm:py-[18px] sm:text-base ${selected ? "border-foreground bg-foreground text-background shadow-lg" : "border-black/[.07] bg-white/55 text-foreground shadow-sm backdrop-blur-2xl hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/[.09] dark:bg-white/[.06] dark:hover:bg-white/[.1]"}`}>
      <span className="flex items-center gap-3">
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-background/60 bg-background/10" : "border-black/10 dark:border-white/15"}`} aria-hidden="true">
          {selected ? <span className="h-2 w-2 rounded-full bg-current" /> : null}
        </span>
        <span>{label}</span>
        {selected ? <span className="ml-auto text-xs opacity-60">✓</span> : null}
      </span>
    </motion.button>
  );
}
