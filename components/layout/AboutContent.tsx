"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp, motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function AboutContent() {
  const { t } = useLocale();

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: motionEase }}
      >
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted uppercase">
          {t("about.eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
          FindMovie
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {t("about.intro")}
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="mt-10 space-y-5">
        <GlassCard hover={false}>
          <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
            {t("about.card1Title")}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {t("about.card1Body")}
          </p>
        </GlassCard>
        <GlassCard hover={false}>
          <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
            {t("about.card2Title")}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {t("about.card2Body")}
          </p>
        </GlassCard>
      </motion.div>

      <div className="mt-10">
        <Button href="/questionnaire" size="lg">
          {t("about.findMovie")}
        </Button>
      </div>
    </section>
  );
}
