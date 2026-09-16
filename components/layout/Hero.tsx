"use client";

import { motion } from "framer-motion";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/Button";
import { PosterCollage } from "@/components/movie/PosterCollage";
import { motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function Hero({ collageMovies }: { collageMovies: Movie[] }) {
  const { t } = useLocale();
  return (
    <section className="relative isolate overflow-hidden">
      <PosterCollage movies={collageMovies} />
      <div className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-7xl flex-col items-center justify-center px-5 pb-20 pt-20 text-center sm:min-h-[84vh] sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .55, ease: motionEase }} className="glass-surface max-w-4xl rounded-[36px] px-6 py-10 sm:px-12 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-muted">A smarter way to choose</p>
          <h1 className="mt-5 text-6xl font-semibold tracking-[-.065em] sm:text-7xl lg:text-8xl">FindMovie</h1>
          <p className="mx-auto mt-5 max-w-2xl text-xl font-medium tracking-[-.035em] text-foreground/85 sm:text-2xl">{t("hero.subtitle")}</p>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted sm:text-base">{t("hero.description")}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/questionnaire" size="lg">{t("hero.findMovie")} <span className="ml-2">→</span></Button>
            <Button href="#how-it-works" variant="glass" size="lg">{t("hero.howItWorks")}</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
