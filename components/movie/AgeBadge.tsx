"use client";

import { ageBadgeLabel } from "@/lib/i18n/format";
import { useLocale } from "@/lib/i18n/locale-context";

interface AgeBadgeProps {
  badge?: "all" | "10" | "12" | "16" | "18" | null;
  adult?: boolean;
  className?: string;
}

export function AgeBadge({ badge, adult = false, className = "" }: AgeBadgeProps) {
  const { t } = useLocale();
  const label = ageBadgeLabel(t, badge);

  if (!label && !adult) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {label ? (
        <span className="rounded-full border border-white/15 bg-black/25 px-2 py-0.5 text-[11px] font-medium tracking-[0.02em] text-white/90 backdrop-blur-[20px]">
          {label}
        </span>
      ) : null}
      {adult ? (
        <span className="rounded-full border border-white/15 bg-black/25 px-2 py-0.5 text-[11px] font-medium tracking-[0.02em] text-white/90 backdrop-blur-[20px]">
          {t("age.adult")}
        </span>
      ) : null}
    </span>
  );
}

export function ContentBadge({
  badge,
  adult = false,
  inverted = false,
}: AgeBadgeProps & { inverted?: boolean }) {
  const { t } = useLocale();
  const label = ageBadgeLabel(t, badge);

  if (!label && !adult) return null;

  const chip = inverted
    ? "rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-[20px]"
    : "rounded-full border border-border/80 bg-glass px-2 py-0.5 text-[11px] font-medium text-muted backdrop-blur-[20px]";

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {label ? <span className={chip}>{label}</span> : null}
      {adult ? <span className={chip}>{t("age.adult")}</span> : null}
    </span>
  );
}
