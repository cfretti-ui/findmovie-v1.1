import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MovieDetailView } from "@/components/movie/MovieDetailView";

import { getMoviePageData } from "@/lib/catalog";
import { getRequestLocale } from "@/lib/i18n/server-locale";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;

  const locale = await getRequestLocale();
  const movie = await getMoviePageData(Number(id), locale);

  if (!movie) {
    return { title: "FindMovie" };
  }

  return {
    title: `${movie.title} · FindMovie`,
    description: movie.synopsis || undefined,
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  const movieId = Number(id);

  if (!Number.isFinite(movieId) || movieId <= 0) {
    notFound();
  }

  const locale = await getRequestLocale();
  const movie = await getMoviePageData(movieId, locale);

  if (!movie) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <MovieDetailView movie={movie} />
      </main>

      <Footer />
    </>
  );
}
