import apiClient from "./client";

export interface UpdateProfileData {
  name: string;
  avatarUrl?: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const response = await apiClient.patch("/users/me", data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data.data;
};
