import { apiFetch } from "./client";
import { GenresWithMoviesResponse } from "./types";

type RawGenresResponse =
  | {
      genResults: {
        data: GenresWithMoviesResponse["data"];
      };
    }
  | {
      data: GenresWithMoviesResponse["data"];
    };

export async function fetchGenresWithMovies(): Promise<GenresWithMoviesResponse> {
  const raw = await apiFetch<RawGenresResponse>("/genres/movies");

  if ("genResults" in raw) {
    return { data: raw.genResults.data };
  }

  if ("data" in raw) {
    return { data: raw.data };
  }

  throw new Error("Unexpected genres/movies response shape");
}
