"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/locale-context";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(t("auth.loginError"));
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-[#f7f7f5] px-5 py-24 text-black dark:bg-[#050505] dark:text-white sm:px-8">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center justify-center">
          <div className="w-full rounded-[32px] border border-black/10 bg-white/70 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] sm:p-10">
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/45 dark:text-white/45">
                FindMovie
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                {t("auth.signIn")}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  {t("auth.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-[15px] outline-none transition focus:border-black/30 focus:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  {t("auth.password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-black/10 bg-black/[0.03] px-4 text-[15px] outline-none transition focus:border-black/30 focus:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                />
              </div>

              {error && (
                <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-full bg-black text-sm font-medium text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {loading ? t("auth.loading") : t("auth.signIn")}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-black/55 dark:text-white/55">
              {t("auth.noAccount")}{" "}
              <Link
                href="/signup"
                className="font-medium text-black underline underline-offset-4 dark:text-white"
              >
                {t("auth.signUpHere")}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}