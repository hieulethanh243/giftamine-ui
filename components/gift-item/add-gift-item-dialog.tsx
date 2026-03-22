"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateGiftItem } from "@/lib/hooks/gift-items";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Tên món quà không được để trống"),
  notes: z.string().optional(),
  price: z.string().optional(),
  url: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddGiftItemDialogProps {
  wishlistId: string;
  children?: React.ReactNode;
  onGiftAdded?: () => void | Promise<void>;
}

export function AddGiftItemDialog({
  wishlistId,
  children,
  onGiftAdded,
}: AddGiftItemDialogProps) {
  const [open, setOpen] = useState(false);
  const createGiftItem = useCreateGiftItem();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      notes: "",
      price: "",
      url: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const price = data.price ? parseFloat(data.price) : undefined;
      await createGiftItem.mutateAsync({
        wishlistId,
        data: {
          name: data.name,
          notes: data.notes || undefined,
          price: isNaN(price || NaN) ? undefined : price,
          url: data.url || undefined,
          imageUrl: data.imageUrl || undefined,
        },
      });
      toast.success("Thêm món quà thành công!");
      form.reset();
      setOpen(false);
      // Refetch the wishlist data to show the new gift
      if (onGiftAdded) {
        await onGiftAdded();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Thêm món quà thất bại!";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Quà
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Món Quà</DialogTitle>
          <DialogDescription>
            Thêm một món quà mới vào wishlist của bạn.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Món Quà</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Apple Watch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô Tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về món quà này..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 100000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Ảnh (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createGiftItem.isPending}>
                {createGiftItem.isPending ? "Đang thêm..." : "Thêm"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
