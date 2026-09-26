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
import {
  initialQuestionnaireAnswers,
  type MultiQuestionId,
  type QuestionnaireAnswers,
  type QuestionId,
} from "@/types/questionnaire";

const STORAGE_KEY = "findmovie.questionnaire.v3";
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
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(
  null,
);

const MULTI_IDS: MultiQuestionId[] = ["streamingServices", "genres"];

function readStoredAnswers(): QuestionnaireAnswers {
  if (typeof window === "undefined") {
    return initialQuestionnaireAnswers;
  }

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

  useEffect(() => {
    if (pathname === "/questionnaire") {
      setAnswers(initialQuestionnaireAnswers);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      setAnswers(readStoredAnswers());
    }
    setExcludedMovieIds(readExcluded());
    setHydrated(true);
  }, [pathname]);

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

    setAnswers((prev) => {
      if (id === "allowAdult") {
        if (prev.watchingWith === "Family") {
          return { ...prev, allowAdult: false };
        }
        return { ...prev, allowAdult: value === "true" };
      }

      const next = {
        ...prev,
        [id]: value,
      };

      if (id === "watchingWith" && value === "Family") {
        next.allowAdult = false;
      }

      return next;
    });
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
    // V1.3 only requires a meaningful intent signal. Everything else is optional.
    // This lets users skip low-value questions without weakening the matcher.
    return answers.mood !== null || answers.genres.length > 0;
  }, [answers.mood, answers.genres]);

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
