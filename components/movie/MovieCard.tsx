"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import type { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/tmdb-images";
import { motionEase } from "@/lib/motion";

export function MovieCard({
  movie,
  priority = false,
}: {
  movie: Movie;
  priority?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -7 }}
      whileTap={{ scale: 0.985 }}
      transition={{
        duration: 0.28,
        ease: motionEase,
      }}
      className="group w-[154px] shrink-0 sm:w-[178px]"
    >
      <Link
        href={`/movie/${movie.id}`}
        aria-label={`View ${movie.title}`}
        className="block outline-none"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-[24px] bg-black/10 shadow-card ring-1 ring-black/[.05] transition-shadow duration-300 group-hover:shadow-2xl group-focus-visible:ring-2 group-focus-visible:ring-foreground dark:ring-white/[.08]">
          {movie.posterPath ? (
            <Image
              src={getPosterUrl(movie.posterPath)}
              alt={`${movie.title} poster`}
              fill
              sizes="(max-width: 640px) 154px, 178px"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 p-4 text-center text-xs text-muted dark:bg-white/5">
              {movie.title}
            </div>
          )}

          <div className="absolute inset-x-2 bottom-2 translate-y-2 rounded-2xl border border-white/20 bg-black/35 p-2.5 text-left opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="truncate text-xs font-semibold text-white">
              {movie.title}
            </p>

            <p className="mt-0.5 text-[11px] text-white/70">
              {movie.year}
              {movie.imdbRating > 0
                ? ` · ★ ${movie.imdbRating.toFixed(1)}`
                : ""}
            </p>
          </div>
        </div>

        <h3 className="mt-3 truncate text-[14px] font-semibold tracking-[-.02em] text-foreground">
          {movie.title}
        </h3>

        <p className="mt-0.5 text-[12px] text-muted">
          {movie.year}
          {movie.runtime > 0
            ? ` · ${movie.runtime} min`
            : ""}
        </p>
      </Link>
    </motion.article>
  );
}