import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n/locales";
import { LOCALE_COOKIE, parseLocale } from "@/lib/i18n/tmdb-locale";

export async function getRequestLocale(): Promise<Locale> {
  const store = await cookies();
  return parseLocale(store.get(LOCALE_COOKIE)?.value);
}
