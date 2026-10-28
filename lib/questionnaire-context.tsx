"use client";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  USER_PREFERENCES_COLUMNS,
  answersToUserPreferences,
  userPreferencesToAnswers,
  type UserPreferencesRecord,
} from "@/lib/user-preferences";
import {
  initialQuestionnaireAnswers,
  type MultiQuestionId,
  type QuestionnaireAnswers,
  type QuestionId,
} from "@/types/questionnaire";

const STORAGE_KEY = "findmovie.questionnaire.v4";
const EXCLUDED_KEY = "findmovie.excludedMovies";

interface QuestionnaireContextValue {
  answers: QuestionnaireAnswers;
  excludedMovieIds: number[];
  setAnswer: (id: QuestionId, value: string) => void;
  toggleMultiAnswer: (id: MultiQuestionId, value: string) => void;
  isComplete: boolean;
  reset: () => void;
  excludeMovie: (id: number) => void;
  clearExcluded: () => void;
  persistPreferences: () => Promise<void>;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(
  null,
);
const MULTI_IDS: MultiQuestionId[] = ["streamingServices", "genres"];

function readStoredAnswers(): QuestionnaireAnswers {
  if (typeof window === "undefined") return initialQuestionnaireAnswers;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialQuestionnaireAnswers;
    return { ...initialQuestionnaireAnswers, ...JSON.parse(raw) };
  } catch {
    return initialQuestionnaireAnswers;
  }
}

function readExcluded(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(EXCLUDED_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(
    initialQuestionnaireAnswers,
  );
  const [excludedMovieIds, setExcludedMovieIds] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadAccountPreferences(nextUserId: string) {
      const { data } = await supabase
        .from("user_preferences")
        .select(USER_PREFERENCES_COLUMNS)
        .eq("user_id", nextUserId)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setAnswers(userPreferencesToAnswers(data as UserPreferencesRecord));
      } else {
        setAnswers(readStoredAnswers());
      }
    }

    async function hydrate() {
      setExcludedMovieIds(readExcluded());

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) {
        setUserId(null);
        setAnswers(readStoredAnswers());
        setHydrated(true);
        return;
      }

      setUserId(user.id);
      try {
        await loadAccountPreferences(user.id);
      } catch {
        if (!cancelled) setAnswers(readStoredAnswers());
      }
      if (!cancelled) setHydrated(true);
    }

    void hydrate();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      const nextUser = session?.user ?? null;
      setUserId(nextUser?.id ?? null);
      if (nextUser) {
        void loadAccountPreferences(nextUser.id).catch(() => {
          /* keep in-memory answers */
        });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hydrated || userId) return;
    if (pathname !== "/questionnaire") return;
    setAnswers(initialQuestionnaireAnswers);
    sessionStorage.removeItem(STORAGE_KEY);
  }, [hydrated, pathname, userId]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(EXCLUDED_KEY, JSON.stringify(excludedMovieIds));
  }, [excludedMovieIds, hydrated]);

  const setAnswer = useCallback((id: QuestionId, value: string) => {
    if (MULTI_IDS.includes(id as MultiQuestionId)) return;
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const toggleMultiAnswer = useCallback(
    (id: MultiQuestionId, value: string) => {
      setAnswers((prev) => {
        const current = prev[id] as string[];
        const exists = current.includes(value);
        return {
          ...prev,
          [id]: exists
            ? current.filter((item) => item !== value)
            : [...current, value],
        };
      });
    },
    [],
  );

  const persistPreferences = useCallback(async () => {
    const snapshot = answersRef.current;
    if (!snapshot.mood) return;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("user_preferences")
        .select(USER_PREFERENCES_COLUMNS)
        .eq("user_id", user.id)
        .maybeSingle();

      const payload = answersToUserPreferences(
        snapshot,
        user.id,
        (existing as UserPreferencesRecord | null) ?? null,
      );

      await supabase.from("user_preferences").upsert(payload, {
        onConflict: "user_id",
      });
    } catch {
      /* Persistence must never block recommendations. */
    }
  }, []);

  const reset = useCallback(() => {
    setAnswers(initialQuestionnaireAnswers);
    setExcludedMovieIds([]);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(EXCLUDED_KEY);
  }, []);

  const excludeMovie = useCallback((id: number) => {
    setExcludedMovieIds((prev) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  }, []);

  const clearExcluded = useCallback(() => {
    setExcludedMovieIds([]);
  }, []);

  const isComplete = useMemo(() => {
    return answers.mood !== null;
  }, [answers.mood]);

  const value = useMemo(
    () => ({
      answers,
      excludedMovieIds,
      setAnswer,
      toggleMultiAnswer,
      isComplete,
      reset,
      excludeMovie,
      clearExcluded,
      persistPreferences,
    }),
    [
      answers,
      excludedMovieIds,
      setAnswer,
      toggleMultiAnswer,
      isComplete,
      reset,
      excludeMovie,
      clearExcluded,
      persistPreferences,
    ],
  );

  return (
    <QuestionnaireContext.Provider value={value}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error(
      "useQuestionnaire must be used within QuestionnaireProvider",
    );
  }
  return context;
}
