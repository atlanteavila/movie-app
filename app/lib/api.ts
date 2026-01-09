import { GenresWithMoviesResponse } from "./types";

const BASE_URL = "https://0kadddxyh3.execute-api.us-east-1.amazonaws.com";

/**
 * ============================================================
 * Auth token handling
 * ============================================================
 */

/**
 * Cached token for this browser tab
 */
let cachedToken: string | null = null;

/**
 * In-flight token request (prevents duplicate calls)
 */
let tokenPromise: Promise<string> | null = null;

/**
 * Fetch a new token from the auth endpoint
 */
async function fetchToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/token`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch auth token (${res.status}): ${text || res.statusText}`
    );
  }

  const data: unknown = await res.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("token" in data) ||
    typeof (data as { token: unknown }).token !== "string"
  ) {
    throw new Error("Invalid token response shape");
  }

  return (data as { token: string }).token;
}

/**
 * Get a valid token (cached or fetched)
 */
async function getToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  if (!tokenPromise) {
    tokenPromise = fetchToken()
      .then((token) => {
        cachedToken = token;
        return token;
      })
      .finally(() => {
        tokenPromise = null;
      });
  }

  return tokenPromise;
}

/**
 * ============================================================
 * Fetch helpers
 * ============================================================
 */

// Small helper to safely fetch JSON with good errors.
async function fetchJson<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("API ERROR", {
      status: res.status,
      statusText: res.statusText,
      body: text,
      url: input.toString(),
    });

    throw new Error(
      `Request failed (${res.status}): ${text || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}

/**
 * ============================================================
 * Movies
 * ============================================================
 */


type FetchMoviesArgs = {
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
}: FetchMoviesArgs) {
  const token = await getToken();

  const url = new URL(`${BASE_URL}/movies`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (search) url.searchParams.set("search", search);
  if (genre) url.searchParams.set("genre", genre);

  return fetchJson(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * ============================================================
 * Genres with movies
 * ============================================================
 */

export async function fetchGenresWithMovies(): Promise<GenresWithMoviesResponse> {
  const token = await getToken();

  /**
   * IMPORTANT:
   * If this endpoint returns 403 while /movies works,
   * the token is valid but NOT AUTHORIZED for this resource.
   *
   * That is an API/IAM issue, not a fetch bug.
   */
  const raw = await fetchJson<unknown>(`${BASE_URL}/genres/movies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /**
   * Normalize response shape safely (no `any`)
   */
  if (
    typeof raw === "object" &&
    raw !== null &&
    "genResults" in raw
  ) {
    const genResults = (raw as { genResults: unknown }).genResults;

    if (
      typeof genResults === "object" &&
      genResults !== null &&
      "data" in genResults &&
      Array.isArray((genResults as { data: unknown }).data)
    ) {
      return {
        data: (genResults as { data: GenresWithMoviesResponse["data"] }).data,
      };
    }
  }

  if (
    typeof raw === "object" &&
    raw !== null &&
    "data" in raw &&
    Array.isArray((raw as { data: unknown }).data)
  ) {
    return {
      data: (raw as { data: GenresWithMoviesResponse["data"] }).data,
    };
  }

  throw new Error("Unexpected /genres/movies response shape");
}
