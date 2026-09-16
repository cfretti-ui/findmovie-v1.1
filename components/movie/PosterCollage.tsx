"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/tmdb-images";
import { motionEase } from "@/lib/motion";

interface PosterCollageProps {
  movies: Movie[];
}

export function PosterCollage({ movies }: PosterCollageProps) {
  const posters = [...movies, ...movies].slice(0, 12);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute inset-[-8%] grid grid-cols-4 gap-4 opacity-[0.15] blur-[18px] sm:grid-cols-6 sm:gap-5"
        animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
        transition={{
          duration: 28,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {posters.map((movie, index) => (
          <motion.div
            key={`${movie.id}-${index}`}
            className="relative aspect-[2/3] overflow-hidden rounded-2xl"
            style={{
              rotate: index % 2 === 0 ? -4 : 5,
              translateY: (index % 3) * 18,
            }}
            transition={{ duration: 0.4, ease: motionEase }}
          >
            <Image
              src={getPosterUrl(movie.posterPath, "w342")}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
              priority={index < 6}
            />
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/75 to-background" />
    </div>
  );
}
