import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGiftItems,
  createGiftItem,
  updateGiftItem,
  purchaseGiftItem,
  deleteGiftItem,
  GiftItem,
  CreateGiftItemData,
} from "../api/gift-items";

// Query keys
const GIFT_ITEMS_KEY = (wishlistId: string) => ["gift-items", wishlistId];

// Get gift items by wishlist
export const useGiftItems = (wishlistId: string) => {
  return useQuery({
    queryKey: GIFT_ITEMS_KEY(wishlistId),
    queryFn: () => getGiftItems(wishlistId),
  });
};

// Create gift item mutation
export const useCreateGiftItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      wishlistId,
      data,
    }: {
      wishlistId: string;
      data: CreateGiftItemData;
    }) => createGiftItem(wishlistId, data),
    onSuccess: (_, { wishlistId }) => {
      queryClient.invalidateQueries({
        queryKey: GIFT_ITEMS_KEY(wishlistId),
      });
    },
  });
};

// Update gift item mutation
export const useUpdateGiftItem = (wishlistId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateGiftItemData>;
    }) => updateGiftItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GIFT_ITEMS_KEY(wishlistId),
      });
    },
  });
};

// Purchase gift item mutation
export const usePurchaseGiftItem = (wishlistId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseGiftItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GIFT_ITEMS_KEY(wishlistId),
      });
    },
  });
};

// Delete gift item mutation
export const useDeleteGiftItem = (wishlistId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGiftItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GIFT_ITEMS_KEY(wishlistId),
      });
    },
  });
};
