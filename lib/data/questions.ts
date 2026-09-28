import type { QuestionDefinition } from "@/types/questionnaire";
export const QUESTIONS: QuestionDefinition[] = [
  {
    id: "mood",
    title: "Ce soir, on part sur quoi ?",
    required: true,
    skippable: false,
    multiple: false,
    options: [
      { value: "Laugh", label: "Me faire rire" },
      { value: "Think", label: "Me faire réfléchir" },
      { value: "Cry", label: "Me toucher" },
      { value: "Be scared", label: "Me faire frissonner" },
      { value: "Adventure", label: "M’embarquer" },
      { value: "Feel inspired", label: "M’inspirer" },
    ],
  },
  {
    id: "genres",
    title: "Tu veux quel genre d’histoire ?",
    description: "Choisis ce qui te tente.",
    required: false,
    skippable: true,
    multiple: true,
    options: [
      { value: "Action", label: "Action" },
      { value: "Adventure", label: "Aventure" },
      { value: "Comedy", label: "Comédie" },
      { value: "Drama", label: "Drame" },
      { value: "Sci-Fi", label: "Science-fiction" },
      { value: "Thriller", label: "Thriller" },
      { value: "Romance", label: "Romance" },
      { value: "Horror", label: "Horreur" },
      { value: "Animation", label: "Animation" },
    ],
  },
  {
    id: "energy",
    title: "Plutôt…",
    required: false,
    skippable: true,
    multiple: false,
    options: [
      {
        value: "Slow & atmospheric",
        label: "Tranquille",
        description: "Une ambiance qui prend son temps",
      },
      {
        value: "Balanced",
        label: "Équilibré",
        description: "Un peu de tout",
      },
      {
        value: "Fast & intense",
        label: "Ça bouge",
        description: "Du rythme, de l’intensité",
      },
    ],
  },
  {
    id: "duration",
    title: "Combien de temps on a ?",
    required: false,
    skippable: true,
    multiple: false,
    options: [
      { value: "Under 90 minutes", label: "90 min max" },
      { value: "Under 2 hours", label: "Environ 2 h" },
      { value: "Under 2 hours 30", label: "Jusqu’à 2 h 30" },
      { value: "No preference", label: "Peu importe" },
    ],
  },
  {
    id: "discovery",
    title: "On tente quoi ?",
    required: false,
    skippable: true,
    multiple: false,
    options: [
      {
        value: "Something iconic",
        label: "Un incontournable",
        description: "Un film que tout le monde connaît",
      },
      {
        value: "A hidden gem",
        label: "Une pépite",
        description: "Un film moins connu qui mérite d’être découvert",
      },
      {
        value: "Surprise me",
        label: "Surprends-moi",
        description: "Trouve quelque chose auquel je n’aurais pas pensé",
      },
    ],
  },
];