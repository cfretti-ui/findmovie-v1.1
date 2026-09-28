import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getMovieCredits, getMovieRecommendations, getSimilarMovies } from "@/services/tmdb";
import type { TmdbMovie, TmdbMovieDetails } from "@/types/tmdb";
type Candidate = {
  movie: TmdbMovie;
  details: TmdbMovieDetails;
  score: number;
  reasons: string[];
};
function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function getDirector(details: TmdbMovieDetails) {
  return details.credits?.crew.find((member) => member.job === "Director") ?? null;
}
function getMainCast(details: TmdbMovieDetails) {
  return (details.credits?.cast ?? []).sort((a, b) => a.order - b.order).slice(0, 10);
}
function getKeywords(details: TmdbMovieDetails) {
  return (details.keywords?.keywords ?? []).map((keyword) => normalize(keyword.name));
}
function getGenres(details: TmdbMovieDetails) {
  return details.genres.map((genre) => normalize(genre.name));
}
function getCountries(details: TmdbMovieDetails) {
  return details.production_countries.map((country) => country.iso_3166_1);
}
function popularityScore(popularity: number) {
  if (popularity >= 100) return 18;
  if (popularity >= 50) return 14;
  if (popularity >= 25) return 10;
  if (popularity >= 10) return 6;
  if (popularity >= 5) return 3;
  return 0;
}
function calculateScore(source: TmdbMovieDetails, candidate: TmdbMovieDetails) {
  let score = 0;
  const reasons: string[] = [];
  const sourceDirector = getDirector(source);
  const candidateDirector = getDirector(candidate);
  if (sourceDirector && candidateDirector && sourceDirector.id === candidateDirector.id) {
    score += 100;
    reasons.push(`Même réalisateur — ${candidateDirector.name}`);
  }
  const sourceCast = getMainCast(source);
  const candidateCast = getMainCast(candidate);
  const sourceCastIds = new Set(sourceCast.map((actor) => actor.id));
  const sharedActors = candidateCast.filter((actor) => sourceCastIds.has(actor.id));
  if (sharedActors.length > 0) {
    const actorScore = Math.min(sharedActors.length * 28, 70);
    score += actorScore;
    const actorNames = sharedActors.slice(0, 2).map((actor) => actor.name).join(" et ");
    reasons.push(`Même acteur${sharedActors.length > 1 ? "s" : ""} — ${actorNames}`);
  }
  const sourceGenres = getGenres(source);
  const candidateGenres = getGenres(candidate);
  const sharedGenres = candidateGenres.filter((genre) => sourceGenres.includes(genre));
  if (sharedGenres.length > 0) {
    score += Math.min(sharedGenres.length * 12, 30);
    if (sharedGenres.length >= 2) {
      reasons.push(`Genres proches — ${sharedGenres.slice(0, 2).join(", ")}`);
    } else {
      reasons.push(`Même genre — ${sharedGenres[0]}`);
    }
  }
  const sourceCountries = getCountries(source);
  const candidateCountries = getCountries(candidate);
  const sharedCountries = candidateCountries.filter((country) => sourceCountries.includes(country));
  if (sharedCountries.length > 0) {
    score += 30;
    const countryNames = candidate.production_countries.filter((country) => sharedCountries.includes(country.iso_3166_1)).slice(0, 2).map((country) => country.name);
    reasons.push(`Même pays — ${countryNames.join(", ")}`);
  }
  const sourceKeywords = new Set(getKeywords(source));
  const candidateKeywords = getKeywords(candidate);
  const sharedKeywords = candidateKeywords.filter((keyword) => sourceKeywords.has(keyword));
  if (sharedKeywords.length > 0) {
    score += Math.min(sharedKeywords.length * 9, 45);
    const readableKeywords = sharedKeywords.slice(0, 3).map((keyword) => keyword.replace(/\b\w/g, (letter) => letter.toUpperCase()));
    reasons.push(`Thèmes proches — ${readableKeywords.join(", ")}`);
  }
  if (source.release_date && candidate.release_date) {
    const sourceYear = Number(source.release_date.slice(0, 4));
    const candidateYear = Number(candidate.release_date.slice(0, 4));
    const yearDifference = Math.abs(sourceYear - candidateYear);
    if (yearDifference <= 3) {
      score += 10;
    } else if (yearDifference <= 7) {
      score += 5;
    }
  }
  score += popularityScore(candidate.popularity);
  if (candidate.vote_count >= 1000) {
    score += 5;
  } else if (candidate.vote_count >= 500) {
    score += 3;
  }
  return { score, reasons: reasons.slice(0, 3) };
}
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const movieId = Number(id);
    if (!Number.isFinite(movieId)) {
      return NextResponse.json({ movies: [] }, { status: 400 });
    }
    const language = request.nextUrl.searchParams.get("language") || "fr-FR";
    const source = await getMovieDetails(movieId, language, "credits,keywords");
    const sourceCredits = await getMovieCredits(movieId, language);
    source.credits = sourceCredits;
    const [similarResponse, recommendationsResponse] = await Promise.all([
      getSimilarMovies(movieId, language, 1),
      getMovieRecommendations(movieId, language, 1),
    ]);
    const candidateMap = new Map<number, TmdbMovie>();
    for (const movie of [...recommendationsResponse.results, ...similarResponse.results]) {
      if (movie.id !== movieId && !candidateMap.has(movie.id)) {
        candidateMap.set(movie.id, movie);
      }
    }
    const candidates = Array.from(candidateMap.values()).slice(0, 30);
    const hydrated: Candidate[] = [];
    for (let index = 0; index < candidates.length; index += 5) {
      const batch = candidates.slice(index, index + 5);
      const results = await Promise.all(
        batch.map(async (movie) => {
          try {
            const details = await getMovieDetails(movie.id, language, "credits,keywords");
            const credits = await getMovieCredits(movie.id, language);
            details.credits = credits;
            const { score, reasons } = calculateScore(source, details);
            return { movie, details, score, reasons };
          } catch {
            return null;
          }
        }),
      );
      for (const result of results) {
        if (result) {
          hydrated.push(result);
        }
      }
    }
    const filtered = hydrated
      .filter(({ details }) => details.poster_path && details.release_date)
      .filter(({ score }) => score >= 20)
      .sort((a, b) => b.score - a.score);
    const selected: Candidate[] = [];
    const usedDirectors = new Set<number>();
    const usedMovies = new Set<number>();
    for (const candidate of filtered) {
      if (selected.length >= 6) break;
      if (usedMovies.has(candidate.movie.id)) continue;
      const director = getDirector(candidate.details);
      if (director && usedDirectors.has(director.id) && selected.length < 4) continue;
      selected.push(candidate);
      usedMovies.add(candidate.movie.id);
      if (director) {
        usedDirectors.add(director.id);
      }
    }
    const movies = selected.map(({ movie, details, score, reasons }) => ({
      id: movie.id,
      title: details.title || movie.title,
      originalTitle: details.original_title || movie.original_title,
      year: details.release_date ? Number(details.release_date.slice(0, 4)) : 0,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      overview: details.overview || movie.overview,
      score,
      reasons,
    }));
    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Similar movies error:", error);
    return NextResponse.json({ movies: [] }, { status: 500 });
  }
}