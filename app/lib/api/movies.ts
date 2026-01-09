import { apiFetch } from "./client";
import { MoviesResponse } from "./types";

export type FetchMoviesArgs = {
  page: number;
  limit: number;
  search?: string;
  genre?: string;
};

export async function fetchMovies({
  page,
  limit,
  search,
  genre,
}: FetchMoviesArgs): Promise<MoviesResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) params.set("search", search);
  if (genre) params.set("genre", genre);

  return apiFetch<MoviesResponse>(`/movies?${params.toString()}`);
}
