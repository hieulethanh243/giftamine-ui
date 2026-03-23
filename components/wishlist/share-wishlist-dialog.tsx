"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Share2, Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  searchUsers,
  shareWishlistDirectly,
  getWishlistShares,
  removeWishlistShare,
  UserSearchResult,
  WishlistShare,
} from "@/lib/api/wishlist-share";
import type { AxiosError } from "axios";

interface ShareWishlistDialogProps {
  wishlistId: string;
  wishlistName: string;
}

export function ShareWishlistDialog({
  wishlistId,
  wishlistName,
}: ShareWishlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [sharedUsers, setSharedUsers] = useState<WishlistShare[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadSharedUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const shares = await getWishlistShares(wishlistId);
      setSharedUsers(shares);
    } catch (error) {
      const err = error as AxiosError;
      console.error("Failed to load shared users:", err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  }, [wishlistId]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      const err = error as AxiosError;
      console.error("Failed to search users:", err);
      toast.error("Không thể tìm kiếm người dùng");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Fetch shared users when dialog opens
  useEffect(() => {
    if (open) {
      loadSharedUsers();
    }
  }, [open, loadSharedUsers]);

  // Search users with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  const handleShare = async (userId: string, userName: string) => {
    try {
      setIsSharing(true);
      await shareWishlistDirectly(wishlistId, userId);
      toast.success(`Đã share cho ${userName}`);
      setSearchQuery("");
      setSearchResults([]);
      await loadSharedUsers();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || "Chia sẻ thất bại";
      toast.error(message);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRemoveShare = async (userId: string, userName: string) => {
    try {
      await removeWishlistShare(wishlistId, userId);
      toast.success(`Đã xóa chia sẻ với ${userName}`);
      await loadSharedUsers();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || "Xóa chia sẻ thất bại";
      toast.error(message);
    }
  };

  // Filter out already shared users from search results
  const filteredResults = searchResults.filter(
    (user) => !sharedUsers.some((share) => share.sharedTo.id === user.id),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Chia sẻ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ wishlist</DialogTitle>
          <DialogDescription>
            Chia sẻ {`"${wishlistName}"`} với bạn bè
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                </div>
              ) : filteredResults.length > 0 ? (
                <ul className="divide-y">
                  {filteredResults.map((user) => (
                    <li
                      key={user.id}
                      className="p-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.name}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = parent.querySelector(
                                    ".avatar-fallback",
                                  ) as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div className="avatar-fallback w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleShare(user.id, user.name)}
                        disabled={isSharing}
                      >
                        {isSharing ? "..." : "Chia sẻ"}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : searchResults.length === 0 && !isSearching ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Không tìm thấy người dùng
                </div>
              ) : null}
            </div>
          )}

          {/* Shared Users List */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Đã chia sẻ với</h4>
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              </div>
            ) : sharedUsers.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sharedUsers.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {share.sharedTo.avatarUrl ? (
                          <Image
                            src={share.sharedTo.avatarUrl}
                            alt={share.sharedTo.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector(
                                  ".avatar-fallback",
                                ) as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div className="avatar-fallback w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                          {share.sharedTo.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {share.sharedTo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {share.sharedTo.email}
                        </p>
                        {share.acceptedAt && (
                          <p className="text-xs text-gray-400">
                            Nhận vào:{" "}
                            {new Date(share.acceptedAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleRemoveShare(
                          share.sharedTo.id,
                          share.sharedTo.name,
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa chia sẻ với ai</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
