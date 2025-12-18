import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<FetchMoviesResponse> => {
  const response = await axios.get<FetchMoviesResponse>(BASE_URL, {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.data;
};
