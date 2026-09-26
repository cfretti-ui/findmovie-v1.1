"use client";
import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";

import type { Movie } from "@/types/movie";
import { getBackdropUrl, getPosterUrl } from "@/lib/tmdb-images";
import { AgeBadge } from "@/components/movie/AgeBadge";
import { Button } from "@/components/ui/Button";
import { fadeUp, motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function MovieDetailView({ movie }: { movie: Movie }) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [movie.id]);
  const { t } = useLocale();

  const rating =
    typeof movie.imdbRating === "number" && movie.imdbRating > 0
      ? movie.imdbRating.toFixed(1)
      : null;

  const backdropUrl = getBackdropUrl(movie.backdropPath);
  const posterUrl = getPosterUrl(movie.posterPath);

  const trailerUrl = movie.trailerKey
    ? `https://www.youtube.com/embed/${movie.trailerKey}?rel=0&modestbranding=1`
    : null;

    return (

      <div>
      {/* HERO BACKDROP */}
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[440px]">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/10" />
      </div>

      <div className="relative z-10 mx-auto -mt-28 w-full max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* POSTER */}
          <div className="mx-auto w-full max-w-[220px] lg:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] bg-black/5 shadow-2xl ring-1 ring-black/10 dark:bg-white/5 dark:ring-white/10">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="220px"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-5 text-center text-sm text-black/40 dark:text-white/40">
                  {movie.title}
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div className="min-w-0 pt-4">
            {(movie.ageBadge || movie.adult) && (
              <AgeBadge
                badge={movie.ageBadge}
                adult={movie.adult}
                className="mb-3"
              />
            )}

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-black dark:text-white sm:text-5xl">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title ? (
              <p className="mt-1.5 text-sm text-muted">
                {t("movie.originalTitle")}: {movie.originalTitle}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
              {movie.year > 0 && <span>{movie.year}</span>}

              {movie.runtime > 0 && (
                <>
                  <span className="text-border">•</span>
                  <span>
                    {t("movie.minutes", { count: movie.runtime })}
                  </span>
                </>
              )}

              {rating && (
                <>
                  <span className="text-border">•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-foreground">★</span>
                    <span>{rating}</span>

                    {movie.voteCount ? (
                      <span className="text-muted/70">
                        ({t("movie.votes", { count: movie.voteCount })})
                      </span>
                    ) : null}
                  </span>
                </>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-black/[0.07] bg-black/[0.025] px-3 py-1.5 text-xs font-medium text-black/55 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.045] dark:text-white/60"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {movie.synopsis && (
              <section className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                  {t("movie.overview")}
                </p>

                <p className="mt-3 max-w-3xl text-[16px] leading-7 text-black/70 dark:text-white/70">
                  {movie.synopsis}
                </p>
              </section>
            )}

            {movie.director && (
              <p className="mt-6 text-sm text-muted">
                <span className="font-semibold text-foreground">
                  {t("movie.director")}:
                </span>{" "}
                {movie.director}
              </p>
            )}

            {movie.cast && movie.cast.length > 0 && (
              <p className="mt-2 text-sm text-muted">
                <span className="font-semibold text-foreground">
                  {t("movie.cast")}:
                </span>{" "}
                {movie.cast.join(", ")}
              </p>
            )}

            {movie.streamingServices.length > 0 && (
              <section className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                  {t("movie.availableOn")}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.streamingServices.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-black/[0.07] bg-black/[0.025] px-3 py-1.5 text-xs font-medium text-black/55 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.045] dark:text-white/60"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-10">
              <Button href="/" variant="secondary">
                {t("movie.backHome")}
              </Button>
            </div>
          </div>
        </div>

        {/* TRAILER */}
        {trailerUrl && (
          <section className="mt-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
              Bande-annonce
            </p>

            <div className="relative aspect-video w-full overflow-hidden rounded-[24px] bg-black shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
              <iframe
                src={trailerUrl}
                title={movie.trailerName ?? `Bande-annonce de ${movie.title}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}