"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Movie } from "@/types/movie";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPosterUrl } from "@/lib/tmdb-images";
import { motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export default function SearchPage() {
  const { locale } = useLocale();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q")?.trim();

    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as Movie[];

        setResults(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, locale]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* BACKGROUND LIGHT */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-[8%] h-[420px] w-[420px] rounded-full bg-black/[0.035] blur-[100px] dark:bg-white/[0.035]" />

          <div className="absolute right-[5%] top-[28%] h-[360px] w-[360px] rounded-full bg-black/[0.025] blur-[100px] dark:bg-white/[0.025]" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-28 pt-20 sm:px-8 sm:pt-28">
          {/* HEADER */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: motionEase }}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              FindMovie
            </p>

            <h1 className="text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl">
              Recherche
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-muted sm:text-base">
              Trouve un film, découvre sa fiche et laisse FindMovie faire le
              reste.
            </p>

            {/* SEARCH BAR */}
            <div className="relative mx-auto mt-10 max-w-2xl">
              <div className="absolute -inset-1 rounded-[30px] bg-black/[0.025] blur-xl dark:bg-white/[0.025]" />

              <div className="relative rounded-[26px] border border-black/[0.08] bg-white/65 p-1.5 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/[0.1] dark:bg-white/[0.07] dark:shadow-[0_20px_70px_rgba(0,0,0,0.25)]">
                <div className="flex h-14 items-center rounded-[20px] border border-black/[0.05] bg-black/[0.025] px-4 dark:border-white/[0.06] dark:bg-white/[0.035]">
                  <span className="mr-3 text-xl text-black/45 dark:text-white/45">
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un film..."
                    autoFocus
                    className="min-w-0 flex-1 appearance-none bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none sm:text-base"
                  />

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-3 h-4 w-4 shrink-0 animate-spin rounded-full border border-black/15 border-t-black dark:border-white/15 dark:border-t-white"
                      />
                    ) : query ? (
                      <motion.button
                        key="clear"
                        type="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setQuery("")}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-xs text-muted transition-colors hover:bg-black/[0.1] hover:text-foreground dark:bg-white/[0.08] dark:hover:bg-white/[0.13]"
                        aria-label="Effacer la recherche"
                      >
                        ×
                      </motion.button>
                    ) : (
                      <motion.kbd
                        key="shortcut"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hidden rounded-lg border border-black/[0.08] px-2 py-1 text-[10px] text-muted sm:block dark:border-white/[0.1]"
                      >
                        ⌘ K
                      </motion.kbd>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.section>

          {/* RESULTS */}
          <section className="mt-20">
            {!query.trim() ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto max-w-2xl py-20 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-black/[0.07] bg-white/60 text-2xl shadow-lg backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.06]">
                  ⌕
                </div>

                <h2 className="mt-6 text-lg font-semibold tracking-[-0.02em]">
                  Que veux-tu regarder ?
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                  Recherche un titre, un film culte ou simplement quelque
                  chose qui te donne envie.
                </p>
              </motion.div>
            ) : null}

            {query.trim() && !loading && results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-2xl py-20 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-black/[0.07] bg-white/60 shadow-lg backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.06]">
                  <span className="text-xl">⌕</span>
                </div>

                <h2 className="mt-6 text-lg font-semibold tracking-[-0.02em]">
                  Aucun résultat
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Essaie avec un autre titre.
                </p>
              </motion.div>
            ) : null}

            {results.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-7 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                      Résultats
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                      Films correspondant à « {query.trim()} »
                    </h2>
                  </div>

                  <p className="hidden text-sm text-muted sm:block">
                    {results.length} résultat
                    {results.length > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.map((movie, index) => {
                    const posterUrl = getPosterUrl(movie.posterPath);

                    return (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(index * 0.045, 0.4),
                          ease: motionEase,
                        }}
                      >
                        <Link
                          href={`/movie/${movie.id}`}
                          className="group block"
                        >
                          <div className="relative aspect-[2/3] overflow-hidden rounded-[20px] bg-black/[0.04] shadow-md ring-1 ring-black/[0.07] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl dark:bg-white/[0.05] dark:ring-white/[0.08]">
                            {posterUrl ? (
                              <Image
                                src={posterUrl}
                                alt={movie.title}
                                fill
                                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 16vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center p-5 text-center text-sm text-muted">
                                {movie.title}
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80" />

                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-white">
                                {movie.title}
                              </p>

                              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/70">
                                {movie.year > 0 ? (
                                  <span>{movie.year}</span>
                                ) : null}

                                {movie.imdbRating > 0 ? (
                                  <span>
                                    ★ {movie.imdbRating.toFixed(1)}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}