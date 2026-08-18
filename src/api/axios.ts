import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

import { useAdminStore } from "../store/useAdminStore";
import { authService } from "./services/authService";

export const API_BASE_URL =
    "https://gfw-backend.onrender.com/api";

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
    },
    timeout: 30000,
});

// -----------------------------------------
// REQUEST INTERCEPTOR
// -----------------------------------------

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token =
            useAdminStore.getState().accessToken;

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// -----------------------------------------
// REFRESH CONTROL
// -----------------------------------------

let isRefreshing = false;

let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (
    error: unknown,
    token: string | null = null
) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

// -----------------------------------------
// RESPONSE INTERCEPTOR
// -----------------------------------------

axiosInstance.interceptors.response.use(
    (response) => response,

    async (
        error: AxiosError
    ) => {
        const originalRequest =
            error.config as
            | InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry
        ) {
            return Promise.reject(error);
        }

        // Don't refresh the login endpoint.
        if (
            originalRequest.url?.includes(
                "/auth/login"
            )
        ) {
            return Promise.reject(error);
        }

        // Don't refresh the refresh endpoint.
        if (
            originalRequest.url?.includes(
                "/auth/refresh"
            )
        ) {
            useAdminStore
                .getState()
                .logout();

            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (
                            originalRequest.headers
                        ) {
                            originalRequest.headers.Authorization =
                                `Bearer ${token}`;
                        }

                        resolve(
                            axiosInstance(
                                originalRequest
                            )
                        );
                    },

                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken =
                useAdminStore.getState()
                    .refreshToken;

            if (!refreshToken) {
                useAdminStore
                    .getState()
                    .logout();

                return Promise.reject(error);
            }

            const response =
                await authService.refresh(
                    refreshToken
                );

            const data =
                response.data ?? response;

            const newAccessToken =
                response.accessToken ??
                response.access_token ??
                response.token ??
                data?.accessToken ??
                data?.access_token ??
                data?.token ??
                null;

            const newRefreshToken =
                response.refreshToken ??
                response.refresh_token ??
                data?.refreshToken ??
                data?.refresh_token ??
                refreshToken;

            if (!newAccessToken) {
                throw new Error(
                    "Refresh token response did not contain an access token."
                );
            }

            useAdminStore
                .getState()
                .setAuthTokens(
                    newAccessToken,
                    newRefreshToken
                );

            processQueue(
                null,
                newAccessToken
            );

            if (originalRequest.headers) {
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;
            }

            return axiosInstance(
                originalRequest
            );
        } catch (refreshError) {
            processQueue(refreshError, null);

            useAdminStore
                .getState()
                .logout();

            return Promise.reject(
                refreshError
            );
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;