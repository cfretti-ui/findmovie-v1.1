"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";
export function AboutContent() {
  const { t } = useLocale();
  const steps = [
    {
      number: "01",
      title: t("about.step1Title"),
      text: t("about.step1Body"),
    },
    {
      number: "02",
      title: t("about.step2Title"),
      text: t("about.step2Body"),
    },
    {
      number: "03",
      title: t("about.step3Title"),
      text: t("about.step3Body"),
    },
  ];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px] overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-black/[0.035] blur-3xl dark:bg-white/[0.045]" />
        <div className="absolute left-[8%] top-[280px] h-[260px] w-[260px] rounded-full bg-black/[0.025] blur-3xl dark:bg-white/[0.025]" />
        <div className="absolute right-[5%] top-[180px] h-[320px] w-[320px] rounded-full bg-black/[0.025] blur-3xl dark:bg-white/[0.025]" />
      </div>
      <section className="mx-auto w-full max-w-6xl px-5 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: motionEase }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
            {t("about.eyebrow")}
          </p>
          <h1 className="mt-6 text-6xl font-semibold tracking-[-0.065em] text-foreground sm:text-7xl lg:text-8xl">
            FindMovie
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">
            {t("about.intro")}
          </p>
          <div className="mt-9 flex justify-center">
            <Button href="/questionnaire" size="lg">
              {t("about.findMovie")}
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: motionEase }}
          className="mx-auto mt-28 max-w-5xl sm:mt-40"
        >
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
              {t("about.howEyebrow")}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">
              {t("about.howTitle")}
            </h2>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {t("about.howIntro")}
            </p>
          </div>
          <div className="mt-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: motionEase }}
                className="border-t border-black/[0.08] py-8 dark:border-white/[0.09] sm:py-10"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-12">
                  <span className="shrink-0 text-[12px] font-semibold tracking-[0.16em] text-muted sm:w-12">
                    {step.number}
                  </span>
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                      {step.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: motionEase }}
          className="mx-auto mt-32 max-w-5xl sm:mt-44"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-black/[0.08] bg-black/[0.025] p-7 dark:border-white/[0.09] dark:bg-white/[0.035] sm:rounded-[40px] sm:p-12">
            <div className="absolute right-[-100px] top-[-100px] h-[280px] w-[280px] rounded-full bg-black/[0.04] blur-3xl dark:bg-white/[0.06]" />
            <div className="relative max-w-3xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
                FindMovie Intelligence
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl">
                {t("about.intelligenceTitle")}
              </h2>
              <p className="mt-6 text-base leading-7 text-muted sm:text-lg sm:leading-8">
                {t("about.intelligenceBody")}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: motionEase }}
          className="mx-auto mt-24 w-full max-w-4xl px-2 text-center sm:mt-32"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted">
            FindMovie
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-foreground sm:text-5xl lg:text-6xl">
            {t("about.finalTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {t("about.finalBody")}
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/questionnaire" size="lg">
              {t("about.findMovie")}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}