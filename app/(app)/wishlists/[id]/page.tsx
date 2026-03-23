"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GiftItemCard } from "@/components/gift-item/gift-item-card";
import { AddGiftItemDialog } from "@/components/gift-item/add-gift-item-dialog";
import { ShareWishlistDialog } from "@/components/wishlist/share-wishlist-dialog";
import { usePurchaseGiftItem, useDeleteGiftItem } from "@/lib/hooks/gift-items";
import { getWishlist } from "@/lib/api/wishlists";
import { isAuthenticated } from "@/lib/api/auth";
import { getRandomGiftItem } from "@/lib/api/gift-items";
import { ArrowLeft, Shuffle } from "lucide-react";

export default function WishlistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const wishlistId = params.id as string;

  const [isMounted, setIsMounted] = useState(false);
  const [wishlist, setWishlist] = useState<any>(null);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [randomGiftItem, setRandomGiftItem] = useState<any>(null);
  const [isGettingRandom, setIsGettingRandom] = useState(false);

  const purchaseGiftItem = usePurchaseGiftItem(wishlistId);
  const deleteGiftItem = useDeleteGiftItem(wishlistId);

  // Check authentication and fetch wishlist
  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const data = await getWishlist(wishlistId);
      setWishlist(data);
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      setWishlistError(
        error.response?.data?.message || "Không thể tải wishlist",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    fetchWishlist();
  }, [wishlistId, router]);

  const handlePurchaseGiftItem = async (id: string) => {
    try {
      await purchaseGiftItem.mutateAsync(id);
      toast.success("Đã đánh dấu là mua");
      await fetchWishlist();
    } catch (error: any) {
      const message = error.response?.data?.message || "Thất bại";
      toast.error(message);
    }
  };

  const handleDeleteGiftItem = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa món quà này?")) {
      try {
        await deleteGiftItem.mutateAsync(id);
        toast.success("Xóa thành công!");
        await fetchWishlist();
      } catch (error: any) {
        const message = error.response?.data?.message || "Xóa thất bại!";
        toast.error(message);
      }
    }
  };

  const handleGetRandomGiftItem = async () => {
    try {
      setIsGettingRandom(true);
      const randomItem = await getRandomGiftItem(wishlistId);
      setRandomGiftItem(randomItem);
      toast.success("Đã chọn quà ngẫu nhiên!");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Không thể lấy quà ngẫu nhiên!";
      toast.error(message);
    } finally {
      setIsGettingRandom(false);
    }
  };

  if (!isMounted || !isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (wishlistLoading || wishlistError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className={wishlistError ? "text-red-600" : ""}>
              {wishlistError ? "Lỗi tải wishlist" : "Đang tải..."}
            </CardTitle>
            <CardDescription>
              {wishlistError ||
                "Vui lòng chờ trong khi chúng tôi tải wishlist của bạn"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} className="w-full">
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Không tìm thấy</CardTitle>
            <CardDescription>Wishlist không tồn tại</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} className="w-full">
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const purchasedCount =
    wishlist?.giftItems?.filter((item: any) => item.status === "PURCHASED")
      .length || 0;
  const activeCount = (wishlist?.giftItems?.length || 0) - purchasedCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {wishlist.name}
                </h1>
                {wishlist.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {wishlist.description}
                  </p>
                )}
              </div>
            </div>
            <ShareWishlistDialog
              wishlistId={wishlistId}
              wishlistName={wishlist.name}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Tổng cộng</p>
                <p className="text-3xl font-bold text-primary">
                  {wishlist?.giftItems?.length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Còn</p>
                <p className="text-3xl font-bold text-blue-600">
                  {activeCount}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Đã mua</p>
                <p className="text-3xl font-bold text-green-600">
                  {purchasedCount}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Gift Item Button */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Danh sách quà</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleGetRandomGiftItem}
              disabled={isGettingRandom || !wishlist?.giftItems?.length}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {isGettingRandom ? "Đang chọn..." : "Random quà"}
            </Button>
            <AddGiftItemDialog
              wishlistId={wishlistId}
              onGiftAdded={fetchWishlist}
            />
          </div>
        </div>

        {/* Random Gift Item */}
        {randomGiftItem && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shuffle className="w-5 h-5 mr-2 text-purple-600" />
                Quà ngẫu nhiên được chọn
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRandomGiftItem(null)}
              >
                Ẩn
              </Button>
            </div>
            <div className="max-w-md">
              <GiftItemCard
                item={randomGiftItem}
                onPurchase={handlePurchaseGiftItem}
                onDelete={handleDeleteGiftItem}
                isPurchasing={purchaseGiftItem.isPending}
                isDeleting={deleteGiftItem.isPending}
              />
            </div>
          </div>
        )}

        {/* Gift Items Grid - Pinterest Style */}
        {wishlist?.giftItems && wishlist?.giftItems.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {wishlist?.giftItems.map((item: any) => (
              <div key={item.id} className="break-inside-avoid mb-6">
                <GiftItemCard
                  item={item}
                  onPurchase={handlePurchaseGiftItem}
                  onDelete={handleDeleteGiftItem}
                  isPurchasing={purchaseGiftItem.isPending}
                  isDeleting={deleteGiftItem.isPending}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-4">
                Chưa có món quà nào trong wishlist này
              </p>
              <AddGiftItemDialog
                wishlistId={wishlistId}
                onGiftAdded={fetchWishlist}
              >
                <Button>Thêm Quà Đầu Tiên</Button>
              </AddGiftItemDialog>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
