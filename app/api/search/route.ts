import { NextResponse } from "next/server";

import { searchCatalogMovies } from "@/lib/catalog";
import { parseLocale } from "@/lib/i18n/tmdb-locale";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");
  const locale = parseLocale(searchParams.get("locale"));

  if (!query) {
    return NextResponse.json({ movies: [] });
  }

  try {
    const movies = await searchCatalogMovies(query, locale);

    return NextResponse.json(
      { movies },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { movies: [] },
      { status: 500 },
    );
  }
}