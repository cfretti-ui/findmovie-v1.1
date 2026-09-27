import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profil · FindMovie",
  description: "Votre espace personnel FindMovie.",
};

type Profile = {
  username: string | null;
  avatar_url: string | null;
  created_at: string;
};

type Preferences = {
  genres: string[];
  mood: string | null;
  watching_with: string | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f5f7] text-[#1d1d1f] dark:bg-black dark:text-white">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="w-full max-w-md text-center">
            <h1 className="text-[32px] font-semibold tracking-[-0.04em]">
              Connectez-vous à FindMovie
            </h1>
            <p className="mt-4 text-[17px] leading-7 text-black/50 dark:text-white/50">
              Connectez-vous pour retrouver votre profil, vos favoris et votre
              historique.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-[#0071e3] px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Se connecter
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const [
    { data: profileData },
    { data: preferencesData },
    { count: watchedCount },
    { count: favoriteCount },
    { count: excludedCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, avatar_url, created_at")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_preferences")
      .select("genres, mood, watching_with")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("watched_movies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("excluded_movies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const profile = profileData as Profile | null;
  const preferences = preferencesData as Preferences | null;

  const displayName =
    profile?.username ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Utilisateur";

  const initial = displayName.charAt(0).toUpperCase();

  const createdAt = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(profile?.created_at || user.created_at));

  const genres = preferences?.genres ?? [];

  const moodLabels: Record<string, string> = {
    happy: "Quelque chose de léger",
    sad: "Quelque chose d'émouvant",
    exciting: "Quelque chose d'intense",
    scary: "Quelque chose qui fait peur",
    relaxed: "Quelque chose de relaxant",
    thoughtful: "Quelque chose qui fait réfléchir",
  };

  const watchingWithLabels: Record<string, string> = {
    alone: "Seul",
    partner: "Avec mon partenaire",
    friends: "Avec des amis",
    family: "Avec ma famille",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] text-[#1d1d1f] dark:bg-black dark:text-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-6 pb-28 pt-24 sm:px-10 sm:pt-28 lg:px-12">
          <header className="flex flex-col items-center text-center">
            <div className="flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border border-black/[0.07] bg-white/60 text-[26px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-3xl dark:border-white/[0.1] dark:bg-white/[0.08]">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <p className="mt-6 text-[13px] font-medium text-black/40 dark:text-white/40">
              Mon profil
            </p>

            <h1 className="mt-2 text-[42px] font-semibold tracking-[-0.055em] sm:text-[52px]">
              {displayName}
            </h1>

            <p className="mt-3 text-[16px] text-black/45 dark:text-white/45">
              {user.email}
            </p>

            <p className="mt-1 text-[13px] text-black/30 dark:text-white/30">
              Membre depuis {createdAt}
            </p>

            <Link
              href="/settings"
              className="mt-7 inline-flex h-10 items-center rounded-full border border-black/[0.08] bg-white/55 px-5 text-[14px] font-medium shadow-[0_5px_20px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all hover:bg-white/75 dark:border-white/[0.1] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
            >
              Modifier le profil
            </Link>
          </header>

          <section className="mt-20 overflow-hidden rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.055)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
            <div className="grid sm:grid-cols-3">
              <Link
                href="/watched"
                className="flex min-h-[190px] flex-col items-center justify-center px-6 text-center transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.025]"
              >
                <p className="text-[14px] text-black/45 dark:text-white/45">
                  Films vus
                </p>
                <p className="mt-3 text-[48px] font-semibold leading-none tracking-[-0.06em]">
                  {watchedCount ?? 0}
                </p>
                <p className="mt-3 text-[13px] text-black/30 dark:text-white/30">
                  Votre historique
                </p>
              </Link>

              <Link
                href="/favorites"
                className="flex min-h-[190px] flex-col items-center justify-center border-t border-black/[0.06] px-6 text-center transition-colors hover:bg-black/[0.02] dark:border-white/[0.08] dark:hover:bg-white/[0.025] sm:border-l sm:border-t-0"
              >
                <p className="text-[14px] text-black/45 dark:text-white/45">
                  Favoris
                </p>
                <p className="mt-3 text-[48px] font-semibold leading-none tracking-[-0.06em]">
                  {favoriteCount ?? 0}
                </p>
                <p className="mt-3 text-[13px] text-black/30 dark:text-white/30">
                  Vos films préférés
                </p>
              </Link>

              <div className="flex min-h-[190px] flex-col items-center justify-center border-t border-black/[0.06] px-6 text-center dark:border-white/[0.08] sm:border-l sm:border-t-0">
                <p className="text-[14px] text-black/45 dark:text-white/45">
                  Films masqués
                </p>
                <p className="mt-3 text-[48px] font-semibold leading-none tracking-[-0.06em]">
                  {excludedCount ?? 0}
                </p>
                <p className="mt-3 text-[13px] text-black/30 dark:text-white/30">
                  Vos exclusions
                </p>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <div className="text-center">
              <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                Personnalisation
              </p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.045em]">
                Vos préférences
              </h2>
            </div>

            <div className="mt-8 overflow-hidden rounded-[32px] border border-black/[0.06] bg-white/55 shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
              <div className="px-7 py-8 text-center sm:px-10">
                <p className="text-[14px] font-medium">Genres préférés</p>

                {genres.length > 0 ? (
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {genres.map((genre: string) => (
                      <span
                        key={genre}
                        className="rounded-full border border-black/[0.06] bg-white/60 px-4 py-2 text-[13px] text-black/65 shadow-sm backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/70"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-black/40 dark:text-white/40">
                    Vos genres préférés apparaîtront ici après avoir complété
                    le questionnaire.
                  </p>
                )}
              </div>

              <div className="grid border-t border-black/[0.06] dark:border-white/[0.08] sm:grid-cols-2">
                <div className="flex flex-col items-center px-7 py-8 text-center sm:px-10">
                  <p className="text-[14px] text-black/40 dark:text-white/40">
                    Humeur
                  </p>
                  <p className="mt-2 text-[15px] font-medium">
                    {preferences?.mood
                      ? moodLabels[preferences.mood] || preferences.mood
                      : "Pas encore définie"}
                  </p>
                </div>

                <div className="flex flex-col items-center border-t border-black/[0.06] px-7 py-8 text-center dark:border-white/[0.08] sm:border-l sm:border-t-0 sm:px-10">
                  <p className="text-[14px] text-black/40 dark:text-white/40">
                    Je regarde avec
                  </p>
                  <p className="mt-2 text-[15px] font-medium">
                    {preferences?.watching_with
                      ? watchingWithLabels[preferences.watching_with] ||
                        preferences.watching_with
                      : "Pas encore défini"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-24">
            <div className="text-center">
              <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
                Navigation
              </p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.045em]">
                Votre espace FindMovie
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link
                href="/favorites"
                className="group rounded-[28px] border border-black/[0.06] bg-white/55 px-7 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-3xl transition-all hover:-translate-y-1 hover:bg-white/75 dark:border-white/[0.08] dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
              >
                <p className="text-[17px] font-medium tracking-[-0.02em]">
                  Mes favoris
                </p>
                <p className="mt-2 text-[13px] text-black/40 dark:text-white/40">
                  Retrouvez vos films préférés
                </p>
                <p className="mt-5 text-[13px] text-black/40 transition-transform group-hover:translate-x-1 dark:text-white/40">
                  Voir →
                </p>
              </Link>

              <Link
                href="/watched"
                className="group rounded-[28px] border border-black/[0.06] bg-white/55 px-7 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-3xl transition-all hover:-translate-y-1 hover:bg-white/75 dark:border-white/[0.08] dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
              >
                <p className="text-[17px] font-medium tracking-[-0.02em]">
                  Films vus
                </p>
                <p className="mt-2 text-[13px] text-black/40 dark:text-white/40">
                  Retrouvez votre historique
                </p>
                <p className="mt-5 text-[13px] text-black/40 transition-transform group-hover:translate-x-1 dark:text-white/40">
                  Voir →
                </p>
              </Link>

              <Link
                href="/settings"
                className="group rounded-[28px] border border-black/[0.06] bg-white/55 px-7 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-3xl transition-all hover:-translate-y-1 hover:bg-white/75 dark:border-white/[0.08] dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
              >
                <p className="text-[17px] font-medium tracking-[-0.02em]">
                  Réglages
                </p>
                <p className="mt-2 text-[13px] text-black/40 dark:text-white/40">
                  Gérez votre compte
                </p>
                <p className="mt-5 text-[13px] text-black/40 transition-transform group-hover:translate-x-1 dark:text-white/40">
                  Ouvrir →
                </p>
              </Link>
            </div>
          </section>

          <div className="mt-20 text-center">
            <Link
              href="/questionnaire"
              className="text-[14px] font-medium text-[#0071e3] transition-opacity hover:opacity-70"
            >
              Modifier mes préférences →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}