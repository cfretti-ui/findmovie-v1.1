/**
 * TMDb API response types.
 * Shared across the FindMovie application for strong typing.
 */

/** Common paginated list envelope used by search, discover, and trending. */
export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** Genre entity returned by `/genre/movie/list`. */
export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenresResponse {
  genres: TmdbGenre[];
}

/**
 * Movie summary used in lists (trending, search, discover).
 * Field names match the TMDb API payload (snake_case).
 */
export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

/** Full movie payload from `/movie/{id}`. */
export interface TmdbMovieDetails extends Omit<TmdbMovie, "genre_ids"> {
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  genres: TmdbGenre[];
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  spoken_languages: TmdbSpokenLanguage[];
  credits?: TmdbCredits;
  release_dates?: TmdbReleaseDatesResponse;
  "watch/providers"?: TmdbWatchProvidersResponse;
  recommendations?: TmdbPaginatedResponse<TmdbMovie>;
  similar?: TmdbPaginatedResponse<TmdbMovie>;
  videos?: TmdbVideosResponse;
}

export interface TmdbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TmdbProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TmdbSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  cast_id: number;
  credit_id: string;
  gender: number;
  known_for_department: string;
  popularity: number;
  adult: boolean;
  original_name: string;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  gender: number;
  known_for_department: string;
  popularity: number;
  adult: boolean;
  original_name: string;
}

export interface TmdbCredits {
  id: number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
}

export interface TmdbVideosResponse {
  id: number;
  results: TmdbVideo[];
}

export interface TmdbWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

export interface TmdbWatchProviderRegion {
  link?: string;
  flatrate?: TmdbWatchProvider[];
  rent?: TmdbWatchProvider[];
  buy?: TmdbWatchProvider[];
  ads?: TmdbWatchProvider[];
}

export interface TmdbWatchProvidersResponse {
  id: number;
  results: Record<string, TmdbWatchProviderRegion>;
}

/** Supported TMDb poster / still sizes. */
export type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

/**
 * Filters accepted by `discoverMovies`.
 * Only documented TMDb discover params are exposed here.
 */
export interface DiscoverMoviesFilters {
  page?: number;
  language?: string;
  sort_by?: string;
  include_adult?: boolean;
  include_video?: boolean;
  primary_release_year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  with_genres?: string;
  without_genres?: string;
  with_runtime_gte?: number;
  with_runtime_lte?: number;
  with_watch_providers?: string;
  watch_region?: string;
  with_original_language?: string;
  vote_average_gte?: number;
  vote_count_gte?: number;
  certification_country?: string;
  "certification.lte"?: string;
  append_to_response?: string;
}

export type TrendingTimeWindow = "day" | "week";

export interface TmdbReleaseDate {
  certification: string;
  descriptors?: string[];
  iso_639_1: string;
  note?: string;
  release_date: string;
  type: number;
}

export interface TmdbReleaseDatesResult {
  iso_3166_1: string;
  release_dates: TmdbReleaseDate[];
}

export interface TmdbReleaseDatesResponse {
  id: number;
  results: TmdbReleaseDatesResult[];
}
