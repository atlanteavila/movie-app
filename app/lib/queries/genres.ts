import { queryOptions } from "@tanstack/react-query";
import { fetchGenresWithMovies } from "../api";

export const genresWithMoviesQuery = queryOptions({
  queryKey: ["genres-with-movies"],
  queryFn: fetchGenresWithMovies,
  // ✅ Treat like catalog data (rarely changes)
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes
});
