"use client";

import { LOCALES } from "@/lib/i18n/locales";
import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-medium tracking-[0.06em] text-muted uppercase">
        {t("footer.language")}
      </p>
      <div
        role="group"
        aria-label={t("footer.language")}
        className="inline-flex rounded-2xl border border-border bg-glass p-1 shadow-soft backdrop-blur-[28px]"
      >
        {LOCALES.map((item) => {
          const active = item.code === locale;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLocale(item.code)}
              aria-pressed={active}
              className={`min-w-[4.5rem] rounded-xl px-3 py-2 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                active
                  ? "bg-accent text-white shadow-soft"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.nativeLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
