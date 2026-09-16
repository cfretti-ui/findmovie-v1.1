import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { HomeContent } from "@/components/layout/HomeContent";
import {
  getHeroCollageMovies,
  getHomeTrendingMovies,
} from "@/lib/catalog";

export default async function HomePage() {
  const [collageMovies, trending] = await Promise.all([
    getHeroCollageMovies(),
    getHomeTrendingMovies(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero collageMovies={collageMovies} />
        <HomeContent trending={trending} />
      </main>
      <Footer />
    </>
  );
}
