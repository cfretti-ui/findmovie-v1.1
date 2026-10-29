import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { HomeContent } from "@/components/layout/HomeContent";
import {
  getHeroCollageMovies,
  getHomeTrendingMovies,
} from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { initialQuestionnaireAnswers } from "@/types/questionnaire";
import { recommendMovie } from "@/lib/recommendation.server";
import { getRequestLocale } from "@/lib/i18n/server-locale";
import { parseLocale } from "@/lib/i18n/tmdb-locale";
import {
  getHistoryGenreWeights,
  loadPersonalizationProfile,
  mergeSettingsIntoAnswers,
} from "@/lib/personalization.server";

export default async function HomePage() {
  const supabase = await createClient();
  const locale = parseLocale(await getRequestLocale());

  const [
    { data: { user } },
    collageMovies,
    trending,
    personalization,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getHeroCollageMovies(locale),
    getHomeTrendingMovies(locale),
    loadPersonalizationProfile(),
  ]);

  let displayName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    displayName =
      profile?.username ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Utilisateur";
  }

  let forYou: typeof trending | null = null;
  const hasPersonalizationSignal = Boolean(
    personalization &&
      (personalization.history.length > 0 ||
        Object.keys(personalization.ratings).length > 0 ||
        personalization.favoriteIds.length > 0),
  );

  if (user && personalization && hasPersonalizationSignal) {
    try {
      const lastAnswers =
        personalization.history[0]?.answers ?? initialQuestionnaireAnswers;
      const answers = mergeSettingsIntoAnswers(
        { ...initialQuestionnaireAnswers, ...lastAnswers },
        personalization,
      );
      const recommendation = await recommendMovie(answers, [], locale, {
        excludedIds: personalization.excludedIds,
        watchedIds: personalization.watchedIds,
        favoriteIds: personalization.favoriteIds,
        ratings: personalization.ratings,
        preferredGenres: personalization.settings.genres,
        historyGenreWeights: getHistoryGenreWeights(personalization),
      });
      forYou = [
        recommendation.movie,
        ...recommendation.similar,
      ].slice(0, 12);
    } catch (error) {
      console.warn("[home] Personalized rail unavailable:", error);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero collageMovies={collageMovies} displayName={displayName} />
        <HomeContent trending={trending} forYou={forYou} />
      </main>
      <Footer />
    </>
  );
}
