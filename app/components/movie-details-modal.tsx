"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Movie } from "@/app/lib/api/types";
import { fetchMovieDetails } from "@/app/lib/api/movie-details";
import { SafeMoviePoster } from "./safe-movie-poster";

/* ---------- helpers ---------- */
function formatDuration(iso?: string | number): string {
  if (!iso) return "N/A";
  iso = iso.toString();
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return "N/A";
  const h = match[1] ? `${match[1]}h` : "";
  const m = match[2] ? `${match[2]}m` : "";
  return [h, m].filter(Boolean).join(" ");
}

function getYear(date?: string): string {
  if (!date) return "N/A";
  return new Date(date).getFullYear().toString();
}

/* ---------- component ---------- */
type Props = {
  movieId: string | null;
  onClose: () => void;
};

export function MovieDetailsModal({ movieId, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["movie-details", movieId],
    queryFn: () => fetchMovieDetails(movieId as string),
    enabled: !!movieId,
  });

  useEffect(() => {
    if (!movieId) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [movieId, onClose]);

  if (!movieId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="w-[90vw] max-w-5xl max-h-[85vh] overflow-y-auto rounded-lg bg-gray-900 p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            Close ✕
          </button>
        </div>

        {isLoading && <div className="text-center text-gray-400">Loading…</div>}

        {error && (
          <div className="text-center text-red-400">
            Failed to load movie details
          </div>
        )}

        {data && (
          <>
            {/* Main content */}
            <div className="flex flex-col gap-6 sm:flex-row">
              <SafeMoviePoster src={data.posterUrl} alt={data.title} />

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">
                  {data.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-gray-300">
                  Rated: {data.rating ?? "N/A"}
                </p>

                {data.summary && (
                  <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                    {data.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-700 pt-4 text-sm text-gray-300">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span>
                  ⭐ {data.ratingValue ?? "–"} / {data.bestRating ?? "–"}
                </span>

                <span>⏱ {formatDuration(data.duration)}</span>

                <span>🗓 {getYear(data.datePublished)}</span>

                {data?.directors && data?.directors?.length > 0 && Array.isArray(data?.directors) && (
                  <span>🎬 {data.directors.join(", ")}</span>
                )}
              </div>

              {data.genres?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200"
                    >
                      {g.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
