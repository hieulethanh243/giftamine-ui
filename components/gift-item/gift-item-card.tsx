"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GiftItem } from "@/lib/api/gift-items";
import { Heart, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";

interface GiftItemCardProps {
  item: GiftItem;
  onPurchase?: (id: string) => void;
  onDelete?: (id: string) => void;
  isPurchasing?: boolean;
  isDeleting?: boolean;
}

export function GiftItemCard({
  item,
  onPurchase,
  onDelete,
  isPurchasing,
  isDeleting,
}: GiftItemCardProps) {
  const isPurchased = item.status === "PURCHASED";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            loading="eager"
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {isPurchased && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        )}
        <Badge
          variant={isPurchased ? "secondary" : "default"}
          className="absolute top-2 right-2"
        >
          {isPurchased ? "Đã mua" : "Còn"}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="flex-1 pt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
        {item.notes && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {item.notes}
          </p>
        )}

        {/* Price */}
        {item.price && (
          <div className="mb-3">
            <p className="text-lg font-bold text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price)}
            </p>
          </div>
        )}

        {/* Purchased Info */}
        {isPurchased && item.purchasedBy && (
          <div className="bg-green-50 p-2 rounded-md mb-3">
            <p className="text-xs text-gray-600">
              Được mua bởi:{" "}
              <span className="font-semibold">{item.purchasedBy.name}</span>
            </p>
            {item.purchasedAt && (
              <p className="text-xs text-gray-500">
                {new Date(item.purchasedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="pt-0 gap-2">
        {item.url && (
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              Xem
            </a>
          </Button>
        )}
        {!isPurchased && (
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onPurchase?.(item.id)}
            disabled={isPurchasing}
          >
            {isPurchasing ? "Đang..." : "Mua"}
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete?.(item.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
