"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useQuestionnaire } from "@/lib/questionnaire-context";
import { RecommendationCard } from "@/components/movie/RecommendationCard";
import { Button } from "@/components/ui/Button";
import { fadeIn, motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Movie } from "@/types/movie";
import type { ReasonToken } from "@/lib/scoring";

export function RecommendationView() {
  const router = useRouter();
  const { t } = useLocale();

  const {
    answers,
    excludedMovieIds,
    excludeMovie,
    reset,
    isComplete,
  } = useQuestionnaire();

  const [seed, setSeed] = useState(0);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reasons, setReasons] = useState<ReasonToken[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendation = useCallback(async () => {
    if (!isComplete) return;

    setLoading(true);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          excludeIds: excludedMovieIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Recommendation failed");
      }

      const data = (await response.json()) as {
        movie: Movie;
        reasons: ReasonToken[];
      };

      setMovie(data.movie);
      setReasons(data.reasons);
    } catch {
      setMovie(null);
      setReasons([]);
    } finally {
      setLoading(false);
    }
  }, [answers, excludedMovieIds, isComplete]);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation, seed]);

  const handleAnother = () => {
    if (movie) {
      excludeMovie(movie.id);
    }

    setSeed((value) => value + 1);
  };

  const handleRestart = () => {
    reset();
    router.push("/questionnaire");
  };

  if (!isComplete) {
    router.replace("/questionnaire");
    return null;
  }

  return (
    <main className="min-h-screen px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.45, ease: motionEase }}
        >
          <div className="mb-10 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
            >
              {t("common.back")}
            </Button>

            <Button
              variant="ghost"
              onClick={handleRestart}
            >
              {t("recommendation.restart")}
            </Button>
          </div>

          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-black/45 dark:text-white/45">
              {t("recommendation.eyebrow")}
            </p>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-black dark:text-white sm:text-5xl">
              {t("recommendation.title")}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-black/55 dark:text-white/55">
              {t("recommendation.subtitle")}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[420px] items-center justify-center"
              >
                <div className="text-center">
                  <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-black dark:border-white/10 dark:border-t-white" />

                  <p className="text-sm text-black/50 dark:text-white/50">
                    {t("recommendation.loading")}
                  </p>
                </div>
              </motion.div>
            ) : movie ? (
              <motion.div
                key={`${movie.id}-${seed}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeIn}
                transition={{ duration: 0.45, ease: motionEase }}
              >
                <RecommendationCard
                  movie={movie}
                  reasons={reasons}
                  onWatched={handleAnother}
                  onAnother={handleAnother}
                  onRestart={handleRestart}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[420px] items-center justify-center text-center"
              >
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {t("recommendation.noResult")}
                  </h2>

                  <p className="mt-3 text-black/50 dark:text-white/50">
                    {t("recommendation.noResultSubtitle")}
                  </p>

                  <div className="mt-6">
                    <Button onClick={handleRestart}>
                      {t("recommendation.restart")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}