import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecommendationView } from "@/components/movie/RecommendationView";

export const metadata = {
  title: "Your recommendation · FindMovie",
  description: "A movie matched to your mood and streaming services.",
};

export default function RecommendationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <RecommendationView />
      </main>
      <Footer />
    </>
  );
}
