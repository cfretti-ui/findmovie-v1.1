import type { AgeMax } from "@/types/questionnaire";

export type CertificationSource = "FR" | "US" | "other" | "unknown";

export interface AgeCertification {
  /** Numeric rank used for filtering. 0 = all audiences. null = unknown. */
  rank: number | null;
  /** Stable badge key: all | 10 | 12 | 16 | 18 */
  badge: "all" | "10" | "12" | "16" | "18" | null;
  raw: string | null;
  source: CertificationSource;
}

interface TmdbReleaseEntry {
  certification?: string;
  note?: string;
}

interface TmdbReleaseCountry {
  iso_3166_1: string;
  release_dates?: TmdbReleaseEntry[];
}

export interface TmdbReleaseDatesLike {
  results?: TmdbReleaseCountry[];
}

const FR_ALL = [
  "U",
  "TP",
  "TOUS PUBLICS",
  "TOUS PUBLICS AVEC AVERTISSEMENT",
];

function firstCert(
  results: TmdbReleaseCountry[] | undefined,
  country: string,
): string | null {
  const match = results?.find((item) => item.iso_3166_1 === country);
  const certs = (match?.release_dates ?? [])
    .map((entry) => entry.certification?.trim())
    .filter((value): value is string => Boolean(value));
  return certs[0] ?? null;
}

function parseFrenchCertification(raw: string): Pick<AgeCertification, "rank" | "badge"> | null {
  const normalized = raw.trim().toUpperCase().replace(/[()]/g, " ").replace(/\s+/g, " ");

  if (!normalized) return null;
  if (FR_ALL.some((token) => normalized === token || normalized.startsWith(token))) {
    return { rank: 0, badge: "all" };
  }
  if (/\b18\b/.test(normalized) || normalized.includes("-18")) {
    return { rank: 18, badge: "18" };
  }
  if (/\b16\b/.test(normalized) || normalized.includes("-16")) {
    return { rank: 16, badge: "16" };
  }
  if (/\b12\b/.test(normalized) || normalized.includes("-12")) {
    return { rank: 12, badge: "12" };
  }
  if (/\b10\b/.test(normalized) || normalized.includes("-10")) {
    return { rank: 10, badge: "10" };
  }
  return null;
}

function parseUsCertification(raw: string): Pick<AgeCertification, "rank" | "badge"> | null {
  const normalized = raw.trim().toUpperCase();
  if (!normalized || normalized === "NR" || normalized === "UR" || normalized === "UNRATED") {
    return null;
  }
  if (normalized === "G") return { rank: 0, badge: "all" };
  if (normalized === "PG") return { rank: 10, badge: "10" };
  if (normalized === "PG-13" || normalized === "PG13") return { rank: 12, badge: "12" };
  if (normalized === "R") return { rank: 16, badge: "16" };
  if (normalized === "NC-17" || normalized === "NC17") return { rank: 18, badge: "18" };
  return null;
}

function parseGenericCertification(raw: string): Pick<AgeCertification, "rank" | "badge"> | null {
  return parseFrenchCertification(raw) ?? parseUsCertification(raw);
}

export const UNKNOWN_CERTIFICATION: AgeCertification = {
  rank: null,
  badge: null,
  raw: null,
  source: "unknown",
};

/**
 * Prefer French/CNC certification, then US, then any other country.
 * Never invents a rating when TMDb has no usable certification.
 */
export function resolveCertification(
  releaseDates?: TmdbReleaseDatesLike,
): AgeCertification {
  const results = releaseDates?.results;
  if (!results?.length) return UNKNOWN_CERTIFICATION;

  const frRaw = firstCert(results, "FR");
  if (frRaw) {
    const parsed = parseFrenchCertification(frRaw);
    if (parsed) {
      return { ...parsed, raw: frRaw, source: "FR" };
    }
  }

  const usRaw = firstCert(results, "US");
  if (usRaw) {
    const parsed = parseUsCertification(usRaw);
    if (parsed) {
      return { ...parsed, raw: usRaw, source: "US" };
    }
  }

  for (const country of results) {
    const raw = firstCert([country], country.iso_3166_1);
    if (!raw) continue;
    const parsed = parseGenericCertification(raw);
    if (parsed) {
      return { ...parsed, raw, source: "other" };
    }
  }

  return UNKNOWN_CERTIFICATION;
}

export function ageMaxToRank(maxAge: AgeMax | null): number {
  if (!maxAge || maxAge === "18") return 18;
  if (maxAge === "all") return 0;
  return Number.parseInt(maxAge, 10);
}

export function certificationAllowed(
  certification: AgeCertification,
  maxAge: AgeMax | null,
): boolean {
  if (certification.rank == null) return true;
  return certification.rank <= ageMaxToRank(maxAge);
}
