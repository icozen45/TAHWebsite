export function getSessionIdFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )sessionId=([^;]*)/);
  return match ? match[1] : null;
}

export function ensureSessionId() {
  if (typeof document === "undefined") return null; // SSR safety

  const cookieName = "sessionId";
  let sessionId = getSessionIdFromCookie();

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    document.cookie = `${cookieName}=${sessionId}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }

  return sessionId;
}
