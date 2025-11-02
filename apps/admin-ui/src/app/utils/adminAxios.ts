// utils/adminAxios.ts
import axios from "axios";
import { runRedirectToAdminLogin } from "./redirect-admin"; // create this to handle admin redirect

const adminAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_SERVER_URI, // admin API base URL
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshSuccess = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

const handleLogout = () => {
  const publicPaths = ["/admin/login"];
  if (!publicPaths.includes(window.location.pathname)) {
    runRedirectToAdminLogin();
  }
};

adminAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry;
    const isRefreshCall = originalRequest.url?.endsWith(
      "/admin/api/refresh-token"
    );

    if (is401 && !isRetry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise((resolve) =>
          subscribeTokenRefresh(() => resolve(adminAxios(originalRequest)))
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_ADMIN_SERVER_URI}/admin/api/refresh-token`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshSuccess();

        return adminAxios(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
