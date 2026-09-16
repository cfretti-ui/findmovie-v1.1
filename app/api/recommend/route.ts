import { NextResponse } from "next/server";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { recommendMovie } from "@/lib/recommendation.server";
import { getRequestLocale } from "@/lib/i18n/server-locale";
import { parseLocale } from "@/lib/i18n/tmdb-locale";

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
    const result = await recommendMovie(
      body.answers,
      body.excludeIds ?? [],
      locale,
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate recommendation." },
      { status: 500 },
    );
  }
}
