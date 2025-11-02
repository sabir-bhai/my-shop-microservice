import axios from "axios";
import { runRedirectToLogin } from "./redirect";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

// enqueue a request to be replayed after refresh
const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

// fire all queued requests
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// if refresh fails, log the user out
const handleLogout = () => {
  const publicPaths = ["/login", "/signup", "/forgot-password"];
  if (!publicPaths.includes(window.location.pathname)) {
    runRedirectToLogin();
  }
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // only handle 401s, and skip our refresh‐endpoint itself
    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry;
    const isRefreshCall = originalRequest.url?.endsWith("/api/refresh-token");

    if (is401 && !isRetry && !isRefreshCall) {
      if (isRefreshing) {
        // queue up and replay once the in-flight refresh resolves
        return new Promise((resolve) =>
          subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)))
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // attempt to get a new access token
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-token`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshSuccess();

        // re‑try the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = []; // clear the queue
        // handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
