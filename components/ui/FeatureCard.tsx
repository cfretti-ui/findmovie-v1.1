"use client";

import { GlassCard } from "@/components/ui/GlassCard";

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
}

export function FeatureCard({ emoji, title, description }: FeatureCardProps) {
  return (
    <GlassCard className="h-full">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-soft ring-1 ring-border/60">
        <span aria-hidden="true">{emoji}</span>
      </div>
      <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
        {description}
      </p>
    </GlassCard>
  );
}
