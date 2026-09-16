"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { motionEase } from "@/lib/motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  interactive = false,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.28, ease: motionEase }}
      className={`glass-surface ${interactive ? "glass-interactive" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
