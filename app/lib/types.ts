import { Movie } from "./api/types";


export type GenreWithMovies = {
  id: string;
  title: string; // e.g. "Action"
  movies: Movie[];
};

export type GenresWithMoviesResponse = {
  data: GenreWithMovies[];
};
