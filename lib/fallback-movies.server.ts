import "server-only";

import { readFileSync } from "fs";
import { join } from "path";
import type { Movie } from "@/types/movie";

interface FallbackFile {
  generatedAt: string;
  count: number;
  movies: Movie[];
}

let cached: Movie[] | null = null;

/**
 * Offline fallback: 500 well-known movies covering all questionnaire combinations.
 * Used when TMDb is unavailable or the API request fails.
 */
export function getFallbackMovies(): Movie[] {
  if (cached) return cached;

  try {
    const raw = readFileSync(
      join(process.cwd(), "lib/data/fallback-movies.json"),
      "utf8",
    );
    const data = JSON.parse(raw) as FallbackFile;
    cached = data.movies;
    return cached;
  } catch {
    cached = [];
    return cached;
  }
}
