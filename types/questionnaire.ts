import type { StreamingService } from "./movie";

export type WatchingWith = "Alone" | "Partner" | "Friends" | "Family";

export type Mood =
  | "Laugh"
  | "Think"
  | "Cry"
  | "Feel inspired"
  | "Adventure"
  | "Be scared";

export type Duration = "Under 90 minutes" | "Under 2 hours" | "No preference";

export type ReleasePeriod = "Recent" | "2000+" | "Classics" | "No preference";

export type Energy = "Slow & atmospheric" | "Balanced" | "Fast & intense";

export type Intensity = "Family-friendly" | "Mild" | "Mature";

export type LanguagePreference =
  | "Any language"
  | "English"
  | "French"
  | "No preference";

export type DiscoveryStyle =
  | "Something iconic"
  | "A hidden gem"
  | "Surprise me";

export type AgeMax = "all" | "10" | "12" | "16" | "18";

export type MovieGenreOption =
  | "Action"
  | "Adventure"
  | "Comedy"
  | "Drama"
  | "Sci-Fi"
  | "Thriller"
  | "Romance"
  | "Horror"
  | "Animation";

export type MultiQuestionId = "streamingServices" | "genres";

export interface QuestionnaireAnswers {
  watchingWith: WatchingWith | null;
  mood: Mood | null;
  genres: MovieGenreOption[];
  energy: Energy | null;
  duration: Duration | null;
  intensity: Intensity | null;
  language: LanguagePreference | null;
  streamingServices: StreamingService[];
  releasePeriod: ReleasePeriod | null;
  discovery: DiscoveryStyle | null;
  maxAge: AgeMax | null;
  allowAdult: boolean;
}

export const initialQuestionnaireAnswers: QuestionnaireAnswers = {
  watchingWith: null,
  mood: null,
  genres: [],
  energy: null,
  duration: null,
  intensity: null,
  language: null,
  streamingServices: [],
  releasePeriod: null,
  discovery: null,
  maxAge: null,
  allowAdult: false,
};

export type QuestionId =
  | "watchingWith"
  | "mood"
  | "genres"
  | "energy"
  | "duration"
  | "intensity"
  | "language"
  | "streamingServices"
  | "releasePeriod"
  | "discovery"
  | "maxAge"
  | "allowAdult";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionDefinition {
  id: QuestionId;
  title: string;
  description?: string;
  multiple: boolean;
  options: QuestionOption[];
  required?: boolean;
  skippable?: boolean;
}
