"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const links = [{ href: "/about", label: t("nav.about") }, { href: "/#premium", label: t("nav.premium"), soon: true }];

  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: motionEase }} className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="glass-surface mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-[20px] px-3 sm:h-16 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" aria-label="Open menu" className="fm-focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-black/5 dark:hover:bg-white/5">☰</button>
          <Link href="/" className="hidden text-[16px] font-semibold tracking-[-.03em] sm:block">FindMovie</Link>
        </div>

        <div className="mx-3 flex min-w-0 flex-1 justify-center sm:mx-8">
          <div className="flex h-10 w-full max-w-md items-center rounded-xl border border-black/[.06] bg-black/[.035] px-3 text-[14px] text-muted backdrop-blur-xl dark:border-white/[.07] dark:bg-white/[.05]">
            <span className="mr-2 text-sm">⌕</span>
            <span className="truncate">{t("search.placeholder")}</span>
            <span className="ml-auto hidden rounded-md border border-black/10 px-1.5 py-0.5 text-[10px] text-muted sm:block dark:border-white/10">⌘ K</span>
          </div>
        </div>

        <nav className="flex items-center gap-1" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-disabled={link.soon || undefined} className={`hidden rounded-xl px-3 py-2 text-[13px] font-medium transition-colors sm:block ${pathname === link.href ? "text-foreground" : "text-muted hover:text-foreground"} ${link.soon ? "opacity-60" : ""}`}>
              {link.label}{link.soon ? <span className="ml-1 text-[10px]">{t("nav.soon")}</span> : null}
            </Link>
          ))}
          <Link href="/questionnaire" aria-label="Profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] bg-white/55 text-sm shadow-sm dark:border-white/10 dark:bg-white/10">◯</Link>
        </nav>
      </div>
    </motion.header>
  );
}
