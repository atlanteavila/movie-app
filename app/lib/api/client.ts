/* ============================================================
 * Centralized API client
 * - Single auth token
 * - Token caching per tab
 * - Automatic retry on 401
 * - Consistent JSON/error handling
 * ============================================================
 */

const BASE_URL = "https://0kadddxyh3.execute-api.us-east-1.amazonaws.com";

/**
 * In-memory token cache (per browser tab)
 */
let cachedToken: string | null = null;

/**
 * Prevents multiple simultaneous token fetches
 */
let tokenPromise: Promise<string> | null = null;

/**
 * Fetch a fresh auth token
 */
async function fetchToken(): Promise<string> {
  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = (async (): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/token`);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Failed to fetch auth token (${res.status}): ${text || res.statusText}`
      );
    }

    const data = await res.json();

    if (!data || typeof data.token !== "string") {
      throw new Error("Auth token missing from response");
    }

    cachedToken = data.token;
    return data.token;
  })().finally(() => {
    tokenPromise = null;
  });

  return tokenPromise;
}

/**
 * Get a valid token (cached or fetched)
 */
async function getToken(): Promise<string> {
  if (cachedToken !== null) {
    return cachedToken;
  }

  return fetchToken();
}

/**
 * Centralized fetch wrapper
 */
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  /**
   * Token expired → refresh once → retry
   */
  if (res.status === 401) {
    cachedToken = null;

    const retryToken = await fetchToken();

    const retryRes = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${retryToken}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    if (!retryRes.ok) {
      const text = await retryRes.text().catch(() => "");
      throw new Error(
        `Request failed (${retryRes.status}): ${text || retryRes.statusText}`
      );
    }

    return retryRes.json() as Promise<T>;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Request failed (${res.status}): ${text || res.statusText}`
    );
  }

  return res.json() as Promise<T>;
}
