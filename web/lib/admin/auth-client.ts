/** Read admin access token from browser cookie (set on login). */
export function getAdminAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

export function adminAuthHeaders(): HeadersInit {
  const token = getAdminAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
