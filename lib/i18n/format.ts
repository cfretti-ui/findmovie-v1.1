import type { ReasonToken } from "@/lib/scoring";

type Translate = (path: string, vars?: Record<string, string | number>) => string;

const PARAM_OPTION_KEYS = ["mood", "energy", "intensity", "language", "watchingWith"];

export function localizeGenreLabel(t: Translate, genre: string): string {
  if (genre === "Family") return t("options.FamilyGenre");
  return t(`options.${genre}`) === `options.${genre}` ? genre : t(`options.${genre}`);
}

export function localizeReason(t: Translate, reason: ReasonToken): string {
  const params: Record<string, string> = { ...(reason.params ?? {}) };

  for (const key of PARAM_OPTION_KEYS) {
    if (params[key]) {
      const translated = t(`options.${params[key]}`);
      params[key] = translated.startsWith("options.") ? params[key] : translated;
    }
  }

  if (params.genres) {
    params.genres = params.genres
      .split(" · ")
      .map((genre) => localizeGenreLabel(t, genre.trim()))
      .join(" · ");
  }

  return t(reason.key, params);
}

export function ageBadgeLabel(
  t: Translate,
  badge: "all" | "10" | "12" | "16" | "18" | null | undefined,
): string | null {
  if (!badge) return null;
  return t(`age.${badge}`);
}
