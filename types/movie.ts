export type StreamingService =
  | "Netflix"
  | "Prime Video"
  | "Disney+"
  | "Apple TV+"
  | "Max"
  | "Canal+";

export type MovieEnergy = "Slow & atmospheric" | "Balanced" | "Fast & intense";
export type MovieIntensity = "Family-friendly" | "Mild" | "Mature";
export type MovieLanguage = "English" | "French" | "Other";

export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  genres: string[];
  imdbRating: number;
  synopsis: string;
  posterPath: string;
  backdropPath: string;
  streamingServices: StreamingService[];
  moods: string[];
  tags: string[];
  /** Used by the 10-question matcher */
  energy: MovieEnergy;
  intensity: MovieIntensity;
  language: MovieLanguage;
  iconic: boolean;
  originalTitle?: string;
  voteCount?: number;
  adult?: boolean;
  /** 0 = all audiences, otherwise 10/12/16/18. null/undefined = unknown. */
  ageRating?: number | null;
  ageBadge?: "all" | "10" | "12" | "16" | "18" | null;
  certificationSource?: "FR" | "US" | "other" | "unknown";
  director?: string | null;
  cast?: string[];
  genreIds?: number[];
}
