export type Movie = {
  id: string;
  title: string;
  posterUrl?: string | null;
  year?: number | null;
  rating?: string | null;
  duration?: number | string;
  summary?: string;
  genre?: string;
  directors?: string;
  ratingValue?: string;
  bestRating?: string;
  datePublished: string;
  genres: GenreWithMovies[]
};

export type GenreWithMovies = {
  id: string;
  title: string;
  movies: Movie[];
};

export type GenresWithMoviesResponse = {
  data: GenreWithMovies[];
};

export type MoviesResponse = {
  data: Movie[];
  totalPages: number;
};
