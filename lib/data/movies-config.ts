import type { StreamingService } from "@/types/movie";

/** Titles used for the Trending Tonight carousel when TMDb is unavailable. */
export const TRENDING_TITLES = [
  "Interstellar",
  "Dune",
  "Oppenheimer",
  "The Dark Knight",
  "Whiplash",
  "The Prestige",
] as const;

export const ALL_STREAMING_SERVICES: StreamingService[] = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Apple TV+",
  "Max",
  "Canal+",
];
