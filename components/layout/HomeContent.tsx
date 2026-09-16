"use client";

import type { Movie } from "@/types/movie";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/locale-context";
import { motion } from "framer-motion";

export function HomeContent({ trending }: { trending: Movie[] }) {
  const { t } = useLocale();
  return (
    <div className="relative z-10">
      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
        <div className="flex items-end justify-between gap-5">
          <div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted">Explore</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">{t("home.trendingTitle")}</h2><p className="mt-2 text-sm text-muted sm:text-base">{t("home.trendingSubtitle")}</p></div>
          <Button href="/questionnaire" variant="glass" className="hidden sm:inline-flex">{t("hero.findMovie")} →</Button>
        </div>
        <div className="mt-7"><MovieCarousel movies={trending} /></div>
      </section>

      <section id="how-it-works" className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:grid-cols-3 sm:px-8 sm:py-16">
        {[t("home.step1"), t("home.step2"), t("home.step3")].map((step, i) => (
          <motion.div key={step} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: i * .06 }}>
            <GlassCard hover interactive className="h-full p-6 sm:p-7"><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-muted">0{i + 1}</p><h3 className="mt-10 text-xl font-semibold tracking-[-.03em]">{step}</h3><p className="mt-2 text-sm leading-6 text-muted">{i === 0 ? "Tell us what sounds right tonight." : i === 1 ? "FindMovie weighs the signals that actually matter." : "Get a focused result instead of another endless list."}</p></GlassCard>
          </motion.div>
        ))}
      </section>

      <section id="premium" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <GlassCard hover={false} className="overflow-hidden p-8 text-center sm:p-14">
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-muted">{t("home.premiumEyebrow")}</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-.055em] sm:text-5xl">{t("home.premiumTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">{t("home.premiumDescription")}</p>
        </GlassCard>
      </section>
    </div>
  );
}
