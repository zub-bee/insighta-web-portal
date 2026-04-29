import { api, setupRefreshInterceptor, setApiErrorHandler } from "./api.js";
import { showToast } from "./toast.js";
import { GITHUB_LOGIN_URL } from "./config.js";

let currentUser = null;

export function getUser() {
  return currentUser;
}

export function login() {
  window.location.href = GITHUB_LOGIN_URL;
}

export async function logout() {
  try {
    await api.logout();
  } catch {
    // best-effort — clear local state regardless
  }
  currentUser = null;
  window.location.href = "login.html";
}

/**
 * Call once on every page.
 * • Wires the API error handler → toast bridge.
 * • Sets up the silent-refresh interceptor.
 * • Attempts to rehydrate the session via GET /users/me.
 *
 * If `requireAuth` is true and the user has no session, redirects to login.
 * Returns the user object (or null for public pages).
 */
export async function initAuth(requireAuth = true) {
  setApiErrorHandler((msg) => showToast(msg, "error"));

  setupRefreshInterceptor(() => {
    currentUser = null;
    window.location.href = "login.html";
  });

  try {
    currentUser = await api.getMe();
  } catch {
    currentUser = null;
  }

  if (requireAuth && !currentUser) {
    window.location.href = "login.html";
    return null;
  }

  return currentUser;
}
