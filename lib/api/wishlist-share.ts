import apiClient from "./client";

export interface ShareWishlistRequest {
  targetUserId: string;
}

export interface ShareWishlistResponse {
  sharedTo: {
    id: string;
    name: string;
  };
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface WishlistShare {
  id: string;
  acceptedAt: string | null;
  createdAt: string;
  sharedTo: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

// Share wishlist directly to user
export const shareWishlistDirectly = async (
  wishlistId: string,
  targetUserId: string,
) => {
  const response = await apiClient.post(
    `/wishlists/${wishlistId}/share/directly`,
    { targetUserId },
  );
  return response.data.data as ShareWishlistResponse;
};

// Get list of users the wishlist is shared with
export const getWishlistShares = async (wishlistId: string) => {
  const response = await apiClient.get(`/wishlists/${wishlistId}/shares`);
  return response.data.data as WishlistShare[];
};

// Search users by name or email
export const searchUsers = async (query: string) => {
  const response = await apiClient.get("/users/search", {
    params: { q: query },
  });
  return response.data.data as UserSearchResult[];
};

// Remove share from specific user
export const removeWishlistShare = async (
  wishlistId: string,
  targetUserId: string,
) => {
  const response = await apiClient.delete(
    `/wishlists/${wishlistId}/share/${targetUserId}`,
  );
  return response.data;
};

// Unshare wishlist completely
export const unshareWishlist = async (wishlistId: string) => {
  const response = await apiClient.delete(`/wishlists/${wishlistId}/unshare`);
  return response.data.data;
};
