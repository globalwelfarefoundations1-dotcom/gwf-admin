export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;

  refreshToken?: string;
  refresh_token?: string;

  user?: LoginUser;

  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
    refreshToken?: string;
    refresh_token?: string;
    user?: LoginUser;
  };

  message?: string;
  success?: boolean;

  [key: string]: unknown;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;

  refreshToken?: string;
  refresh_token?: string;

  data?: {
    accessToken?: string;
    access_token?: string;
    token?: string;
    refreshToken?: string;
    refresh_token?: string;
  };

  message?: string;
  success?: boolean;

  [key: string]: unknown;
}