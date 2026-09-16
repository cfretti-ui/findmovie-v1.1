"use client";

import { motion } from "framer-motion";
import { motionEase } from "@/lib/motion";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label={`Question ${current} of ${total}`}>
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[.14em] text-muted"><span>FindMovie</span><span>{current}/{total}</span></div>
      <div className="h-1 overflow-hidden rounded-full bg-black/[.08] dark:bg-white/[.1]"><motion.div className="h-full rounded-full bg-foreground" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: .35, ease: motionEase }} /></div>
    </div>
  );
}
