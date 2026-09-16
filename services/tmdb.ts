import axios, { AxiosError, type AxiosInstance } from "axios";
import type {
  DiscoverMoviesFilters,
  TmdbCredits,
  TmdbGenresResponse,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbPaginatedResponse,
  TmdbVideosResponse,
  TmdbWatchProvidersResponse,
  TrendingTimeWindow,
} from "@/types/tmdb";

// Re-export image helpers for server usage; client components should import
// from `@/lib/tmdb-images` to avoid pulling Axios into the browser bundle.
export { getBackdropUrl, getPosterUrl } from "@/lib/tmdb-images";

/**
 * Production-ready TMDb HTTP client for FindMovie.
 *
 * Configuration (server-side env vars — never hardcode secrets):
 * - TMDB_API_KEY
 * - TMDB_BASE_URL          e.g. https://api.themoviedb.org/3
 * - TMDB_IMAGE_BASE_URL    e.g. https://image.tmdb.org/t/p
 *
 * Prefer calling these helpers from Server Components, Route Handlers,
 * or Server Actions so the API key stays off the client bundle.
 */

export class TmdbApiError extends Error {
  readonly status?: number;
  readonly details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "TmdbApiError";
    this.status = status;
    this.details = details;
  }
}

interface TmdbEnvConfig {
  apiKey: string;
  baseURL: string;
  imageBaseURL: string;
}

/**
 * Reads TMDb environment variables and validates required API settings.
 * Image base URL falls back to the public CDN so poster helpers stay usable.
 */
function getEnvConfig(): TmdbEnvConfig {
  const apiKey = process.env.TMDB_API_KEY;
  const baseURL = process.env.TMDB_BASE_URL;
  const imageBaseURL =
    process.env.TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";

  if (!apiKey) {
    throw new TmdbApiError(
      "Missing TMDB_API_KEY. Add it to your environment (e.g. .env.local).",
    );
  }

  if (!baseURL) {
    throw new TmdbApiError(
      "Missing TMDB_BASE_URL. Example: https://api.themoviedb.org/3",
    );
  }

  return { apiKey, baseURL, imageBaseURL };
}

/** Lazily created Axios instance — avoids crashing module import when env is unset. */
let client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (client) {
    return client;
  }

  const { apiKey, baseURL } = getEnvConfig();

  // v3 API keys use `api_key` query; v4 read access tokens use Bearer auth.
  const isV4Token = apiKey.startsWith("eyJ");

  client = axios.create({
    baseURL,
    timeout: 12_000,
    headers: {
      Accept: "application/json",
      ...(isV4Token ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    params: isV4Token ? undefined : { api_key: apiKey },
  });

  return client;
}

/**
 * Normalizes Axios / network failures into a consistent TmdbApiError.
 */
function toTmdbError(error: unknown, fallbackMessage: string): TmdbApiError {
  if (error instanceof TmdbApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ status_message?: string }>;
    const status = axiosError.response?.status;
    const apiMessage = axiosError.response?.data?.status_message;
    const message =
      apiMessage ||
      axiosError.message ||
      fallbackMessage;

    return new TmdbApiError(message, status, axiosError.response?.data);
  }

  if (error instanceof Error) {
    return new TmdbApiError(error.message);
  }

  return new TmdbApiError(fallbackMessage);
}

async function tmdbGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  fallbackMessage = "TMDb request failed.",
): Promise<T> {
  try {
    const response = await getClient().get<T>(path, { params });
    return response.data;
  } catch (error) {
    throw toTmdbError(error, fallbackMessage);
  }
}

/**
 * Returns trending movies for the given time window (`day` or `week`).
 * Endpoint: GET /trending/movie/{time_window}
 */
export async function getTrendingMovies(
  timeWindow: TrendingTimeWindow = "day",
  page = 1,
  language = "en-US",
): Promise<TmdbPaginatedResponse<TmdbMovie>> {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    `/trending/movie/${timeWindow}`,
    { page, language },
    "Failed to fetch trending movies.",
  );
}

/**
 * Searches movies by free-text query.
 * Endpoint: GET /search/movie
 */
export async function searchMovies(
  query: string,
  page = 1,
  language = "en-US",
): Promise<TmdbPaginatedResponse<TmdbMovie>> {
  const trimmed = query.trim();

  if (!trimmed) {
    throw new TmdbApiError("searchMovies requires a non-empty query.");
  }

  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    "/search/movie",
    {
      query: trimmed,
      page,
      language,
      include_adult: false,
    },
    "Failed to search movies.",
  );
}

