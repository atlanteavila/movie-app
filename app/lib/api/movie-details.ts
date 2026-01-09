import { apiFetch } from "./client";
import type { Movie } from "./types";

/**
 * GET /movies/{id}
 * Fetch full movie details
 */
export async function fetchMovieDetails(
  movieId: string
): Promise<Movie> {
  if (!movieId) {
    throw new Error("Movie ID is required");
  }

  return apiFetch<Movie>(`/movies/${movieId}`);
}
