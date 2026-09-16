/**
 * Builds lib/data/fallback-movies.json — 500 well-known movies via TMDb API.
 * Covers all genres, moods, runtimes, languages and release periods.
 *
 * Usage: npm run build:fallback
 */

import axios from "axios";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TARGET = 500;
const OUTPUT = join(ROOT, "lib/data/fallback-movies.json");

const GENRE_QUERIES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 27, name: "Horror" },
  { id: 16, name: "Animation" },
  { id: 10751, name: "Family" },
  { id: 36, name: "History" },
  { id: 14, name: "Fantasy" },
];

const STREAMING = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Apple TV+",
  "Max",
  "Canal+",
];

function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8").replace(/^\uFEFF/, "");
    const env = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
    }
    return env;
  } catch {
    return {};
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function hashId(id) {
  return Math.abs((id * 2654435761) % 2147483647);
}

function pickStreaming(id) {
  const h = hashId(id);
  const out = [];
  for (let i = 0; i < STREAMING.length; i++) {
    if ((h >> i) & 1) out.push(STREAMING[i]);
  }
  if (out.length < 2) {
    out.push(STREAMING[h % STREAMING.length], STREAMING[(h + 2) % 6]);
  }
  return [...new Set(out)].slice(0, 3);
}

function deriveMoods(genres) {
  const moods = new Set();
  if (genres.includes("Comedy")) moods.add("Laugh");
  if (genres.some((g) => ["Sci-Fi", "Mystery", "Thriller", "Drama"].includes(g)))
    moods.add("Think");
  if (genres.some((g) => ["Drama", "Romance"].includes(g))) moods.add("Cry");
  if (genres.some((g) => ["Adventure", "Fantasy", "Action"].includes(g)))
    moods.add("Adventure");
  if (genres.includes("Horror")) moods.add("Be scared");
  if (genres.some((g) => ["Family", "Animation", "History"].includes(g)))
    moods.add("Feel inspired");
  if (!moods.size) moods.add("Think");
  return [...moods];
}

function deriveEnergy(genres) {
  if (genres.some((g) => ["Horror", "Action", "Thriller"].includes(g)))
    return "Fast & intense";
  if (genres.some((g) => ["Drama", "Romance", "History"].includes(g)))
    return "Slow & atmospheric";
  return "Balanced";
}

function deriveIntensity(genres) {
  if (genres.some((g) => ["Family", "Animation"].includes(g)))
    return "Family-friendly";
  if (genres.some((g) => ["Horror", "Thriller", "Crime", "War"].includes(g)))
    return "Mature";
  return "Mild";
}

function deriveLanguage(code) {
  if (code === "en") return "English";
  if (code === "fr") return "French";
  return "Other";
}

function mapDetails(data, providers) {
  const genres = data.genres?.map((g) => g.name) ?? [];
  const year = data.release_date
    ? Number.parseInt(data.release_date.slice(0, 4), 10)
    : 0;

  const streaming = [];
  const us = providers?.results?.US;
  if (us?.flatrate) {
    for (const p of us.flatrate) {
      if (p.provider_name.includes("Netflix")) streaming.push("Netflix");
      if (p.provider_name.includes("Prime")) streaming.push("Prime Video");
      if (p.provider_name.includes("Disney")) streaming.push("Disney+");
      if (p.provider_name.includes("Apple TV")) streaming.push("Apple TV+");
      if (p.provider_name === "Max" || p.provider_name.includes("HBO"))
        streaming.push("Max");
    }
  }
  const services =
    streaming.length > 0 ? [...new Set(streaming)].slice(0, 3) : pickStreaming(data.id);

  return {
    id: data.id,
    title: data.title,
    year: Number.isFinite(year) ? year : 0,
    runtime: data.runtime || 110,
    genres,
    imdbRating: Number(data.vote_average.toFixed(1)),
    synopsis: data.overview || "",
    posterPath: data.poster_path || "",
    backdropPath: data.backdrop_path || "",
    streamingServices: services,
    moods: deriveMoods(genres),
    tags: genres.length ? [genres[0].toLowerCase()] : ["drama"],
    energy: deriveEnergy(genres),
    intensity: deriveIntensity(genres),
    language: deriveLanguage(data.original_language || "en"),
    iconic: data.popularity > 20 || data.vote_average >= 7.5,
  };
}

async function main() {
  const env = { ...loadEnv(), ...process.env };
  const apiKey = env.TMDB_API_KEY;
  const baseURL = env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

  if (!apiKey) {
    console.error("Missing TMDB_API_KEY in .env.local");
    process.exit(1);
  }

  const client = axios.create({
    baseURL,
    params: { api_key: apiKey, language: "en-US" },
    timeout: 12_000,
  });

  const ids = new Set();

  console.log("Collecting movie IDs from TMDb discover...");

  for (const genre of GENRE_QUERIES) {
    for (let page = 1; page <= 5 && ids.size < TARGET + 50; page++) {
      const { data } = await client.get("/discover/movie", {
        params: {
          with_genres: genre.id,
          sort_by: "popularity.desc",
          vote_count_gte: 200,
          page,
        },
      });
      for (const m of data.results ?? []) {
        if (m.poster_path) ids.add(m.id);
      }
      await sleep(120);
    }
    console.log(`  ${genre.name}: ${ids.size} IDs so far`);
  }

  // French cinema batch
  for (let page = 1; page <= 4; page++) {
    const { data } = await client.get("/discover/movie", {
      params: {
        with_original_language: "fr",
        sort_by: "popularity.desc",
        vote_count_gte: 100,
        page,
      },
    });
    for (const m of data.results ?? []) {
      if (m.poster_path) ids.add(m.id);
    }
    await sleep(120);
  }

  // Classics batch
  for (let page = 1; page <= 3; page++) {
    const { data } = await client.get("/discover/movie", {
      params: {
        "primary_release_date.lte": "1999-12-31",
        sort_by: "popularity.desc",
        vote_count_gte: 500,
        page,
      },
    });
    for (const m of data.results ?? []) {
      if (m.poster_path) ids.add(m.id);
    }
    await sleep(120);
  }

  // Short films batch
  for (let page = 1; page <= 2; page++) {
    const { data } = await client.get("/discover/movie", {
      params: {
        with_runtime_lte: 90,
        sort_by: "popularity.desc",
        vote_count_gte: 200,
        page,
      },
    });
    for (const m of data.results ?? []) {
      if (m.poster_path) ids.add(m.id);
    }
    await sleep(120);
  }

  const idList = [...ids].slice(0, TARGET + 30);
  console.log(`\nFetching details for ${idList.length} movies...`);

  const movies = [];
  let done = 0;

  async function fetchOne(id) {
    try {
      const [details, providers] = await Promise.all([
        client.get(`/movie/${id}`),
        client.get(`/movie/${id}/watch/providers`).catch(() => ({ data: null })),
      ]);
      const movie = mapDetails(details.data, providers.data);
      if (movie.posterPath) movies.push(movie);
    } catch {
      // skip failed IDs
    }
    done++;
    if (done % 50 === 0) console.log(`  ${done}/${idList.length}`);
    await sleep(80);
  }

  const concurrency = 6;
  let idx = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (idx < idList.length && movies.length < TARGET) {
        const id = idList[idx++];
        await fetchOne(id);
      }
    }),
  );

  const final = movies.slice(0, TARGET);

  writeFileSync(
    OUTPUT,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      count: final.length,
      movies: final,
    }),
  );

  console.log(`\nWrote ${final.length} fallback movies to ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
