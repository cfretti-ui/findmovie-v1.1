import { NextResponse } from "next/server";
import { searchCatalogMovies } from "@/lib/catalog";
import { getRequestLocale } from "@/lib/i18n/server-locale";
import { parseLocale } from "@/lib/i18n/tmdb-locale";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const requestLocale = await getRequestLocale();
  const locale = parseLocale(searchParams.get("locale") ?? requestLocale);

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchCatalogMovies(query, locale);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Search failed.", results: [] },
      { status: 500 },
    );
  }
}
