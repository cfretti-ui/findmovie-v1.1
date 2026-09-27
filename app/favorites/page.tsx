import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { getMovieDetails } from "@/services/tmdb";

export const metadata: Metadata = {
  title: "Mes favoris · FindMovie",
  description: "Retrouvez vos films favoris sur FindMovie.",
};

type Favorite = {
  movie_id: number;
  created_at: string;
};

export default async function FavoritesPage() {
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
              Connectez-vous pour retrouver vos films favoris.
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

  const { data: favorites } = await supabase
    .from("favorites")
    .select("movie_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const favoriteMovies = await Promise.all(
    ((favorites || []) as Favorite[]).map(async (favorite) => {
      try {
        const movie = await getMovieDetails(favorite.movie_id);
        return {
          ...movie,
          addedAt: favorite.created_at,
        };
      } catch {
        return null;
      }
    }),
  );

  const movies = favoriteMovies.filter(
    (movie): movie is NonNullable<typeof movie> => movie !== null,
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f7] text-[#1d1d1f] dark:bg-black dark:text-white">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1180px] px-6 pb-28 pt-24 sm:px-10 sm:pt-28 lg:px-12">
          <header className="text-center">
            <p className="text-[13px] font-medium text-black/40 dark:text-white/40">
              Mon espace
            </p>
            <h1 className="mt-2 text-[42px] font-semibold tracking-[-0.055em] sm:text-[52px]">
              Mes favoris
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-black/45 dark:text-white/45">
              Retrouvez les films que vous souhaitez garder près de vous.
            </p>
          </header>

          {movies.length === 0 ? (
            <section className="mx-auto mt-20 max-w-2xl rounded-[32px] border border-black/[0.06] bg-white/55 px-8 py-16 text-center shadow-[0_25px_90px_rgba(0,0,0,0.045)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.055]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/[0.06] bg-white/60 text-2xl shadow-sm backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.07]">
                ♡
              </div>

              <h2 className="mt-6 text-[25px] font-semibold tracking-[-0.035em]">
                Aucun favori pour le moment
              </h2>

              <p className="mx-auto mt-3 max-w-md text-[15px] leading-6 text-black/45 dark:text-white/45">
                Lorsque vous ajouterez un film à vos favoris, il apparaîtra
                automatiquement ici.
              </p>

              <Link
                href="/questionnaire"
                className="mt-8 inline-flex h-11 items-center rounded-full bg-[#0071e3] px-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Trouver un film
              </Link>
            </section>
          ) : (
            <section className="mt-16">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-[13px] text-black/40 dark:text-white/40">
                    Votre bibliothèque
                  </p>
                  <p className="mt-1 text-[17px] font-medium">
                    {movies.length}{" "}
                    {movies.length === 1 ? "film favori" : "films favoris"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {movies.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-[20px] bg-black/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_55px_rgba(0,0,0,0.16)] dark:bg-white/[0.05]">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-5 text-center text-sm text-black/40 dark:text-white/40">
                          {movie.title}
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <h2 className="mt-4 line-clamp-2 text-[15px] font-medium tracking-[-0.01em]">
                      {movie.title}
                    </h2>

                    {movie.release_date && (
                      <p className="mt-1 text-[13px] text-black/40 dark:text-white/40">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}