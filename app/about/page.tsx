import type { Metadata } from "next";
import { AboutContent } from "@/components/layout/AboutContent";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About · FindMovie",
  description:
    "FindMovie helps you stop browsing and start watching — matched to mood and streaming.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
