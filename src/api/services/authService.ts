import { apiClient } from "../apiClient";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../apiTypes";

export const authService = {
  login: async (
    payload: LoginRequest
  ): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse, LoginRequest>(
      "/auth/login",
      payload
    );
  },

  refresh: async (
    refreshToken: string
  ): Promise<RefreshTokenResponse> => {
    const payload: RefreshTokenRequest = {
      refreshToken,
    };

    return apiClient.post<
      RefreshTokenResponse,
      RefreshTokenRequest
    >("/auth/refresh", payload);
  },
};