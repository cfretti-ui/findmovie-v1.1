import "server-only";

import type { AgeMax, QuestionnaireAnswers } from "@/types/questionnaire";
import { createClient } from "@/lib/supabase/server";

export interface PersonalizationProfile {
  settings: {
    streamingServices: string[];
    genres: string[];
    maxAge: AgeMax | null;
    allowAdult: boolean;
  };
  history: Array<{
    mood: string | null;
    genres: string[];
    energy: string | null;
    duration: string | null;
    discovery: string | null;
    answers: Partial<QuestionnaireAnswers> | null;
  }>;
  ratings: Record<number, string>;
  favoriteIds: number[];
  watchedIds: number[];
  excludedIds: number[];
}

const EMPTY_PROFILE: PersonalizationProfile = {
  settings: {
    streamingServices: [],
    genres: [],
    maxAge: null,
    allowAdult: false,
  },
  history: [],
  ratings: {},
  favoriteIds: [],
  watchedIds: [],
  excludedIds: [],
};

const AGE_MAX_VALUES: AgeMax[] = ["all", "10", "12", "16", "18"];

function parseIds(rows: Array<{ movie_id: number }> | null | undefined) {
  return (rows ?? [])
    .map((row) => Number(row.movie_id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

export async function loadPersonalizationProfile(): Promise<PersonalizationProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) return null;

    const [preferencesResult, historyResult, ratingsResult, favoritesResult, watchedResult, excludedResult] =
      await Promise.all([
        supabase
          .from("user_preferences")
          .select("streaming_services, genres, max_age, allow_adult")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("questionnaire_history")
          .select("mood, genres, energy, duration, discovery, answers")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(15),
        supabase
          .from("movie_ratings")
          .select("movie_id, rating")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(50),
        supabase
          .from("favorites")
          .select("movie_id")
          .eq("user_id", user.id)
          .limit(100),
        supabase
          .from("watched_movies")
          .select("movie_id")
          .eq("user_id", user.id)
          .limit(100),
        supabase
          .from("excluded_movies")
          .select("movie_id")
          .eq("user_id", user.id)
          .limit(200),
      ]);

    const preference = preferencesResult.data;
    const history = (historyResult.data ?? []).map((row) => ({
      mood: row.mood ?? null,
      genres: Array.isArray(row.genres) ? row.genres : [],
      energy: row.energy ?? null,
      duration: row.duration ?? null,
      discovery: row.discovery ?? null,
      answers:
        row.answers && typeof row.answers === "object"
          ? (row.answers as Partial<QuestionnaireAnswers>)
          : null,
    }));

    const ratings: Record<number, string> = {};
    for (const row of ratingsResult.data ?? []) {
      const id = Number(row.movie_id);
      if (Number.isFinite(id) && id > 0 && typeof row.rating === "string") {
        ratings[id] = row.rating;
      }
    }

    const maxAge =
      preference?.max_age && AGE_MAX_VALUES.includes(preference.max_age as AgeMax)
        ? (preference.max_age as AgeMax)
        : null;

    return {
      settings: {
        streamingServices: Array.isArray(preference?.streaming_services)
          ? preference.streaming_services
          : [],
        genres: Array.isArray(preference?.genres) ? preference.genres : [],
        maxAge,
        allowAdult: Boolean(preference?.allow_adult),
      },
      history,
      ratings,
      favoriteIds: parseIds(favoritesResult.data),
      watchedIds: parseIds(watchedResult.data),
      excludedIds: parseIds(excludedResult.data),
    };
  } catch (error) {
    console.warn("[personalization] Profile unavailable; using quiz only:", error);
    return null;
  }
}

export function mergeSettingsIntoAnswers(
  answers: QuestionnaireAnswers,
  profile: PersonalizationProfile | null,
): QuestionnaireAnswers {
  if (!profile) return answers;
  const settings = profile.settings;

  return {
    ...answers,
    // The current quiz always wins when the user explicitly chose these.
    streamingServices:
      answers.streamingServices.length > 0
        ? answers.streamingServices
        : settings.streamingServices as QuestionnaireAnswers["streamingServices"],
    maxAge: settings.maxAge ?? answers.maxAge,
    allowAdult: settings.allowAdult || answers.allowAdult,
  };
}

export function getHistoryGenreWeights(profile: PersonalizationProfile | null) {
  const counts: Record<string, number> = {};
  for (const entry of profile?.history ?? []) {
    for (const genre of entry.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }
  return counts;
}
