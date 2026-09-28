import { NextRequest, NextResponse } from "next/server";
import { searchCatalogMovies } from "@/lib/catalog";
import { parseLocale } from "@/lib/i18n/tmdb-locale";
function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: b.length + 1 }, () =>
    Array<number>(a.length + 1).fill(0)
  );
  for (let i = 0; i <= b.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}
function wordMatchScore(title: string, query: string) {
  const titleWords = title.split(" ").filter(Boolean);
  const queryWords = query.split(" ").filter(Boolean);
  if (!queryWords.length) return 0;
  let score = 0;
  for (const queryWord of queryWords) {
    let best = 0;
    for (const titleWord of titleWords) {
      if (titleWord === queryWord) {
        best = Math.max(best, 500);
        continue;
      }
      if (titleWord.startsWith(queryWord)) {
        best = Math.max(best, 400);
        continue;
      }
      if (queryWord.length >= 4 && titleWord.includes(queryWord)) {
        best = Math.max(best, 250);
        continue;
      }
      if (queryWord.length >= 5) {
        const distance = levenshtein(queryWord, titleWord);
        const maxDistance = queryWord.length <= 6 ? 1 : 2;
        if (distance <= maxDistance) {
          best = Math.max(best, 180 - distance * 40);
        }
      }
    }
    score += best;
  }
  return score;
}
function scoreMovie(movie: any, query: string) {
  const normalizedQuery = normalize(query);
  const title = normalize(movie.title ?? "");
  const originalTitle = normalize(movie.originalTitle ?? "");
  const titleWords = title.split(" ").filter(Boolean);
  const originalTitleWords = originalTitle.split(" ").filter(Boolean);
  if (!normalizedQuery || !title) return -Infinity;
  let score = 0;
  if (title === normalizedQuery) {
    score += 10000;
  } else if (originalTitle === normalizedQuery) {
    score += 9000;
  }
  if (title.startsWith(normalizedQuery)) {
    score += 7000;
  } else if (originalTitle.startsWith(normalizedQuery)) {
    score += 6000;
  }
  if (titleWords.some((word: string) => word.startsWith(normalizedQuery))) {
    score += 5000;
  }
  if (originalTitleWords.some((word: string) => word.startsWith(normalizedQuery))) {
    score += 4500;
  }
  if (title.includes(` ${normalizedQuery}`)) {
    score += 3500;
  } else if (title.includes(normalizedQuery)) {
    score += 2500;
  }
  if (originalTitle.includes(normalizedQuery)) {
    score += 2000;
  }
  score += wordMatchScore(title, normalizedQuery);
  score += wordMatchScore(originalTitle, normalizedQuery) * 0.8;
  const popularity = Number(movie.popularity ?? 0);
  const voteCount = Number(movie.voteCount ?? 0);
  if (score > 0) {
    score += Math.min(popularity * 2, 300);
    score += Math.min(Math.log10(voteCount + 1) * 35, 140);
  }
  return score;
}
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
    const rankedMovies = [...movies]
      .map((movie) => ({
        movie,
        score: scoreMovie(movie, query),
      }))
      .filter(({ score }) => Number.isFinite(score) && score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ movie }) => movie);
    return NextResponse.json(rankedMovies);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}