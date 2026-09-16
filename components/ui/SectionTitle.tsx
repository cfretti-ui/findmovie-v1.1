"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  eyebrow?: string;
  action?: ReactNode;
}

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  eyebrow,
  action,
}: SectionTitleProps) {
  return (
    <motion.div
      {...fadeUp}
      className={`mb-10 flex flex-col gap-3 sm:mb-12 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      } ${action ? "sm:flex-row sm:items-end sm:justify-between" : ""}`}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-xl"}>
        {eyebrow ? (
          <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.08em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-[17px]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </motion.div>
  );
}
