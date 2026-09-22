import type { Movie } from "@/types/movie";
import { getFallbackMovies } from "@/lib/fallback-movies.server";
import { TRENDING_TITLES } from "@/lib/data/movies-config";
import {
  getMovieDetails,
  getTrendingMovies as fetchTrendingFromTmdb,
  isTmdbConfigured,
  searchMovies as searchTmdbMovies,
  TmdbApiError,
} from "@/services/tmdb";
import { mapTmdbDetailsToMovie, mapTmdbSummaryToMovie } from "@/lib/movie-mapper";
import type { Locale } from "@/lib/i18n/locales";
import {
  localeToTmdbLanguage,
  localeToWatchRegion,
} from "@/lib/i18n/tmdb-locale";

function getFallbackTrending(): Movie[] {
  const fallback = getFallbackMovies();
  return TRENDING_TITLES.map(
    (title) => fallback.find((movie) => movie.title === title)!,
  ).filter(Boolean);
}

export async function getHomeTrendingMovies(
  locale: Locale = "en",
): Promise<Movie[]> {
  if (!isTmdbConfigured()) {
    return getFallbackTrending();
  }

  try {
    const response = await fetchTrendingFromTmdb(
      "day",
      1,
      localeToTmdbLanguage(locale),
    );
    const mapped = response.results
      .filter((movie) => Boolean(movie.poster_path))
      .slice(0, 12)
      .map(mapTmdbSummaryToMovie);

    return mapped.length > 0 ? mapped : getFallbackTrending();
  } catch (error) {
    if (error instanceof TmdbApiError) {
      console.warn("[catalog] TMDb trending unavailable:", error.message);
    } else {
      console.warn("[catalog] TMDb trending unavailable:", error);
    }
    return getFallbackTrending();
  }
}

export async function getHeroCollageMovies(
  locale: Locale = "en",
): Promise<Movie[]> {
  const trending = await getHomeTrendingMovies(locale);
  if (trending.length >= 6) {
    return trending.slice(0, 8);
  }
  return getFallbackMovies()
    .filter((movie) => Boolean(movie.posterPath))
    .slice(0, 8);
}

export async function searchCatalogMovies(
  query: string,
  locale: Locale = "en",
): Promise<Movie[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (!isTmdbConfigured()) {
    const needle = trimmed.toLowerCase();
    return getFallbackMovies()
      .filter((movie) => movie.title.toLowerCase().includes(needle))
      .slice(0, 8);
  }

  try {
    const response = await searchTmdbMovies(
      trimmed,
      1,
      localeToTmdbLanguage(locale),
    );
    return response.results
      .filter((movie) => Boolean(movie.poster_path))
      .slice(0, 12)
      .map(mapTmdbSummaryToMovie);
  } catch (error) {
    if (error instanceof TmdbApiError) {
      console.warn("[catalog] TMDb search unavailable:", error.message);
    }
    const needle = trimmed.toLowerCase();
    return getFallbackMovies()
      .filter((movie) => movie.title.toLowerCase().includes(needle))
      .slice(0, 8);
  }
}

export async function getMoviePageData(
  movieId: number,
  locale: Locale = "en",
): Promise<Movie | null> {
  if (!Number.isFinite(movieId) || movieId <= 0) return null;

  if (isTmdbConfigured()) {
    try {
      const details = await getMovieDetails(
        movieId,
        localeToTmdbLanguage(locale),
        "credits,release_dates,watch/providers,recommendations,similar",
      );
      return mapTmdbDetailsToMovie(
        details,
        details["watch/providers"],
        localeToWatchRegion(locale),
      );
    } catch (error) {
      if (error instanceof TmdbApiError) {
        console.warn("[catalog] movie details unavailable:", error.message);
      }
    }
  }

  return getFallbackMovies().find((movie) => movie.id === movieId) ?? null;
}
