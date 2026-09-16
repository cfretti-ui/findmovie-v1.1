import "server-only";

import type { Movie } from "@/types/movie";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { answersToDiscoverFilters } from "@/lib/discover-filters";
import { getFallbackMovies } from "@/lib/fallback-movies.server";
import { mapTmdbDetailsToMovie, mapTmdbSummaryToMovie } from "@/lib/movie-mapper";
import { filterCandidates, rankMovies, type ReasonToken } from "@/lib/scoring";
import type { Locale } from "@/lib/i18n/locales";
import { localeToTmdbLanguage, localeToWatchRegion } from "@/lib/i18n/tmdb-locale";
import { discoverMovies, getMovieDetails, getMovieRecommendations, getSimilarMovies, isTmdbConfigured, TmdbApiError } from "@/services/tmdb";

const DETAILS_APPEND = "credits,release_dates,watch/providers";
export interface RecommendationResult { movie: Movie; reasons: ReasonToken[]; similar: Movie[]; }

async function mapPool<T, R>(items: T[], limit: number, mapper: (item: T) => Promise<R>) {
  const results: R[] = [];
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await mapper(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function hydrateCandidates(movies: Movie[], language: string, region: string) {
  const unique = [...new Map(movies.map((m) => [m.id, m])).values()].slice(0, 12);
  return mapPool(unique, 5, async (movie) => {
    try {
      const details = await getMovieDetails(movie.id, language, DETAILS_APPEND);
      return mapTmdbDetailsToMovie(details, details["watch/providers"], region);
    } catch { return movie; }
  });
}

function diversify(ranked: ReturnType<typeof rankMovies>, limit = 7) {
  const chosen: typeof ranked = [];
  const remaining = [...ranked];
  while (remaining.length && chosen.length < limit) {
    let bestIndex = 0;
    let bestValue = -Infinity;
    remaining.forEach((candidate, index) => {
      const overlapPenalty = chosen.reduce((sum, selected) => {
        const a = new Set(candidate.movie.genres);
        const overlap = selected.movie.genres.filter((g) => a.has(g)).length;
        return sum + Math.min(.18, overlap * .06);
      }, 0);
      const value = candidate.score * (1 - overlapPenalty);
      if (value > bestValue) { bestValue = value; bestIndex = index; }
    });
    chosen.push(remaining.splice(bestIndex, 1)[0]);
  }
  return chosen;
}

export async function recommendMovie(answers: QuestionnaireAnswers, excludeIds: number[] = [], locale: Locale = "en"): Promise<RecommendationResult> {
  if (isTmdbConfigured()) {
    try { return await recommendFromTmdb(answers, excludeIds, locale); }
    catch (error) { console.warn("[recommend] TMDb failed:", error instanceof TmdbApiError ? error.message : error); }
  }
  return recommendFromFallback(answers, excludeIds);
}

async function recommendFromTmdb(answers: QuestionnaireAnswers, excludeIds: number[], locale: Locale): Promise<RecommendationResult> {
  const language = localeToTmdbLanguage(locale);
  const region = localeToWatchRegion(locale);
  // Broad candidate discovery, then expensive details only for the strongest candidates.
  const pages = [1, 2, 3];
  const responses = await Promise.all(pages.map((page) => discoverMovies(answersToDiscoverFilters(answers, page, locale))));
  const summaries = [...new Map(responses.flatMap((r) => r.results).filter((m) => m.poster_path && !excludeIds.includes(m.id)).map((m) => [m.id, mapTmdbSummaryToMovie(m)])).values()];
  if (!summaries.length) throw new TmdbApiError("No discover results for current filters.");

  // Summary-stage ranking cheaply narrows a 60-result candidate pool before hydration.
  const prefiltered = filterCandidates(summaries, answers, excludeIds);
  const preRanked = rankMovies(prefiltered.length ? prefiltered : summaries, answers);
  const shortlist = diversify(preRanked, 12).map((x) => x.movie);
  const hydrated = await hydrateCandidates(shortlist, language, region);
  const filtered = filterCandidates(hydrated, answers, excludeIds);
  const ranked = rankMovies(filtered.length ? filtered : hydrated, answers);
  const diversified = diversify(ranked, 7);
  const winner = diversified[0];
  if (!winner) throw new TmdbApiError("No candidates left after ranking.");

  const similar = diversified.slice(1).map((x) => x.movie).slice(0, 6);
  return { movie: winner.movie, reasons: winner.reasons, similar };
}

function recommendFromFallback(answers: QuestionnaireAnswers, excludeIds: number[]): RecommendationResult {
  const catalog = getFallbackMovies();
  const filtered = filterCandidates(catalog, answers, excludeIds);
  const ranked = rankMovies(filtered.length ? filtered : catalog, answers);
  const diversified = diversify(ranked, 7);
  const winner = diversified[0];
  if (!winner) throw new Error("Fallback catalog is empty. Run npm run build:fallback.");
  return { movie: winner.movie, reasons: winner.reasons, similar: diversified.slice(1).map((x) => x.movie) };
}

export function buildRecommendationReasons(movie: Movie, answers: QuestionnaireAnswers) {
  return rankMovies([movie], answers)[0]?.reasons ?? [{ key: "reasons.fallback" }];
}

export async function getRelatedMovies(movieId: number, answers: QuestionnaireAnswers | null, locale: Locale, excludeIds: number[] = []): Promise<Movie[]> {
  if (!isTmdbConfigured()) return getFallbackMovies().filter((m) => m.id !== movieId && !excludeIds.includes(m.id)).slice(0, 6);
  try {
    const language = localeToTmdbLanguage(locale);
    const region = localeToWatchRegion(locale);
    const [recommended, similar] = await Promise.all([getMovieRecommendations(movieId, language), getSimilarMovies(movieId, language)]);
    const summaries = [...new Map([...recommended.results, ...similar.results].filter((m) => m.poster_path && m.id !== movieId).map((m) => [m.id, mapTmdbSummaryToMovie(m)])).values()];
    const hydrated = await hydrateCandidates(summaries.slice(0, 12), language, region);
    const filtered = answers ? filterCandidates(hydrated, answers, [movieId, ...excludeIds]) : hydrated.filter((m) => !m.adult);
    if (!answers) return filtered.slice(0, 6);
    return rankMovies(filtered, answers).slice(0, 6).map((x) => x.movie);
  } catch { return []; }
}
