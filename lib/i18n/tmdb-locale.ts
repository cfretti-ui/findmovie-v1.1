import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";

export const LOCALE_COOKIE = "findmovie.locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const TMDB_LANGUAGE: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
};

export const WATCH_REGION: Record<Locale, string> = {
  en: "US",
  fr: "FR",
  es: "ES",
};

export function parseLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) return value;
  return DEFAULT_LOCALE;
}

export function localeToTmdbLanguage(locale: Locale): string {
  return TMDB_LANGUAGE[locale];
}

export function localeToWatchRegion(locale: Locale): string {
  return WATCH_REGION[locale];
}
