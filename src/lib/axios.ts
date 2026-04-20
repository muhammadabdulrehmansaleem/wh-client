import axios from "axios";
import authService from "@/services/auth.service";
import { API_URLS } from "@/config/api.urls";

// ─── Axios Instance ───────────────────────────────────────────────────────────
// Angular equivalent: HttpClient configured with HttpInterceptor
// All API calls in the app use this instance (not raw fetch)

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true, // always send httpOnly refresh token cookie
  // NOTE: Do NOT set Content-Type here — axios sets it automatically per request.
  // For FormData (multipart uploads) it must be 'multipart/form-data; boundary=...';
  // overriding it with 'application/json' breaks file uploads.
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before every request — attaches access token if present
// Angular equivalent: HttpInterceptor.intercept() modifying the request

apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Axios sets 'Content-Type: application/json' as a per-method default for
    // PATCH/POST/PUT — even without setting it in axios.create(). This must be
    // explicitly cleared when sending FormData so the browser sets
    // 'multipart/form-data; boundary=...' with the correct boundary string.
    if (config.data instanceof FormData) {
      config.headers.set("Content-Type", undefined as unknown as string);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after every response — handles 401 by refreshing the token and retrying
// Angular equivalent: HttpInterceptor.intercept() catching errors

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

const processPendingRequests = (token: string) => {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
};

apiClient.interceptors.response.use(
  (response) => response, // pass through successful responses

  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve) => {
          pendingRequests.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint — browser auto-sends httpOnly cookie
        const { data } = await axios.post(
          API_URLS.AUTH.REFRESH_TOKEN,
          {},
          { withCredentials: true }
        );

        const newAccessToken: string = data.accessToken;

        // Update in-memory token
        authService.setAccessToken(newAccessToken);

        // Retry all queued requests with new token
        processPendingRequests(newAccessToken);

        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear auth state and redirect to login
        authService.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
