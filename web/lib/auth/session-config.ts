/** Access token lifetime — kept in sync with JWT and browser cookie. */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

/** Refresh token lifetime — user stays signed in until logout or expiry. */
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 days

export const ACCESS_TOKEN_JWT_EXPIRY = "30d";
export const REFRESH_TOKEN_JWT_EXPIRY = "90d";

/** Proactive client refresh interval (before access token expires). */
export const SESSION_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
