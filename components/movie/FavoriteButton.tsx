"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function FavoriteButton({ movieId }: { movieId: number }) {

  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadFavorite() {

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;

      }

      const { data } = await supabase

        .from("favorites")

        .select("movie_id")

        .eq("user_id", user.id)

        .eq("movie_id", movieId)

        .maybeSingle();

      setIsFavorite(!!data);

      setLoading(false);

    }

    loadFavorite();

  }, [movieId]);

  async function toggleFavorite() {

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;

    }

    setLoading(true);

    if (isFavorite) {

      await supabase

        .from("favorites")

        .delete()

        .eq("user_id", user.id)

        .eq("movie_id", movieId);

      setIsFavorite(false);

    } else {

      await supabase

        .from("favorites")

        .insert({

          user_id: user.id,

          movie_id: movieId,

        });

      setIsFavorite(true);

    }

    setLoading(false);

  }

  return (

    <button

      type="button"

      onClick={toggleFavorite}

      disabled={loading}

      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}

      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border backdrop-blur-2xl transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${

        isFavorite

          ? "border-black/[0.1] bg-black/[0.07] text-black shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:border-white/[0.14] dark:bg-white/[0.1] dark:text-white"

          : "border-black/[0.06] bg-white/50 text-black/45 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:bg-white/75 dark:border-white/[0.08] dark:bg-white/[0.055] dark:text-white/55 dark:hover:bg-white/[0.09]"

      }`}

    >

      <span className="text-[22px] leading-none">

        {isFavorite ? "♥" : "♡"}

      </span>

    </button>

  );

}