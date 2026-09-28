"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
type SimilarMovie = {
  id: number;
  title: string;
  originalTitle?: string;
  year: number;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  score: number;
  reasons: string[];
};
type SimilarMoviesProps = {
  movieId: number;
};
export function SimilarMovies({ movieId }: SimilarMoviesProps) {
  const { locale } = useLocale();
  const [movies, setMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    async function loadSimilarMovies() {
      try {
        setLoading(true);
        const response = await fetch(`/api/movie/${movieId}/similar?language=${locale}`);
        if (!response.ok) {
          throw new Error("Failed to fetch similar movies");
        }
        const data = await response.json();
        if (!cancelled) {
          setMovies(Array.isArray(data?.movies) ? data.movies : []);
        }
      } catch (error) {
        console.error("Similar movies error:", error);
        if (!cancelled) {
          setMovies([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadSimilarMovies();
    return () => {
      cancelled = true;
    };
  }, [movieId, locale]);
  if (loading) {
    return (
      <section className="mt-20">
        <div className="mb-8 h-8 w-56 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl">
              <div className="aspect-[2/3] animate-pulse rounded-2xl bg-black/5 dark:bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (!movies.length) return null;
  return (
    <section className="mt-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-black/45 dark:text-white/45">
            À découvrir
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-white sm:text-4xl">
            Dans le même univers
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/55">
            Des films sélectionnés pour leurs points communs avec celui-ci.
          </p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="group min-w-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/10">
              {movie.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="mt-3">
              <h3 className="line-clamp-2 text-sm font-medium leading-5 text-black dark:text-white">
                {movie.title}
              </h3>
              {movie.year > 0 ? (
                <p className="mt-1 text-xs text-black/45 dark:text-white/45">
                  {movie.year}
                </p>
              ) : null}
              {movie.reasons.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {movie.reasons.slice(0, 2).map((reason) => (
                    <p key={reason} className="text-[11px] leading-4 text-black/50 dark:text-white/50">
                      {reason}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}