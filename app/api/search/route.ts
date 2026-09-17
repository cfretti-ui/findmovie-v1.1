import { NextResponse } from "next/server";

import { searchCatalogMovies } from "@/lib/catalog";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ movies: [] });
  }

  try {
    const movies = await searchCatalogMovies(query, DEFAULT_LOCALE);

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