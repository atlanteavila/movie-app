"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

import { fetchMovies } from "@/app/lib/api/movies";
import { fetchGenresWithMovies } from "@/app/lib/api/genres";
import { MovieGrid } from "@/app/components/movie-grid";
import { MovieDetailsModal } from "./components/movie-details-modal";

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const limit = 12;

  /* ---------------- Movies ---------------- */
  const {
    data: moviesResponse,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["movies", page, search, genre],
    queryFn: () =>
      fetchMovies({
        page,
        limit,
        search: search || undefined,
        genre: genre || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const movies = moviesResponse?.data ?? [];
  const totalPages = moviesResponse?.totalPages ?? 1;

  /* ---------------- Genres ---------------- */
  const { data: genresResponse } = useQuery({
    queryKey: ["genres-with-movies"],
    queryFn: fetchGenresWithMovies,
    staleTime: 1000 * 60 * 10,
  });

  /**
   * Extract unique, sorted genre titles
   */
  const genres = useMemo(() => {
    if (!genresResponse?.data) return [];
    return genresResponse.data
      .map((g) => g.title)
      .sort((a, b) => a.localeCompare(b));
  }, [genresResponse]);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold text-white">Movie Search</h1>

      {/* Filters */}
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {/* Search */}
        <input
          placeholder="Search movies..."
          className="rounded-md border px-3 py-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Genre dropdown */}
        <select
          className="rounded-md border px-3 py-2"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Results summary */}
      <div className="mt-2 text-sm text-gray-300">
        {(search || genre) && (
          <>
            Found{" "}
            <strong>{totalPages > 1 ? `${limit}+` : movies.length}</strong>{" "}
            movies
            {search && (
              <>
                {" "}
                for <em>{search}</em>
              </>
            )}
            {genre && (
              <>
                {" "}
                in <em>{genre}</em>
              </>
            )}
          </>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-gray-500">Loading…</div>
      ) : (
        <MovieGrid
          movies={movies}
          onMovieClick={(movie) => setSelectedMovieId(movie.id)}
        />
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-200">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={isPlaceholderData || page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <MovieDetailsModal
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </div>
  );
}