/**
 * Discovers movies using TMDb filter parameters (genres, runtime, providers, …).
 * Endpoint: GET /discover/movie
 */
export async function discoverMovies(
  filters: DiscoverMoviesFilters = {},
): Promise<TmdbPaginatedResponse<TmdbMovie>> {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    "/discover/movie",
    {
      language: filters.language ?? "en-US",
      sort_by: "popularity.desc",
      include_adult: false,
      ...filters,
    },
    "Failed to discover movies.",
  );
}

/**
 * Fetches full details for a single movie.
 * Endpoint: GET /movie/{movie_id}
 */
export async function getMovieDetails(
  movieId: number,
  language = "en-US",
  appendToResponse?: string,
): Promise<TmdbMovieDetails> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new TmdbApiError("getMovieDetails requires a valid movieId.");
  }

  return tmdbGet<TmdbMovieDetails>(
    `/movie/${movieId}`,
    {
      language,
      append_to_response: appendToResponse,
    },
    `Failed to fetch details for movie ${movieId}.`,
  );
}

/**
 * Fetches cast and crew credits for a movie.
 * Endpoint: GET /movie/{movie_id}/credits
 */
export async function getMovieCredits(
  movieId: number,
  language = "en-US",
): Promise<TmdbCredits> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new TmdbApiError("getMovieCredits requires a valid movieId.");
  }

  return tmdbGet<TmdbCredits>(
    `/movie/${movieId}/credits`,
    { language },
    `Failed to fetch credits for movie ${movieId}.`,
  );
}

/**
 * Fetches trailers, teasers, and other videos for a movie.
 * Endpoint: GET /movie/{movie_id}/videos
 */
export async function getMovieVideos(
  movieId: number,
  language = "en-US",
): Promise<TmdbVideosResponse> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new TmdbApiError("getMovieVideos requires a valid movieId.");
  }

  return tmdbGet<TmdbVideosResponse>(
    `/movie/${movieId}/videos`,
    { language },
    `Failed to fetch videos for movie ${movieId}.`,
  );
}

/**
 * Fetches watch providers (streaming / rent / buy) keyed by region.
 * Endpoint: GET /movie/{movie_id}/watch/providers
 */
export async function getMovieProviders(
  movieId: number,
): Promise<TmdbWatchProvidersResponse> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new TmdbApiError("getMovieProviders requires a valid movieId.");
  }

  return tmdbGet<TmdbWatchProvidersResponse>(
    `/movie/${movieId}/watch/providers`,
    undefined,
    `Failed to fetch providers for movie ${movieId}.`,
  );
}

/**
 * Fetches the full movie genre list.
 * Endpoint: GET /genre/movie/list
 */
export async function getGenres(
  language = "en-US",
): Promise<TmdbGenresResponse> {
  return tmdbGet<TmdbGenresResponse>(
    "/genre/movie/list",
    { language },
    "Failed to fetch movie genres.",
  );
}

export async function getSimilarMovies(
  movieId: number,
  language = "en-US",
  page = 1,
): Promise<TmdbPaginatedResponse<TmdbMovie>> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new TmdbApiError("getSimilarMovies requires a valid movieId.");
  }

  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    `/movie/${movieId}/similar`,
    { language, page },
    `Failed to fetch similar movies for ${movieId}.`,
  );
}

/**
 * TMDb editorial recommendations for a movie.
 * Endpoint: GET /movie/{movie_id}/recommendations
 */
export async function getMovieRecommendations(
  movieId: number,
  language = "en-US",
  page = 1,
): Promise<TmdbPaginatedResponse<TmdbMovie>> {
  if (!Number.isFinite(movieId) || movieId <= 0) {
    throw new TmdbApiError("getMovieRecommendations requires a valid movieId.");
  }

  return tmdbGet<TmdbPaginatedResponse<TmdbMovie>>(
    `/movie/${movieId}/recommendations`,
    { language, page },
    `Failed to fetch recommendations for movie ${movieId}.`,
  );
}

/** True when API key + base URL are present (does not validate the key). */
export function isTmdbConfigured(): boolean {
  return Boolean(process.env.TMDB_API_KEY && process.env.TMDB_BASE_URL);
}
