"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useLocale } from "@/lib/i18n/locale-context";

export function Footer() {
  const { t } = useLocale();

  return (
    <motion.footer
      {...fadeUp}
      className="mt-auto border-t border-border/80 bg-background"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
              FindMovie
            </p>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-muted">
            <Link
              href="/about"
              className="transition-colors hover:text-foreground"
            >
              {t("footer.about")}
            </Link>
            <Link
              href="/questionnaire"
              className="transition-colors hover:text-foreground"
            >
              {t("footer.findMovie")}
            </Link>
            <span className="text-border">·</span>
            <span>© {new Date().getFullYear()} - by Clément Fretti</span>
          </div>
        </div>

        <div className="border-t border-border/70 pt-8">
          <LanguageSwitcher />
        </div>
      </div>
    </motion.footer>
  );
}
