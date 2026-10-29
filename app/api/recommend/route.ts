import { NextResponse } from "next/server";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { recommendMovie } from "@/lib/recommendation.server";
import { getRequestLocale } from "@/lib/i18n/server-locale";
import { parseLocale } from "@/lib/i18n/tmdb-locale";
import {
  getHistoryGenreWeights,
  loadPersonalizationProfile,
  mergeSettingsIntoAnswers,
} from "@/lib/personalization.server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      answers: QuestionnaireAnswers;
      excludeIds?: number[];
      locale?: string;
    };

    if (!body.answers) {
      return NextResponse.json(
        { error: "Missing questionnaire answers." },
        { status: 400 },
      );
    }

    const requestLocale = await getRequestLocale();
    const locale = parseLocale(body.locale ?? requestLocale);
    const profile = await loadPersonalizationProfile();
    const answers = mergeSettingsIntoAnswers(body.answers, profile);
    const excludeIds = Array.isArray(body.excludeIds)
      ? body.excludeIds.filter((id) => Number.isFinite(id) && id > 0)
      : [];

    const result = await recommendMovie(answers, excludeIds, locale, profile ? {
      excludedIds: profile.excludedIds,
      watchedIds: profile.watchedIds,
      favoriteIds: profile.favoriteIds,
      ratings: profile.ratings,
      preferredGenres: profile.settings.genres,
      historyGenreWeights: getHistoryGenreWeights(profile),
    } : undefined);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate recommendation." },
      { status: 500 },
    );
  }
}
