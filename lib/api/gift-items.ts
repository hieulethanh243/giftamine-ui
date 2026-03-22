import apiClient from "./client";

export interface GiftItem {
  id: string;
  name: string;
  notes?: string;
  price?: number;
  url?: string;
  imageUrl?: string;
  priority?: number;
  status: "ACTIVE" | "PURCHASED" | "CLAIMED";
  claimedBy?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  } | null;
  claimedAt?: string | null;
  purchasedBy?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  } | null;
  purchasedAt?: string | null;
  wishlistId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGiftItemData {
  name: string;
  notes?: string;
  price?: number;
  url?: string;
  imageUrl?: string;
}

// Get gift items by wishlist id
export const getGiftItems = async (wishlistId: string): Promise<GiftItem[]> => {
  try {
    const response = await apiClient.get(`/gift-items/wishlist/${wishlistId}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching gift items:", error);
    return [];
  }
};

// Create gift item
export const createGiftItem = async (
  wishlistId: string,
  data: CreateGiftItemData,
): Promise<GiftItem> => {
  const response = await apiClient.post(
    `/gift-items/wishlist/${wishlistId}`,
    data,
  );
  return response.data.data;
};

// Get single gift item
export const getGiftItem = async (id: string): Promise<GiftItem> => {
  const response = await apiClient.get(`/gift-items/${id}`);
  return response.data.data;
};

// Update gift item
export const updateGiftItem = async (
  id: string,
  data: Partial<CreateGiftItemData>,
): Promise<GiftItem> => {
  const response = await apiClient.patch(`/gift-items/${id}`, data);
  return response.data.data;
};

// Mark gift item as purchased
export const purchaseGiftItem = async (id: string): Promise<GiftItem> => {
  const response = await apiClient.patch(`/gift-items/${id}/purchase`, {});
  return response.data.data;
};

// Delete gift item
export const deleteGiftItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/gift-items/${id}`);
};

// Get random gift item
export const getRandomGiftItem = async (
  wishlistId: string,
): Promise<GiftItem> => {
  const response = await apiClient.get(
    `/gift-items/wishlist/${wishlistId}/random`,
  );
  return response.data.data;
};
