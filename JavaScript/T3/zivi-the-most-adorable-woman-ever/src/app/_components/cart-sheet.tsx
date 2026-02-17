"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { formatPrice } from "~/lib/utils";
import { useToast } from "~/components/toast-provider";

interface CartSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
	const utils = api.useUtils();
	const { toast } = useToast();
	const [listRef] = useAutoAnimate();

	const cartQuery = api.cart.get.useQuery();
	const updateMutation = api.cart.updateQuantity.useMutation({
		onSuccess: () => {
			void utils.cart.get.invalidate();
		},
	});
	const removeMutation = api.cart.remove.useMutation({
		onSuccess: () => {
			void utils.cart.get.invalidate();
			toast("Item removed from cart");
		},
	});

	const items = cartQuery.data?.items ?? [];
	const subtotal = cartQuery.data?.subtotal ?? 0;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader>
					<SheetTitle className="flex items-center gap-2">
						<ShoppingBag className="h-5 w-5" />
						Shopping Cart
					</SheetTitle>
					<SheetDescription>
						{items.length === 0
							? "Your cart is empty"
							: `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 text-neutral-400">
						<ShoppingBag className="h-16 w-16 stroke-1" />
						<p className="text-sm">No items yet</p>
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							asChild
						>
							<Link href="/products">Start Shopping</Link>
						</Button>
					</div>
				) : (
					<>
						<div className="flex-1 overflow-y-auto -mx-6 px-6" ref={listRef}>
							{items.map((item) => (
								<div key={item.id} className="py-4 first:pt-0">
									<div className="flex gap-4">
										<div className="h-20 w-20 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
											<img
												src={item.product.image}
												alt={item.product.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="text-sm font-medium text-neutral-900 truncate">
												{item.product.name}
											</h4>
											<p className="text-xs text-neutral-500 mt-0.5">
												{item.product.category.name}
											</p>
											<p className="text-sm font-semibold mt-1">
												{formatPrice(item.product.price)}
											</p>
											<div className="flex items-center gap-2 mt-2">
												<div className="flex items-center border rounded-lg">
													<button
														onClick={() =>
															updateMutation.mutate({
																productId: item.productId,
																quantity: item.quantity - 1,
															})
														}
														disabled={updateMutation.isPending}
														className="p-1.5 hover:bg-neutral-100 rounded-l-lg transition-colors cursor-pointer disabled:opacity-50"
													>
														<Minus className="h-3 w-3" />
													</button>
													<span className="px-3 text-sm font-medium min-w-[2rem] text-center">
														{item.quantity}
													</span>
													<button
														onClick={() =>
															updateMutation.mutate({
																productId: item.productId,
																quantity: item.quantity + 1,
															})
														}
														disabled={
															updateMutation.isPending ||
															item.quantity >= item.product.stock
														}
														className="p-1.5 hover:bg-neutral-100 rounded-r-lg transition-colors cursor-pointer disabled:opacity-50"
													>
														<Plus className="h-3 w-3" />
													</button>
												</div>
												<button
													onClick={() =>
														removeMutation.mutate({
															productId: item.productId,
														})
													}
													disabled={removeMutation.isPending}
													className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</div>
									</div>
									<Separator className="mt-4" />
								</div>
							))}
						</div>

						<div className="border-t border-neutral-200 pt-4 space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-neutral-600">Subtotal</span>
								<span className="font-semibold">
									{formatPrice(subtotal)}
								</span>
							</div>
							<div className="flex items-center justify-between text-xs text-neutral-500">
								<span>Shipping</span>
								<span>
									{subtotal > 100 ? "Free" : formatPrice(9.99)}
								</span>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<span className="font-semibold">Total</span>
								<span className="text-lg font-bold">
									{formatPrice(
										subtotal + (subtotal > 100 ? 0 : 9.99),
									)}
								</span>
							</div>
							<Button
								className="w-full"
								size="lg"
								onClick={() => onOpenChange(false)}
								asChild
							>
								<Link href="/checkout" className="gap-2">
									Checkout
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
