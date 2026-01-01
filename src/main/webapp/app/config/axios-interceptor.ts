import { Storage } from "react-jhipster";

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  GATEWAY_SERVER_API_URL,
  AUTH_REFRESH,
} from "./constants";

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = GATEWAY_SERVER_API_URL;

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken =
      Storage.local.get(REFRESH_TOKEN_KEY) ||
      Storage.session.get(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(AUTH_REFRESH, { refreshToken });
    const newAccessToken = response.data?.data?.accessToken;

    if (newAccessToken) {
      // Update stored access token
      if (Storage.local.get(AUTH_TOKEN_KEY)) {
        Storage.local.set(AUTH_TOKEN_KEY, newAccessToken);
      }
      if (Storage.session.get(AUTH_TOKEN_KEY)) {
        Storage.session.set(AUTH_TOKEN_KEY, newAccessToken);
      }

      return newAccessToken;
    }

    return null;
  } catch (error) {
    // Clear tokens if refresh fails
    Storage.local.remove(AUTH_TOKEN_KEY);
    Storage.local.remove(REFRESH_TOKEN_KEY);
    Storage.session.remove(AUTH_TOKEN_KEY);
    Storage.session.remove(REFRESH_TOKEN_KEY);
    return null;
  }
};

const setupAxiosInterceptors = (onUnauthenticated) => {
  const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    const token =
      Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = (response) => response;

  const onResponseError = async (err: AxiosError) => {
    const originalRequest: any = err.config;
    const status = err.status ?? (err.response ? err.response.status : 0);

    // If error is 401 and we haven't retried yet
    if (status === 401 && !originalRequest._retry) {
      // Skip token refresh for login and refresh endpoints
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        onUnauthenticated();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((error) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            return Promise.reject(error);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `${newToken}`;
          return axios(originalRequest);
        } else {
          processQueue(new Error("Token refresh failed"), null);
          onUnauthenticated();
          return Promise.reject(err);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        onUnauthenticated();
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    if (status === 403) {
      // Forbidden - user doesn't have permission
      return Promise.reject(err);
    }

    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
