"use client";

import { motion } from "framer-motion";
import type { Movie } from "@/app/lib/api/types";
import { MovieCard } from "./movie-card";

type Props = {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function MovieGrid({ movies, onMovieClick }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <motion.li
          key={movie.id}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          className="cursor-pointer"
          onClick={() => onMovieClick?.(movie)}
        >
          <MovieCard movie={movie} />
        </motion.li>
      ))}
    </ul>
  );
}
