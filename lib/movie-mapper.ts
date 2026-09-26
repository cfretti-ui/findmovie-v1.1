import type {
  Movie,
  MovieEnergy,
  MovieIntensity,
  MovieLanguage,
  StreamingService,
} from "@/types/movie";
import { GENRE_ID_TO_NAME, PROVIDER_NAME_MAP } from "@/lib/tmdb-constants";
import {
  resolveCertification,
  type TmdbReleaseDatesLike,
} from "@/lib/certification";
import type {
  TmdbCredits,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbWatchProvidersResponse,
} from "@/types/tmdb";

function deriveMoods(genres: string[]): string[] {
  const moods = new Set<string>();
  if (genres.includes("Comedy")) moods.add("Laugh");
  if (genres.some((g) => ["Sci-Fi", "Mystery", "Thriller", "Drama"].includes(g)))
    moods.add("Think");
  if (genres.some((g) => ["Drama", "Romance"].includes(g))) moods.add("Cry");
  if (genres.some((g) => ["Adventure", "Fantasy", "Action"].includes(g)))
    moods.add("Adventure");
  if (genres.includes("Horror")) moods.add("Be scared");
  if (genres.some((g) => ["Family", "Animation", "History"].includes(g)))
    moods.add("Feel inspired");
  if (moods.size === 0) moods.add("Think");
  return [...moods];
}

function deriveEnergy(genres: string[]): MovieEnergy {
  if (genres.some((g) => ["Horror", "Action", "Thriller"].includes(g)))
    return "Fast & intense";
  if (genres.some((g) => ["Drama", "Romance", "History"].includes(g)))
    return "Slow & atmospheric";
  return "Balanced";
}

function deriveIntensity(genres: string[]): MovieIntensity {
  if (genres.some((g) => ["Family", "Animation"].includes(g)))
    return "Family-friendly";
  if (genres.some((g) => ["Horror", "Thriller", "Crime", "War"].includes(g)))
    return "Mature";
  return "Mild";
}

function deriveLanguage(code: string): MovieLanguage {
  if (code === "en") return "English";
  if (code === "fr") return "French";
  return "Other";
}

function hashId(id: number): number {
  return Math.abs((id * 2654435761) % 2147483647);
}

const STREAMING: StreamingService[] = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Apple TV+",
  "Max",
  "Canal+",
];

export function pickStreamingServices(id: number): StreamingService[] {
  const h = hashId(id);
  const services: StreamingService[] = [];
  for (let i = 0; i < STREAMING.length; i++) {
    if ((h >> i) & 1) services.push(STREAMING[i]);
  }
  if (services.length < 2) {
    services.push(STREAMING[h % STREAMING.length]);
    services.push(STREAMING[(h + 2) % STREAMING.length]);
  }
  return [...new Set(services)].slice(0, 3);
}

export function mapProvidersToServices(
  providers?: TmdbWatchProvidersResponse,
  region = "US",
): StreamingService[] {
  const regionData = providers?.results[region] ?? providers?.results.US;
  if (!regionData) {
    return [];
  }

  const all = [
    ...(regionData.flatrate ?? []),
    ...(regionData.rent ?? []),
    ...(regionData.buy ?? []),
  ];

  const services = new Set<StreamingService>();
  for (const provider of all) {
    for (const [needle, service] of Object.entries(PROVIDER_NAME_MAP)) {
      if (provider.provider_name.includes(needle)) {
        services.add(service);
      }
    }
  }

  return [...services];
}

function genresFromIds(ids?: number[]): string[] {
  if (!ids?.length) return [];
  return ids
    .map((id) => GENRE_ID_TO_NAME[id])
    .filter((name): name is string => Boolean(name));
}

function pickDirector(credits?: TmdbCredits): string | null {
  const director = credits?.crew.find((member) => member.job === "Director");
  return director?.name ?? null;
}

function pickCast(credits?: TmdbCredits, limit = 6): string[] {
  return (credits?.cast ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, limit)
    .map((member) => member.name);
}

function withCertification(
  movie: Movie,
  releaseDates?: TmdbReleaseDatesLike,
  adult = false,
): Movie {
  const certification = resolveCertification(releaseDates);
  return {
    ...movie,
    adult,
    ageRating: certification.rank,
    ageBadge: certification.badge,
    certificationSource: certification.source,
  };
}

function pickTrailer(details: TmdbMovieDetails): {
  key: string | null;
  name: string | null;
} {
  const videos = details.videos?.results ?? [];

  const youtubeTrailers = videos.filter(
    (video) =>
      video.site === "YouTube" &&
      video.key &&
      video.type === "Trailer",
  );

  const officialTrailer =
    youtubeTrailers.find((video) => video.official) ??
    youtubeTrailers[0];

  if (!officialTrailer) {
    return {
      key: null,
      name: null,
    };
  }

  return {
    key: officialTrailer.key,
    name: officialTrailer.name,
  };
}

export function mapTmdbDetailsToMovie(
  details: TmdbMovieDetails,
  providers?: TmdbWatchProvidersResponse,
  region = "US",
): Movie {
  const genres = details.genres.map((g) => g.name);
  const year = details.release_date
    ? Number.parseInt(details.release_date.slice(0, 4), 10)
    : 0;
  const watchProviders = providers ?? details["watch/providers"];
  const mappedProviders = mapProvidersToServices(watchProviders, region);
  const streaming =
    mappedProviders.length > 0
      ? mappedProviders
      : pickStreamingServices(details.id);
  const trailer = pickTrailer(details);

  const base: Movie = {
    id: details.id,
    title: details.title,
    originalTitle: details.original_title,
    year: Number.isFinite(year) ? year : 0,
    runtime: details.runtime ?? 110,
    genres,
    imdbRating: Number(details.vote_average.toFixed(1)),
    voteCount: details.vote_count,
    synopsis: details.overview,
    posterPath: details.poster_path ?? "",
    backdropPath: details.backdrop_path ?? "",
    streamingServices: streaming,
    moods: deriveMoods(genres),
    tags: genres.length ? [genres[0].toLowerCase()] : ["drama"],
    energy: deriveEnergy(genres),
    intensity: deriveIntensity(genres),
    language: deriveLanguage(details.original_language),
    iconic: details.popularity > 25 || details.vote_average >= 7.5,
    director: pickDirector(details.credits),
    cast: pickCast(details.credits),
    genreIds: details.genres.map((genre) => genre.id),
    trailerKey: trailer.key,
    trailerName: trailer.name,
  };

  return withCertification(base, details.release_dates, details.adult);
}

export function mapTmdbSummaryToMovie(movie: TmdbMovie): Movie {
  const genres = genresFromIds(movie.genre_ids);
  const year = movie.release_date
    ? Number.parseInt(movie.release_date.slice(0, 4), 10)
    : 0;

  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    year: Number.isFinite(year) ? year : 0,
    runtime: 110,
    genres,
    imdbRating: Number(movie.vote_average.toFixed(1)),
    voteCount: movie.vote_count,
    synopsis: movie.overview,
    posterPath: movie.poster_path ?? "",
    backdropPath: movie.backdrop_path ?? "",
    streamingServices: pickStreamingServices(movie.id),
    moods: deriveMoods(genres),
    tags: genres.length ? [genres[0].toLowerCase()] : ["discover"],
    energy: deriveEnergy(genres),
    intensity: deriveIntensity(genres),
    language: deriveLanguage(movie.original_language),
    iconic: movie.popularity > 25 || movie.vote_average >= 7.5,
    adult: movie.adult,
    ageRating: null,
    ageBadge: null,
    certificationSource: "unknown",
    genreIds: movie.genre_ids,
  };
}
