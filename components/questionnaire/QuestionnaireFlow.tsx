"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { QUESTIONS } from "@/lib/data/questions";
import { useQuestionnaire } from "@/lib/questionnaire-context";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { slideQuestion, motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MultiQuestionId, QuestionId } from "@/types/questionnaire";

const MULTI_IDS: MultiQuestionId[] = ["streamingServices", "genres"];

export function QuestionnaireFlow() {
  const router = useRouter();
  const { t, dictionary } = useLocale();
  const { answers, setAnswer, toggleMultiAnswer, isComplete } = useQuestionnaire();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const question = QUESTIONS[step];

  const selectedValues = useMemo(() => {
    if (MULTI_IDS.includes(question.id as MultiQuestionId)) return answers[question.id as MultiQuestionId] as string[];
    const value = answers[question.id as Exclude<QuestionId, MultiQuestionId>];
    return value ? [String(value)] : [];
  }, [answers, question.id]);

  const canContinue = selectedValues.length > 0 || Boolean(question.skippable);
  const finish = useCallback(() => router.push("/recommendation"), [router]);

  const goNext = useCallback(() => {
    if (!canContinue) return;
    if (step === QUESTIONS.length - 1) return finish();
    setDirection(1);
    setStep((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canContinue, finish, step]);

  const skip = useCallback(() => {
    if (!question.skippable) return;
    if (step === QUESTIONS.length - 1) return finish();
    setDirection(1);
    setStep((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [finish, question.skippable, step]);

  const goBack = useCallback(() => {
    if (step === 0) return router.push("/");
    setDirection(-1);
    setStep((value) => value - 1);
  }, [router, step]);

  const handleSelect = (value: string) => {
    if (MULTI_IDS.includes(question.id as MultiQuestionId)) {
      toggleMultiAnswer(question.id as MultiQuestionId, value);
      return;
    }
    setAnswer(question.id, value);
    // Single-choice questions advance immediately: fewer clicks, less friction.
    if (step < QUESTIONS.length - 1) {
      window.setTimeout(() => {
        setDirection(1);
        setStep((value) => value + 1);
      }, 180);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && canContinue) { event.preventDefault(); goNext(); }
      if (event.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canContinue, goBack, goNext]);

  const title = t(`questions.${question.id}.title`);
  const description = question.id === "genres" || question.id === "streamingServices" ? t(`questions.${question.id}.description`) : undefined;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-2xl flex-col px-5 py-8 sm:px-8 sm:py-12">
      <ProgressBar current={step + 1} total={QUESTIONS.length} />
      <div className="mt-8 flex items-center justify-between text-[12px] text-muted"><span>FindMovie</span><span>{question.skippable ? "Optional" : "Essential"}</span></div>
      <div className="relative mt-7 flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={question.id} custom={direction} {...slideQuestion(direction)}>
            <h1 className="max-w-xl text-4xl font-semibold tracking-[-.055em] sm:text-5xl">{title}</h1>
            {description ? <p className="mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base">{description}</p> : null}
            <div className={`mt-8 grid gap-3 ${question.options.length >= 6 ? "sm:grid-cols-2" : ""}`} role={question.multiple ? "group" : "radiogroup"} aria-label={title}>
              {question.options.map((option) => <QuestionCard key={option.value} label={dictionary.options[option.value] ?? option.label} selected={selectedValues.includes(option.value)} multiple={question.multiple} onSelect={() => handleSelect(option.value)} />)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3, ease: motionEase }} className="mt-8 flex items-center justify-between border-t border-black/[.07] pt-5 dark:border-white/[.08]">
        <Button type="button" variant="ghost" onClick={goBack}>{t("questionnaire.previous")}</Button>
        <div className="flex items-center gap-2">
          {question.skippable ? <Button type="button" variant="ghost" onClick={skip}>Skip</Button> : null}
          <Button type="button" onClick={goNext} disabled={!canContinue}>{step === QUESTIONS.length - 1 ? (isComplete ? t("questionnaire.seeRecommendation") : "Finish") : t("questionnaire.next")}</Button>
        </div>
      </motion.div>
    </div>
  );
}
