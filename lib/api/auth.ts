import Cookies from "js-cookie";
import apiClient from "./client";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  // Thêm các field khác nếu cần
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: any; // Thay bằng type User nếu có
  };
}

// Lưu token vào cookies
export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("access-token", accessToken, {
    expires: 1 / 96,
    secure: true,
    sameSite: "strict",
  }); // 15 phút
  Cookies.set("refresh-token", refreshToken, {
    expires: 30,
    secure: true,
    sameSite: "strict",
  }); // 30 ngày
};

// Xóa token
export const clearTokens = () => {
  Cookies.remove("access-token");
  Cookies.remove("refresh-token");
};

// Login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", data);
  const { accessToken, refreshToken } = response.data.data;
  setTokens(accessToken, refreshToken);
  return response.data;
};

// Register
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/register", data);
  const { accessToken, refreshToken } = response.data.data;
  setTokens(accessToken, refreshToken);
  return response.data;
};

// Logout
export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearTokens();
  }
};

// Get current user (từ /users/me)
export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data.data;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!Cookies.get("access-token");
};
