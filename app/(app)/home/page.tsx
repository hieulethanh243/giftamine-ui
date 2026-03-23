"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WishlistCard } from "@/components/wishlist/wishlist-card";
import { CreateWishlistDialog } from "@/components/wishlist/create-wishlist-dialog";
import {
  useWishlists,
  useSharedWithMeWishlists,
  useDeleteWishlist,
} from "@/lib/hooks/wishlists";
import { Gift } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    data: myWishlists,
    isLoading: myLoading,
    error: myError,
  } = useWishlists();
  const {
    data: sharedWishlists,
    isLoading: sharedLoading,
    error: sharedError,
  } = useSharedWithMeWishlists();
  const deleteWishlist = useDeleteWishlist();

  const handleDeleteWishlist = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa wishlist này?")) {
      try {
        await deleteWishlist.mutateAsync(id);
        toast.success("Xóa wishlist thành công!");
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Xóa wishlist thất bại!";
        toast.error(message);
      }
    }
  };

  const handleViewWishlist = (id: string) => {
    router.push(`/wishlists/${id}`);
  };

  const handleEditWishlist = (wishlist: any) => {
    toast.info("Tính năng sửa wishlist sẽ được thêm sau!");
  };

  // Combine both wishlists for "All" tab
  const allWishlists = [
    ...(myWishlists || []),
    ...(sharedWishlists || []),
  ].filter(
    (wishlist, index, self) =>
      index === self.findIndex((w) => w.id === wishlist.id),
  );

  const isLoading = myLoading || sharedLoading;
  const hasError = myError || sharedError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Lỗi tải dữ liệu</CardTitle>
            <CardDescription>
              Không thể tải danh sách wishlist. Vui lòng thử lại.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderWishlistsGrid = (wishlists: typeof myWishlists) => {
    if (!wishlists || wishlists.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có wishlist nào
            </h3>
            <p className="text-gray-600">
              Bắt đầu tạo wishlist để chia sẻ quà tặng với bạn bè!
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {wishlists.map((wishlist) => (
          <div key={wishlist.id} className="break-inside-avoid mb-6">
            <WishlistCard
              wishlist={wishlist}
              onView={handleViewWishlist}
              onEdit={handleEditWishlist}
              onDelete={handleDeleteWishlist}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Wishlists</h2>
          <p className="text-gray-600 mt-2">
            Quản lý wishlist và chia sẻ với bạn bè.
          </p>
        </div>
        <CreateWishlistDialog />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            Tất cả ({allWishlists?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="my-wishlists">
            Của tôi ({myWishlists?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="shared-with-me">
            Được chia sẻ ({sharedWishlists?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* All Tab */}
        <TabsContent value="all" className="mt-6">
          {renderWishlistsGrid(allWishlists)}
        </TabsContent>

        {/* My Wishlists Tab */}
        <TabsContent value="my-wishlists" className="mt-6">
          {renderWishlistsGrid(myWishlists)}
        </TabsContent>

        {/* Shared with Me Tab */}
        <TabsContent value="shared-with-me" className="mt-6">
          {renderWishlistsGrid(sharedWishlists)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
