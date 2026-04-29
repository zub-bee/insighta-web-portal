import { API_BASE_URL } from "./config.js";

/* global axios */

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "X-API-Version": "1" },
});

// ---------------------------------------------------------------------------
// Error-toast bridge (same pattern as the React version)
// ---------------------------------------------------------------------------
let errorHandler = null;

export function setApiErrorHandler(handler) {
  errorHandler = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const msg =
        error.response?.data?.message ??
        error.message ??
        "An unexpected error occurred";

      const url = error.config?.url ?? "";
      const is401 = error.response?.status === 401;
      if (!(is401 && url.startsWith("/auth/"))) {
        errorHandler?.(msg);
      }
    }
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Refresh interceptor
// ---------------------------------------------------------------------------
let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(undefined);
  });
  failedQueue = [];
}

let refreshInterceptorAdded = false;

export function setupRefreshInterceptor(onUnauthenticated) {
  if (refreshInterceptorAdded) return;
  refreshInterceptorAdded = true;

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      const url = original.url ?? "";

      if (
        error.response?.status !== 401 ||
        original._retry ||
        url.startsWith("/auth/")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/auth/refresh", {});
        processQueue(null);
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError);
        onUnauthenticated();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}

// ---------------------------------------------------------------------------
// API helpers — mirrors the React api object exactly
// ---------------------------------------------------------------------------
export const api = {
  // Returns: {status, dashboard: {...}}
  getDashboardStats: () =>
    apiClient.get("/api/profiles/dashboard").then((r) => r.data.dashboard),

  // Returns: {status, page, limit, total, total_pages, links, data}
  getProfiles: (params) =>
    apiClient.get("/api/profiles", { params }).then((r) => r.data),

  // Returns: {status, data: profile}
  getProfile: (id) =>
    apiClient
      .get(`/api/profiles/${encodeURIComponent(id)}`)
      .then((r) => r.data.data),

  // Returns: {status, page, limit, total, total_pages, links, data}
  searchProfiles: (params) =>
    apiClient.get("/api/profiles/search", { params }).then((r) => r.data),

  // Returns: {message}
  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  // Returns: {status, data: user}
  getMe: () =>
    apiClient.get("/api/users/me", { _retry: true }).then((r) => r.data.data),
};
