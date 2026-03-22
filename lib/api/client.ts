import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", // Thay bằng URL backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor request: Thêm access token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor response: Xử lý refresh token nếu access token hết hạn
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh-token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/refresh`,
            {
              refreshToken,
            },
          );
          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          Cookies.set("access-token", accessToken, { expires: 1 / 96 }); // 15 phút
          Cookies.set("refresh-token", newRefreshToken, { expires: 30 }); // 30 ngày
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Nếu refresh thất bại, logout
          Cookies.remove("access-token");
          Cookies.remove("refresh-token");
          window.location.href = "/login"; // Redirect to login
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
