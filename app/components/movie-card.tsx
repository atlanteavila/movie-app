import type { Movie } from "@/app/lib/api/types";
import { SafeMoviePoster } from "./safe-movie-poster";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-sm">
      <SafeMoviePoster
        src={movie.posterUrl}
        alt={movie.title}
      />

      <h3 className="mt-3 text-sm font-medium text-gray-200">
        {movie.title}
      </h3>

      <p className="mt-1 text-xs font-semibold text-gray-300">
        Rated: {movie.rating ?? "N/A"}
      </p>
    </div>
  );
}
