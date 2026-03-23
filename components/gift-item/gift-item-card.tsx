"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GiftItem } from "@/lib/api/gift-items";
import { Heart, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isPurchased = item.status === "PURCHASED";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Auto Height */}
      <div className="relative w-full bg-gray-100 overflow-hidden">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full aspect-square flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">Hình không tìm thấy</p>
            </div>
          </div>
        )}

        {/* Overlay - Show on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-between p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Title & Price */}
          <div className="flex-1 flex flex-col justify-end">
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
              {item.name}
            </h3>
            {item.price && (
              <p className="text-white font-bold text-base">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price)}
              </p>
            )}
          </div>

          {/* Actions - Show on Hover */}
          <div className="flex gap-2 mt-3">
            {item.url && (
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 h-8 text-xs"
                asChild
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Xem
                </a>
              </Button>
            )}
            {!isPurchased && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => onPurchase?.(item.id)}
                disabled={isPurchasing}
              >
                {isPurchasing ? "..." : "Mua"}
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => onDelete?.(item.id)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Status Badge - Top Right */}
        {isPurchased && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-white">Đã mua</span>
          </div>
        )}
        {!isPurchased && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border-0 text-white text-xs"
          >
            Còn
          </Badge>
        )}

        {/* Purchased Info - Show when purchased */}
        {isPurchased && item.purchasedBy && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-xs">
            <p className="line-clamp-1">
              Mua bởi:{" "}
              <span className="font-semibold">{item.purchasedBy.name}</span>
            </p>
            {item.purchasedAt && (
              <p className="text-white/70 text-xs">
                {new Date(item.purchasedAt).toLocaleDateString("vi-VN")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
