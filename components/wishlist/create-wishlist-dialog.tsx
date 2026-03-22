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
import { useCreateWishlist } from "@/lib/hooks/wishlists";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Tên wishlist không được để trống"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateWishlistDialogProps {
  children?: React.ReactNode;
}

export function CreateWishlistDialog({ children }: CreateWishlistDialogProps) {
  const [open, setOpen] = useState(false);
  const createWishlist = useCreateWishlist();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createWishlist.mutateAsync(data);
      toast.success("Tạo wishlist thành công!");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      const message = error.response?.data?.message || "Tạo wishlist thất bại!";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Wishlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Wishlist Mới</DialogTitle>
          <DialogDescription>
            Tạo danh sách quà tặng mới để chia sẻ với bạn bè.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Wishlist</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Sinh nhật 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả về wishlist này..."
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
              <Button type="submit" disabled={createWishlist.isPending}>
                {createWishlist.isPending ? "Đang tạo..." : "Tạo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
