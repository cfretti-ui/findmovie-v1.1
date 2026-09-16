"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import type { ReasonToken } from "@/lib/scoring";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb-images";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function RecommendationCard({
  movie,
  reasons,
  onWatched,
  onAnother,
  onRestart,
}: {
  movie: Movie;
  reasons: ReasonToken[];
  onWatched: () => void;
  onAnother: () => void;
  onRestart: () => void;
}) {
  const { t } = useLocale();

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const rating =
    typeof movie.vote_average === "number"
      ? movie.vote_average.toFixed(1)
      : null;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.55, ease: motionEase }}
      className="mx-auto w-full max-w-5xl"
    >
      <GlassCard className="overflow-hidden p-0">
        {/* HERO */}
        <div className="relative h-[420px] w-full overflow-hidden sm:h-[500px]">
          {movie.backdrop_path ? (
            <Image
              src={getBackdropUrl(movie.backdrop_path)}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
              {t("recommendation.yourMatch")}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/75">
              {year && <span>{year}</span>}

              {year && rating && (
                <span className="text-white/35">•</span>
              )}

              {rating && (
                <span className="flex items-center gap-1">
                  <span className="text-white">★</span>
                  {rating}
                </span>
              )}

              {movie.original_language && (
                <>
                  <span className="text-white/35">•</span>
                  <span>{movie.original_language.toUpperCase()}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[190px_1fr]">
          {/* POSTER */}
          <div className="mx-auto w-full max-w-[190px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[22px] bg-black/5 shadow-2xl ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10">
              {movie.poster_path ? (
                <Image
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="190px"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-5 text-center text-sm text-black/40 dark:text-white/40">
                  {movie.title}
                </div>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="min-w-0">
            {movie.overview && (
              <p className="max-w-3xl text-[16px] leading-7 text-black/65 dark:text-white/65">
                {movie.overview}
              </p>
            )}

            {reasons.length > 0 && (
              <section className="mt-8">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                    {t("recommendation.why")}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {reasons.map((reason, index) => (
                    <div
                      key={`${reason.key}-${index}`}
                      className="rounded-[18px] border border-black/[0.06] bg-black/[0.025] px-4 py-4 text-sm leading-6 text-black/70 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.045] dark:text-white/70"
                    >
                      {t(reason.key, reason.params)}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={onWatched}
                className="min-h-12 flex-1"
              >
                {t("recommendation.watched")}
              </Button>

              <Button
                variant="secondary"
                onClick={onAnother}
                className="min-h-12 flex-1"
              >
                {t("recommendation.another")}
              </Button>
            </div>

            <button
              type="button"
              onClick={onRestart}
              className="mt-5 block w-full text-center text-sm text-black/40 transition hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
            >
              {t("recommendation.restart")}
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}