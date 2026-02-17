"use client";

import Link from "next/link";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn, formatPrice } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useToast } from "~/components/toast-provider";

interface ProductCardProps {
	product: {
		id: string;
		name: string;
		slug: string;
		price: number;
		compareAt: number | null;
		image: string;
		rating: number;
		reviewCount: number;
		stock: number;
		featured: boolean;
		category: { name: string; slug: string };
	};
	index?: number;
	isAuthenticated?: boolean;
}

export function ProductCard({
	product,
	index = 0,
	isAuthenticated,
}: ProductCardProps) {
	const utils = api.useUtils();
	const { toast } = useToast();

	const addToCart = api.cart.add.useMutation({
		onSuccess: () => {
			void utils.cart.get.invalidate();
			toast(`${product.name} added to cart`);
		},
		onError: (error) => {
			toast(error.message, "error");
		},
	});

	const discount = product.compareAt
		? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
		: 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.05 }}
			className="group"
		>
			<div className="relative rounded-xl overflow-hidden bg-neutral-50 border border-neutral-200/60 hover:border-neutral-300 transition-all duration-300 hover:shadow-lg">
				<Link href={`/products/${product.slug}`}>
					<div className="relative aspect-[4/5] overflow-hidden">
						<img
							src={product.image}
							alt={product.name}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
						<div className="absolute top-3 left-3 flex flex-col gap-1.5">
							{product.featured && (
								<Badge className="bg-brand-600 text-white border-0 text-[10px]">
									Featured
								</Badge>
							)}
							{discount > 0 && (
								<Badge variant="destructive" className="text-[10px]">
									-{discount}%
								</Badge>
							)}
							{product.stock <= 5 && product.stock > 0 && (
								<Badge variant="secondary" className="text-[10px]">
									Only {product.stock} left
								</Badge>
							)}
						</div>
						<button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 cursor-pointer">
							<Heart className="h-4 w-4 text-neutral-600" />
						</button>
					</div>
				</Link>
				<div className="p-4">
					<p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">
						{product.category.name}
					</p>
					<Link href={`/products/${product.slug}`}>
						<h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 hover:text-brand-700 transition-colors">
							{product.name}
						</h3>
					</Link>
					{product.reviewCount > 0 && (
						<div className="flex items-center gap-1 mt-1.5">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={cn(
											"h-3 w-3",
											i < Math.round(product.rating)
												? "fill-amber-400 text-amber-400"
												: "fill-neutral-200 text-neutral-200",
										)}
									/>
								))}
							</div>
							<span className="text-[11px] text-neutral-500">
								({product.reviewCount})
							</span>
						</div>
					)}
					<div className="flex items-end justify-between mt-3">
						<div>
							<span className="text-lg font-bold text-neutral-900">
								{formatPrice(product.price)}
							</span>
							{product.compareAt && (
								<span className="text-xs text-neutral-400 line-through ml-1.5">
									{formatPrice(product.compareAt)}
								</span>
							)}
						</div>
						{isAuthenticated && product.stock > 0 && (
							<Button
								size="sm"
								variant="outline"
								className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
								onClick={() =>
									addToCart.mutate({ productId: product.id, quantity: 1 })
								}
								disabled={addToCart.isPending}
							>
								<ShoppingBag className="h-3.5 w-3.5" />
							</Button>
						)}
					</div>

					{product.stock === 0 && (
						<p className="text-xs text-red-500 font-medium mt-2">
							Out of stock
						</p>
					)}
				</div>
			</div>
		</motion.div>
	);
}
