import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wishlist } from "@/lib/api/wishlists";
import { format } from "date-fns";
import { Users, Gift, Share2 } from "lucide-react";

interface WishlistCardProps {
  wishlist: Wishlist;
  onEdit?: (wishlist: Wishlist) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function WishlistCard({
  wishlist,
  onEdit,
  onDelete,
  onView,
}: WishlistCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{wishlist.name}</CardTitle>
            {wishlist.description && (
              <CardDescription className="mt-1">
                {wishlist.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1 ml-2">
            {wishlist.isShared && (
              <Badge variant="secondary" className="text-xs">
                <Share2 className="w-3 h-3 mr-1" />
                Đã chia sẻ
              </Badge>
            )}
            {!wishlist.isActive && (
              <Badge variant="outline" className="text-xs">
                Không hoạt động
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Gift className="w-4 h-4" />
            <span>{wishlist._count.giftItems} món quà</span>
          </div>
          {wishlist.shares && wishlist.shares.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{wishlist.shares.length} người nhận</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Tạo ngày: {format(new Date(wishlist.createdAt), "dd/MM/yyyy")}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(wishlist.id)}
          >
            Xem
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(wishlist)}
          >
            Sửa
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(wishlist.id)}
          >
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
