import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWishlists,
  getSharedWithMeWishlists,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  Wishlist,
  CreateWishlistData,
} from "../api/wishlists";

// Query keys
export const WISHLISTS_QUERY_KEY = ["wishlists"];
export const SHARED_WISHLISTS_QUERY_KEY = ["wishlists", "shared-with-me"];

// Get all wishlists
export const useWishlists = () => {
  return useQuery({
    queryKey: WISHLISTS_QUERY_KEY,
    queryFn: getWishlists,
  });
};

// Get wishlists shared with me
export const useSharedWithMeWishlists = () => {
  return useQuery({
    queryKey: SHARED_WISHLISTS_QUERY_KEY,
    queryFn: getSharedWithMeWishlists,
  });
};

// Create wishlist mutation
export const useCreateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLISTS_QUERY_KEY });
    },
  });
};

// Update wishlist mutation
export const useUpdateWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateWishlistData>;
    }) => updateWishlist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLISTS_QUERY_KEY });
    },
  });
};

// Delete wishlist mutation
export const useDeleteWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLISTS_QUERY_KEY });
    },
  });
};
