import type { StreamingService } from "@/types/movie";
import type { MovieGenreOption } from "@/types/questionnaire";

/** TMDb genre IDs used by discover filters. */
export const GENRE_IDS: Record<MovieGenreOption, number> = {
  Action: 28,
  Adventure: 12,
  Comedy: 35,
  Drama: 18,
  "Sci-Fi": 878,
  Thriller: 53,
  Romance: 10749,
  Horror: 27,
  Animation: 16,
};

export const GENRE_ID_TO_OPTION: Record<number, MovieGenreOption> = {
  28: "Action",
  12: "Adventure",
  35: "Comedy",
  18: "Drama",
  878: "Sci-Fi",
  53: "Thriller",
  10749: "Romance",
  27: "Horror",
  16: "Animation",
};

export const GENRE_ID_TO_NAME: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

/** TMDb watch provider IDs (US region). */
export const PROVIDER_IDS: Record<StreamingService, number> = {
  Netflix: 8,
  "Prime Video": 9,
  "Disney+": 337,
  "Apple TV+": 350,
  Max: 1899,
  "Canal+": 381,
};

/** Reverse map from TMDb provider name fragments to our services. */
export const PROVIDER_NAME_MAP: Record<string, StreamingService> = {
  Netflix: "Netflix",
  "Amazon Prime Video": "Prime Video",
  "Prime Video": "Prime Video",
  "Disney Plus": "Disney+",
  "Disney+": "Disney+",
  "Apple TV Plus": "Apple TV+",
  "Apple TV+": "Apple TV+",
  Max: "Max",
  "HBO Max": "Max",
  "Canal+": "Canal+",
};
