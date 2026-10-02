import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/layout/Hero";
import { HomeContent } from "@/components/layout/HomeContent";
import {
  getHeroCollageMovies,
  getHomeTrendingMovies,
} from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: { user } },
    collageMovies,
    trending,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getHeroCollageMovies(),
    getHomeTrendingMovies(),
  ]);

  let displayName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    displayName =
      profile?.username ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Utilisateur";
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero collageMovies={collageMovies} displayName={displayName} />
        <HomeContent trending={trending} />
      </main>
      <Footer />
    </>
  );
}