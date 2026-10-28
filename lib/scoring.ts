import type { Movie } from "@/types/movie";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { certificationAllowed } from "@/lib/certification";

export interface ReasonToken { key: string; params?: Record<string, string>; }
export interface ScoredMovie { movie: Movie; score: number; reasons: ReasonToken[]; }

export interface PersonalizationSignals {
  excludedIds?: number[];
  watchedIds?: number[];
  favoriteIds?: number[];
  ratings?: Record<number, string>;
  preferredGenres?: string[];
  historyGenreWeights?: Record<string, number>;
}

function passesAge(movie: Movie, answers: QuestionnaireAnswers) {
  if (!answers.maxAge) return true;
  return certificationAllowed({ rank: movie.ageRating ?? null, badge: movie.ageBadge ?? null, raw: null, source: movie.certificationSource ?? "unknown" }, answers.maxAge);
}

function passesAdult(movie: Movie, answers: QuestionnaireAnswers) {
  if (answers.watchingWith === "Family") return !movie.adult;
  return answers.allowAdult || !movie.adult;
}

export function passesHardFilters(movie: Movie, answers: QuestionnaireAnswers) {
  return passesAdult(movie, answers) && passesAge(movie, answers);
}

export function filterCandidates(
  movies: Movie[],
  answers: QuestionnaireAnswers,
  excludeIds: number[] = [],
  signals?: PersonalizationSignals,
) {
  const excluded = new Set([...excludeIds, ...(signals?.excludedIds ?? [])]);
  return movies.filter((movie) => !excluded.has(movie.id) && passesHardFilters(movie, answers));
}

function genreHits(movie: Movie, answers: QuestionnaireAnswers) {
  const wanted = new Set(answers.genres.map((g) => g.toLowerCase() === "sci-fi" ? "science fiction" : g.toLowerCase()));
  return movie.genres.filter((genre) => {
    const normalized = genre.toLowerCase();
    return wanted.has(normalized) || (normalized === "science fiction" && wanted.has("sci-fi"));
  });
}

function durationFit(movie: Movie, value: QuestionnaireAnswers["duration"]) {
  if (!value || value === "No preference" || !movie.runtime) return 0;
  const limit = value === "Under 90 minutes" ? 90 : value === "Under 2 hours" ? 120 : 150;
  if (movie.runtime <= limit) return 1;
  return Math.max(-1, 1 - (movie.runtime - limit) / 45);
}

function qualityScore(movie: Movie) {
  const rating = Math.max(0, Math.min(10, movie.imdbRating || 0));
  const votes = Math.max(0, movie.voteCount ?? 0);
  // Quality is deliberately a small tie-breaker, not the recommendation driver.
  const confidence = Math.min(1, Math.log10(votes + 1) / 5);
  return (rating / 10) * confidence;
}

/** Multi-signal matcher. Explicit user preferences dominate popularity/quality. */
export function scoreMovie(
  movie: Movie,
  answers: QuestionnaireAnswers,
  signals?: PersonalizationSignals,
): ScoredMovie {
  let score = 0;
  const reasons: ReasonToken[] = [];
  const genres = genreHits(movie, answers);

  if (answers.genres.length) {
    const coverage = genres.length / answers.genres.length;
    score += coverage * 30;
    if (genres.length) reasons.push({ key: "reasons.genreMatch", params: { genres: genres.slice(0, 3).join(" · ") } });
    if (!genres.length) score -= 14;
  }

  if (answers.mood) {
    if (movie.moods.includes(answers.mood)) { score += 25; reasons.push({ key: "reasons.moodMatch", params: { mood: answers.mood } }); }
    else score -= 8;
  }

  if (answers.energy) {
    if (movie.energy === answers.energy) { score += 12; reasons.push({ key: "reasons.energyMatch", params: { energy: answers.energy } }); }
    else score -= 3;
  }

  const duration = durationFit(movie, answers.duration);
  if (duration) {
    score += duration * 10;
    if (duration > .99) reasons.push({ key: "reasons.durationMatch" });
  }

  if (answers.streamingServices.length) {
    const overlap = movie.streamingServices.filter((service) => answers.streamingServices.includes(service));
    const coverage = overlap.length / answers.streamingServices.length;
    score += coverage * 12;
    if (overlap.length) reasons.push({ key: "reasons.streamingMatch", params: { services: overlap.join(", ") } });
    else score -= 10;
  }

  if (answers.discovery === "Something iconic") {
    score += movie.iconic ? 8 : -4;
    if (movie.iconic) reasons.push({ key: "reasons.iconic" });
  } else if (answers.discovery === "A hidden gem") {
    const votes = movie.voteCount ?? 0;
    const hidden = !movie.iconic && votes >= 50 && votes <= 10000 && movie.imdbRating >= 6.5;
    score += hidden ? 8 : -2;
    if (hidden) reasons.push({ key: "reasons.hiddenGem" });
  }

  score += qualityScore(movie) * 4;
  if (movie.imdbRating >= 7.5) reasons.push({ key: "reasons.quality" });

  // Account signals are secondary to the current questionnaire.
  const movieGenres = new Set(movie.genres.map((genre) => genre.toLowerCase()));
  const preferredGenreHits = (signals?.preferredGenres ?? []).filter((genre) =>
    movieGenres.has(genre.toLowerCase()),
  ).length;
  score += Math.min(8, preferredGenreHits * 4);

  const historicalGenreHits = Object.entries(signals?.historyGenreWeights ?? {})
    .filter(([genre, weight]) => weight > 0 && movieGenres.has(genre.toLowerCase()))
    .reduce((sum, [, weight]) => sum + Math.min(weight, 2), 0);
  score += Math.min(6, historicalGenreHits * 2);

  if (signals?.favoriteIds?.includes(movie.id)) score += 8;
  const rating = signals?.ratings?.[movie.id];
  if (rating === "loved") score += 8;
  else if (rating === "liked") score += 5;
  else if (rating === "disliked") score -= 25;
  if (signals?.watchedIds?.includes(movie.id)) score -= 12;

  if (answers.language && answers.language !== "Any language" && answers.language !== "No preference") {
    if (movie.language === answers.language) { score += 7; reasons.push({ key: "reasons.languageMatch", params: { language: answers.language } }); }
    else score -= 5;
  }

  if (answers.releasePeriod && answers.releasePeriod !== "No preference") {
    const match = answers.releasePeriod === "Recent" ? movie.year >= 2018 : answers.releasePeriod === "2000+" ? movie.year >= 2000 : movie.year > 0 && movie.year < 2000;
    score += match ? 6 : -4;
    if (match) reasons.push({ key: "reasons.periodMatch" });
  }

  if (answers.intensity && movie.intensity === answers.intensity) score += 4;

  if (answers.watchingWith) reasons.push({ key: "reasons.watchingWith", params: { watchingWith: answers.watchingWith } });
  if (!reasons.length) reasons.push({ key: "reasons.fallback" });

  return { movie, score, reasons: reasons.slice(0, 5) };
}

export function rankMovies(
  movies: Movie[],
  answers: QuestionnaireAnswers,
  signals?: PersonalizationSignals,
) {
  return movies.map((movie) => scoreMovie(movie, answers, signals)).sort((a, b) => b.score - a.score || b.movie.imdbRating - a.movie.imdbRating || (b.movie.voteCount ?? 0) - (a.movie.voteCount ?? 0));
}
