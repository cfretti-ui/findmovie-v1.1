import type { DiscoverMoviesFilters } from "@/types/tmdb";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { GENRE_IDS, PROVIDER_IDS } from "@/lib/tmdb-constants";
import type { Locale } from "@/lib/i18n/locales";
import {
  localeToTmdbLanguage,
  localeToWatchRegion,
} from "@/lib/i18n/tmdb-locale";

const MOOD_GENRE_HINTS: Record<
  NonNullable<QuestionnaireAnswers["mood"]>,
  number[]
> = {
  Laugh: [GENRE_IDS.Comedy],
  Think: [GENRE_IDS["Sci-Fi"], GENRE_IDS.Thriller, GENRE_IDS.Drama],
  Cry: [GENRE_IDS.Drama, GENRE_IDS.Romance],
  "Feel inspired": [GENRE_IDS.Adventure, GENRE_IDS.Animation, GENRE_IDS.Drama],
  Adventure: [GENRE_IDS.Adventure, GENRE_IDS.Action],
  "Be scared": [GENRE_IDS.Horror, GENRE_IDS.Thriller],
};

const CERT_LTE: Record<NonNullable<QuestionnaireAnswers["maxAge"]>, string> = {
  all: "U",
  "10": "10",
  "12": "12",
  "16": "16",
  "18": "18",
};

/**
 * Converts questionnaire answers into TMDb discover API filters.
 */
export function answersToDiscoverFilters(
  answers: QuestionnaireAnswers,
  page = 1,
  locale: Locale = "en",
): DiscoverMoviesFilters {
  const filters: DiscoverMoviesFilters = {
    page,
    language: localeToTmdbLanguage(locale),
    include_adult: Boolean(answers.allowAdult) && answers.watchingWith !== "Family",
    vote_count_gte: 40,
  };

  const genreIds = new Set<number>();
  for (const genre of answers.genres) {
    genreIds.add(GENRE_IDS[genre]);
  }
  if (genreIds.size === 0 && answers.mood) {
    for (const id of MOOD_GENRE_HINTS[answers.mood]) {
      genreIds.add(id);
    }
  }
  if (genreIds.size > 0) {
    filters.with_genres = [...genreIds].join("|");
  }

  if (answers.duration === "Under 90 minutes") {
    filters.with_runtime_lte = 90;
  } else if (answers.duration === "Under 2 hours") {
    filters.with_runtime_lte = 120;
  }

  if (answers.releasePeriod === "Recent") {
    filters["primary_release_date.gte"] = "2018-01-01";
  } else if (answers.releasePeriod === "2000+") {
    filters["primary_release_date.gte"] = "2000-01-01";
  } else if (answers.releasePeriod === "Classics") {
    filters["primary_release_date.lte"] = "1999-12-31";
  }

  if (answers.language === "English") {
    filters.with_original_language = "en";
  } else if (answers.language === "French") {
    filters.with_original_language = "fr";
  }

  if (answers.streamingServices.length > 0) {
    filters.with_watch_providers = answers.streamingServices
      .map((s) => PROVIDER_IDS[s])
      .join("|");
    filters.watch_region =
      answers.language === "French" ? "FR" : localeToWatchRegion(locale);
  }

  if (answers.discovery === "Something iconic") {
    filters.sort_by = "popularity.desc";
    filters.vote_average_gte = 7;
  } else if (answers.discovery === "A hidden gem") {
    filters.sort_by = "vote_average.desc";
    filters.vote_average_gte = 6.5;
    filters.vote_count_gte = 40;
  } else {
    filters.sort_by = "popularity.desc";
  }

  if (answers.maxAge && answers.maxAge !== "18") {
    filters.certification_country = "FR";
    filters["certification.lte"] = CERT_LTE[answers.maxAge];
  }

  return filters;
}
