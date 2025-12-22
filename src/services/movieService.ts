import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
  },
});

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const TOKEN = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

// Якщо використовується Bearer token (v4)
if (TOKEN) {
  tmdb.defaults.headers.common.Authorization = `Bearer ${TOKEN}`;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const params: Record<string, string | number | boolean> = {
    query,
    page,
    include_adult: false,
  };

  // Якщо немає Bearer token — використовуємо api_key
  if (!TOKEN) {
    if (!API_KEY) {
      throw new Error(
        "TMDB credentials missing. Add VITE_TMDB_TOKEN or VITE_TMDB_API_KEY to .env"
      );
    }
    params.api_key = API_KEY;
  }

  const response = await tmdb.get<MoviesResponse>("/search/movie", {
    params,
  });

  return response.data;
}
