import type { ReactNode } from "react";

/* ======================================
   JWT DECODER (Base64URL-safe)
====================================== */
function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");

    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

/* ======================================
   TOKEN VALIDATION
====================================== */
function isTokenValid(token?: string) {
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== "number") return false;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
}

/* ======================================
   GET USER FROM LOCAL STORAGE
====================================== */
export function getUserFromLocalStorage() {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem("auth");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return null;

    const token = parsed.accessToken || parsed.token;
    if (!token || !isTokenValid(token)) return null;

    return {
      ...parsed,
      token,
    };
  } catch (err) {
    console.error("Failed to parse auth from localStorage:", err);
    return null;
  }
}

/* ======================================
   AUTH WRAPPER
====================================== */
export function isAuthenticated(
  renderIfTrue: ReactNode,
  renderIfFalse: ReactNode = null
) {
  return function AuthWrapper() {
    const stored = getUserFromLocalStorage();
    return <>{stored ? renderIfTrue : renderIfFalse}</>;
  };
}

/* ======================================
   ROLE WRAPPER
====================================== */
export function isRole(
  requiredRole: string | string[],
  renderIfTrue: ReactNode,
  renderIfFalse: ReactNode = null
) {
  return function RoleWrapper() {
    const stored = getUserFromLocalStorage();
    if (!stored) return <>{renderIfFalse}</>;

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    return (
      <>{roles.includes(stored.user?.role) ? renderIfTrue : renderIfFalse}</>
    );
  };
}
