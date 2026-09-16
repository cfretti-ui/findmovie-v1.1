import type { QuestionDefinition } from "@/types/questionnaire";

/**
 * V1.3 is intentionally shorter. Questions are ordered by information value:
 * mood/genres first, then practical constraints. Lower-value preferences are optional.
 */
export const QUESTIONS: QuestionDefinition[] = [
  { id: "mood", title: "What are you in the mood for?", required: true, skippable: false, multiple: false, options: [
    { value: "Laugh", label: "Laugh" }, { value: "Think", label: "Think" }, { value: "Cry", label: "Cry" },
    { value: "Feel inspired", label: "Feel inspired" }, { value: "Adventure", label: "Adventure" }, { value: "Be scared", label: "Be scared" },
  ] },
  { id: "genres", title: "Any genres calling you?", description: "Optional — pick one or more.", required: false, skippable: true, multiple: true, options: [
    { value: "Action", label: "Action" }, { value: "Adventure", label: "Adventure" }, { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" }, { value: "Sci-Fi", label: "Sci-Fi" }, { value: "Thriller", label: "Thriller" },
    { value: "Romance", label: "Romance" }, { value: "Horror", label: "Horror" }, { value: "Animation", label: "Animation" },
  ] },
  { id: "energy", title: "How should it feel?", required: false, skippable: true, multiple: false, options: [
    { value: "Slow & atmospheric", label: "Slow & atmospheric" }, { value: "Balanced", label: "Balanced" }, { value: "Fast & intense", label: "Fast & intense" },
  ] },
  { id: "duration", title: "How much time do you have?", required: false, skippable: true, multiple: false, options: [
    { value: "Under 90 minutes", label: "Under 90 minutes" }, { value: "Under 2 hours", label: "Under 2 hours" }, { value: "No preference", label: "No preference" },
  ] },
  { id: "streamingServices", title: "Where can you watch?", description: "Optional — select every service you use.", required: false, skippable: true, multiple: true, options: [
    { value: "Netflix", label: "Netflix" }, { value: "Prime Video", label: "Prime Video" }, { value: "Disney+", label: "Disney+" },
    { value: "Apple TV+", label: "Apple TV+" }, { value: "Max", label: "Max" }, { value: "Canal+", label: "Canal+" },
  ] },
  { id: "discovery", title: "What kind of discovery?", required: false, skippable: true, multiple: false, options: [
    { value: "Something iconic", label: "Something iconic" }, { value: "A hidden gem", label: "A hidden gem" }, { value: "Surprise me", label: "Surprise me" },
  ] },
  { id: "maxAge", title: "Any age limit?", required: false, skippable: true, multiple: false, options: [
    { value: "all", label: "All audiences" }, { value: "10", label: "10+" }, { value: "12", label: "12+" }, { value: "16", label: "16+" }, { value: "18", label: "18+" },
  ] },
];
