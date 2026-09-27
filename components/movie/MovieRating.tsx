"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Rating = "disliked" | "liked" | "loved";

type MovieRatingProps = {
  movieId: number;
};

const options: {
  value: Rating;
  label: string;
  symbol: string;
}[] = [
  {
    value: "disliked",
    label: "Je n’ai pas aimé",
    symbol: "×",
  },
  {
    value: "liked",
    label: "J’ai aimé",
    symbol: "♡",
  },
  {
    value: "loved",
    label: "J’adore",
    symbol: "♥",
  },
];

export function MovieRating({ movieId }: MovieRatingProps) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRating() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("movie_ratings")
        .select("rating")
        .eq("user_id", user.id)
        .eq("movie_id", movieId)
        .maybeSingle();

      if (
        data?.rating === "disliked" ||
        data?.rating === "liked" ||
        data?.rating === "loved"
      ) {
        setRating(data.rating);
      }

      setLoading(false);
    }

    loadRating();
  }, [movieId]);

  async function handleRating(value: Rating) {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const previousRating = rating;
    setRating(value);

    const { error } = await supabase.from("movie_ratings").upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        rating: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,movie_id",
      },
    );

    if (error) {
      setRating(previousRating);
    }
  }

  if (loading) {
    return (
      <section className="mt-10">
        <div className="rounded-[28px] border border-black/[0.06] bg-white/45 px-6 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.045]">
          <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-black/[0.06] dark:bg-white/[0.08]" />
          <div className="mx-auto mt-5 h-10 max-w-xl animate-pulse rounded-full bg-black/[0.04] dark:bg-white/[0.06]" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="rounded-[28px] border border-black/[0.06] bg-white/45 px-6 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)] backdrop-blur-3xl dark:border-white/[0.08] dark:bg-white/[0.045] sm:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
            Votre avis
          </p>
          <p className="mt-2 text-[17px] font-medium tracking-[-0.02em]">
            Qu’avez-vous pensé de ce film ?
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-2xl gap-2 sm:grid-cols-3">
          {options.map((option) => {
            const selected = rating === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRating(option.value)}
                className={`flex min-h-[76px] flex-col items-center justify-center rounded-[20px] border px-4 text-center transition-all duration-200 ${
                  selected
                    ? "border-black/[0.12] bg-black/[0.07] shadow-[0_8px_30px_rgba(0,0,0,0.07)] dark:border-white/[0.16] dark:bg-white/[0.1]"
                    : "border-black/[0.05] bg-white/[0.3] hover:bg-white/[0.65] dark:border-white/[0.06] dark:bg-white/[0.025] dark:hover:bg-white/[0.07]"
                }`}
              >
                <span
                  className={`text-[20px] ${
                    selected
                      ? "text-black dark:text-white"
                      : "text-black/35 dark:text-white/35"
                  }`}
                >
                  {option.symbol}
                </span>
                <span
                  className={`mt-1 text-[13px] font-medium ${
                    selected
                      ? "text-black dark:text-white"
                      : "text-black/55 dark:text-white/55"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}