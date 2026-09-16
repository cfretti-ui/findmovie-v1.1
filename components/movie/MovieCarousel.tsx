"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import { MovieCard } from "@/components/movie/MovieCard";
import { motionEase } from "@/lib/motion";

interface MovieCarouselProps {
  movies: Movie[];
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: number) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <CarouselButton label="Scroll left" onClick={() => scrollBy(-1)}>
          ←
        </CarouselButton>
        <CarouselButton label="Scroll right" onClick={() => scrollBy(1)}>
          →
        </CarouselButton>
      </div>

      <motion.div
        ref={scrollerRef}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: motionEase }}
        className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 pt-1 [scrollbar-width:none] sm:-mx-8 sm:gap-5 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} priority={index < 3} />
        ))}
      </motion.div>
    </div>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-glass text-sm text-foreground shadow-soft backdrop-blur-[28px] transition-colors duration-300 hover:bg-white"
    >
      {children}
    </motion.button>
  );
}
