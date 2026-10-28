import type { StreamingService } from "@/types/movie";
import {
  initialQuestionnaireAnswers,
  type AgeMax,
  type DiscoveryStyle,
  type Duration,
  type Energy,
  type Mood,
  type MovieGenreOption,
  type QuestionnaireAnswers,
} from "@/types/questionnaire";

/** Columns already read and written by Settings. Do not add unconfirmed fields. */
export const USER_PREFERENCES_COLUMNS =
  "streaming_services, genres, mood, energy, duration, discovery, max_age, allow_adult" as const;

export type UserPreferencesRecord = {
  streaming_services?: string[] | null;
  genres?: string[] | null;
  mood?: string | null;
  energy?: string | null;
  duration?: string | null;
  discovery?: string | null;
  max_age?: string | null;
  allow_adult?: boolean | null;
};

export type UserPreferencesWritePayload = {
  user_id: string;
  streaming_services: string[];
  genres: MovieGenreOption[];
  mood: Mood | null;
  energy: Energy | null;
  duration: Duration | null;
  discovery: DiscoveryStyle | null;
  max_age: AgeMax | null;
  allow_adult: boolean;
  updated_at: string;
};

const MOODS: readonly Mood[] = [
  "Laugh",
  "Think",
  "Cry",
  "Feel inspired",
  "Adventure",
  "Be scared",
];
const GENRES: readonly MovieGenreOption[] = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Horror",
  "Animation",
];
const ENERGIES: readonly Energy[] = [
  "Slow & atmospheric",
  "Balanced",
  "Fast & intense",
];
const DURATIONS: readonly Duration[] = [
  "Under 90 minutes",
  "Under 2 hours",
  "Under 2 hours 30",
  "No preference",
];
const DISCOVERIES: readonly DiscoveryStyle[] = [
  "Something iconic",
  "A hidden gem",
  "Surprise me",
];
const STREAMING_SERVICES: readonly StreamingService[] = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Apple TV+",
  "Max",
  "Canal+",
];
const AGE_MAX: readonly AgeMax[] = ["all", "10", "12", "16", "18"];

function pickValue<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function pickList<T extends string>(
  values: string[] | null | undefined,
  allowed: readonly T[],
): T[] {
  if (!Array.isArray(values)) return [];
  const allowedSet = new Set<string>(allowed);
  return values.filter((value): value is T => allowedSet.has(value));
}

export function userPreferencesToAnswers(
  record: UserPreferencesRecord | null | undefined,
): QuestionnaireAnswers {
  if (!record) return { ...initialQuestionnaireAnswers };

  return {
    ...initialQuestionnaireAnswers,
    mood: pickValue(record.mood, MOODS),
    genres: pickList(record.genres, GENRES),
    energy: pickValue(record.energy, ENERGIES),
    duration: pickValue(record.duration, DURATIONS),
    discovery: pickValue(record.discovery, DISCOVERIES),
    streamingServices: pickList(record.streaming_services, STREAMING_SERVICES),
    maxAge: pickValue(record.max_age, AGE_MAX),
    allowAdult: Boolean(record.allow_adult),
  };
}

/**
 * Writes questionnaire fields from answers. Settings-only columns
 * (`streaming_services`, `max_age`, `allow_adult`) keep the existing row
 * when present so a quiz save cannot wipe them.
 */
export function answersToUserPreferences(
  answers: QuestionnaireAnswers,
  userId: string,
  existing: UserPreferencesRecord | null | undefined,
): UserPreferencesWritePayload {
  const existingStreaming = pickList(
    existing?.streaming_services,
    STREAMING_SERVICES,
  );
  const existingMaxAge = pickValue(existing?.max_age, AGE_MAX);

  return {
    user_id: userId,
    mood: pickValue(answers.mood, MOODS),
    genres: pickList(answers.genres, GENRES),
    energy: pickValue(answers.energy, ENERGIES),
    duration: pickValue(answers.duration, DURATIONS),
    discovery: pickValue(answers.discovery, DISCOVERIES),
    streaming_services:
      existingStreaming.length > 0
        ? existingStreaming
        : pickList(answers.streamingServices, STREAMING_SERVICES),
    max_age: existingMaxAge ?? pickValue(answers.maxAge, AGE_MAX),
    allow_adult: existing
      ? Boolean(existing.allow_adult)
      : Boolean(answers.allowAdult),
    updated_at: new Date().toISOString(),
  };
}
