const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getPosterUrl(path: string | null | undefined) {
  if (!path) return "";

  return `${TMDB_IMAGE_BASE_URL}/w500${path}`;
}

export function getBackdropUrl(path: string | null | undefined) {
  if (!path) return "";

  return `${TMDB_IMAGE_BASE_URL}/original${path}`;
}