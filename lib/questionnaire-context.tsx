"use client";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  initialQuestionnaireAnswers,
  type MultiQuestionId,
  type QuestionnaireAnswers,
  type QuestionId,
} from "@/types/questionnaire";

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
  saveQuestionnaireHistory: (answers: QuestionnaireAnswers) => Promise<void>;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(
  null,
);
const MULTI_IDS: MultiQuestionId[] = ["streamingServices", "genres"];

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

  useEffect(() => {
    setExcludedMovieIds(readExcluded());
    setAnswers({ ...initialQuestionnaireAnswers });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || pathname !== "/questionnaire") return;
    setAnswers({ ...initialQuestionnaireAnswers });
  }, [hydrated, pathname]);

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

  const saveQuestionnaireHistory = useCallback(
    async (snapshot: QuestionnaireAnswers) => {
      if (!snapshot.mood) return;

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from("questionnaire_history").insert({
          user_id: user.id,
          mood: snapshot.mood,
          genres: snapshot.genres,
          energy: snapshot.energy,
          duration: snapshot.duration,
          discovery: snapshot.discovery,
          answers: snapshot,
        });

        if (error) {
          console.error("[questionnaire-history] Failed to save history:", error.message);
        }
      } catch (error) {
        console.error("[questionnaire-history] Failed to save history:", error);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setAnswers({ ...initialQuestionnaireAnswers });
    setExcludedMovieIds([]);
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
      saveQuestionnaireHistory,
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
      saveQuestionnaireHistory,
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
