
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { Movie } from "@/types/movie";
import type { ReasonToken } from "@/lib/scoring";

import {
  getBackdropUrl,
  getPosterUrl,
} from "@/lib/tmdb-images";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

interface RecommendationCardProps {
  movie: Movie;
  reasons: ReasonToken[];
  onWatched: () => void;
  onAnother: () => void;
  onRestart: () => void;
}

export function RecommendationCard({
  movie,
  reasons,
  onWatched,
  onAnother,
  onRestart,
}: RecommendationCardProps) {
  const { t } = useLocale();

  const rating =
    typeof movie.imdbRating === "number"
      ? movie.imdbRating.toFixed(1)
      : null;

  const backdropUrl = getBackdropUrl(movie.backdropPath);
  const posterUrl = getPosterUrl(movie.posterPath);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.55,
        ease: motionEase,
      }}
      className="mx-auto w-full max-w-5xl"
    >
      <GlassCard className="overflow-hidden p-0">
        {/* HERO */}
        <div className="relative h-[420px] w-full overflow-hidden sm:h-[500px]">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 1024px"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
          )}

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <div className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
              {t("recommendation.yourMatch")}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/75">
              <span>{movie.year}</span>

              <span className="text-white/35">•</span>

              {rating && (
                <>
                  <span className="flex items-center gap-1">
                    <span className="text-white">★</span>
                    <span>{rating}</span>
                  </span>

                  <span className="text-white/35">•</span>
                </>
              )}

              {movie.runtime > 0 && (
                <span>
                  {movie.runtime} min
                </span>
              )}

              <span className="text-white/35">•</span>

              <span>{movie.language}</span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[190px_1fr]">
          {/* POSTER */}
          <div className="mx-auto w-full max-w-[190px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[22px] bg-black/5 shadow-2xl ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10">
              {posterUrl ? (
                <Image
                  src={posterUrl}
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
            {/* SYNOPSIS */}
            {movie.synopsis && (
              <p className="max-w-3xl text-[16px] leading-7 text-black/65 dark:text-white/65">
                {movie.synopsis}
              </p>
            )}

            {/* GENRES */}
            {movie.genres.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {movie.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-black/[0.07] bg-black/[0.025] px-3 py-1.5 text-xs font-medium text-black/55 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.045] dark:text-white/60"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* WHY */}
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

            {/* ACTIONS */}
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

            {/* RESTART */}
            <button
              type="button"
              onClick={onRestart}
              className="mt-5 block w-full text-center text-sm text-black/40 transition-colors hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
            >
              {t("recommendation.restart")}
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
