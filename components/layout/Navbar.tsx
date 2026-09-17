"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { motionEase } from "@/lib/motion";
import { useLocale } from "@/lib/i18n/locale-context";
import { getPosterUrl } from "@/lib/tmdb-images";
import type { Movie } from "@/types/movie";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLocale();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as {
          movies?: Movie[];
        };

        setResults(data.movies ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const showResults =
    focused && query.trim().length > 0;

  const links = [
    {
      href: "/about",
      label: t("nav.about"),
    },
    {
      href: "/#premium",
      label: t("nav.premium"),
      soon: true,
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: motionEase,
      }}
      className="sticky top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div className="glass-surface relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-[20px] px-3 sm:h-16 sm:px-4">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Open menu"
            className="fm-focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="text-lg leading-none">☰</span>
          </button>

          <Link
            href="/"
            className="hidden text-[16px] font-semibold tracking-[-0.03em] text-foreground sm:block"
          >
            FindMovie
          </Link>
        </div>

        {/* SEARCH */}
        <div className="relative mx-3 flex min-w-0 flex-1 justify-center sm:mx-8">
          <div className="relative w-full max-w-md">
            <div
              className={`flex h-10 items-center rounded-xl border px-3 transition-all ${
                focused
                  ? "border-black/15 bg-black/[0.055] shadow-sm dark:border-white/15 dark:bg-white/[0.075]"
                  : "border-black/[0.06] bg-black/[0.035] dark:border-white/[0.07] dark:bg-white/[0.05]"
              }`}
            >
              <span className="mr-2 shrink-0 text-base text-muted">
                ⌕
              </span>

              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setFocused(false), 150);
                }}
                placeholder={t("search.placeholder")}
                aria-label={t("search.placeholder")}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted"
              />

              {loading ? (
                <div className="ml-2 h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-black/15 border-t-black dark:border-white/15 dark:border-t-white" />
              ) : (
                <kbd className="ml-2 hidden shrink-0 rounded-md border border-black/10 px-1.5 py-0.5 text-[10px] text-muted sm:block dark:border-white/10">
                  ⌘ K
                </kbd>
              )}
            </div>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-black/[0.08] bg-white/90 p-1.5 shadow-2xl backdrop-blur-2xl dark:border-white/[0.1] dark:bg-[#171719]/95"
                >
                  {results.length > 0 ? (
                    <div className="max-h-[420px] overflow-y-auto">
                      {results.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movie/${movie.id}`}
                          onClick={() => {
                            setQuery("");
                            setFocused(false);
                          }}
                          className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.07]"
                        >
                          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-black/10 dark:bg-white/10">
                            {movie.posterPath ? (
                              <Image
                                src={getPosterUrl(movie.posterPath)}
                                alt=""
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {movie.title}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-muted">
                              {movie.year > 0 ? movie.year : ""}
                              {movie.year > 0 && movie.imdbRating > 0
                                ? " · "
                                : ""}
                              {movie.imdbRating > 0
                                ? `★ ${movie.imdbRating.toFixed(1)}`
                                : ""}
                            </p>
                          </div>

                          <span className="mr-1 text-muted opacity-0 transition-opacity group-hover:opacity-100">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : loading ? (
                    <div className="px-4 py-5 text-center text-sm text-muted">
                      Searching…
                    </div>
                  ) : (
                    <div className="px-4 py-5 text-center text-sm text-muted">
                      No movies found.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT */}
        <nav
          className="flex items-center gap-1"
          aria-label="Primary"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-disabled={link.soon || undefined}
              className={`hidden rounded-xl px-3 py-2 text-[13px] font-medium transition-colors sm:block ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              } ${link.soon ? "opacity-60" : ""}`}
            >
              {link.label}

              {link.soon ? (
                <span className="ml-1 text-[10px]">
                  {t("nav.soon")}
                </span>
              ) : null}
            </Link>
          ))}

          <Link
            href="/questionnaire"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] bg-white/55 text-sm text-foreground shadow-sm transition-colors hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
          >
            ◯
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}