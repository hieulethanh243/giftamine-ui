import apiClient from "./client";
import { GiftItem } from "./gift-items";

export interface Wishlist {
  id: string;
  name: string;
  description?: string;
  occasion?: string | null;
  isActive: boolean;
  isShared: boolean;
  shareToken?: string;
  sharedWith?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  _count: {
    giftItems: number;
  };
  shares?: Array<{
    sharedTo: {
      id: string;
      name: string;
      avatarUrl?: string | null;
    };
    acceptedAt: string;
  }>;
  giftItems?: GiftItem[];
}

export interface WishlistsResponse {
  wishlists: Wishlist[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateWishlistData {
  name: string;
  description?: string;
}

// Get all wishlists của user
export const getWishlists = async (): Promise<Wishlist[]> => {
  try {
    const response = await apiClient.get("/wishlists/my-wishlists");
    return response.data.data?.wishlists || [];
  } catch (error) {
    console.error("Error fetching my wishlists:", error);
    return [];
  }
};

// Get wishlists shared with me
export const getSharedWithMeWishlists = async (): Promise<Wishlist[]> => {
  try {
    const response = await apiClient.get("/wishlists/shared-with-me");
    return response.data.data?.wishlists || [];
  } catch (error) {
    console.error("Error fetching shared wishlists:", error);
    return [];
  }
};

// Create new wishlist
export const createWishlist = async (
  data: CreateWishlistData,
): Promise<Wishlist> => {
  const response = await apiClient.post("/wishlists", data);
  return response.data.data;
};

// Get wishlist by id
export const getWishlist = async (id: string): Promise<Wishlist> => {
  const response = await apiClient.get(`/wishlists/${id}`);
  return response.data.data;
};

// Update wishlist
export const updateWishlist = async (
  id: string,
  data: Partial<CreateWishlistData>,
): Promise<Wishlist> => {
  const response = await apiClient.patch(`/wishlists/${id}`, data);
  return response.data.data;
};

// Delete wishlist
export const deleteWishlist = async (id: string): Promise<void> => {
  await apiClient.delete(`/wishlists/${id}`);
};
