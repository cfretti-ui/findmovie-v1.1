import { NextRequest, NextResponse } from "next/server";
import { searchCatalogMovies } from "@/lib/catalog";
import { parseLocale } from "@/lib/i18n/tmdb-locale";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim();
    const locale = parseLocale(searchParams.get("locale"));

    if (!query) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }
    const movies = await searchCatalogMovies(query, locale);

    return NextResponse.json(movies);
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
