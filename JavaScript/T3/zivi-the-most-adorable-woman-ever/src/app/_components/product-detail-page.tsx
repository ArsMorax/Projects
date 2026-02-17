"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Star,
	ShoppingBag,
	Heart,
	Truck,
	Shield,
	RefreshCcw,
	ChevronRight,
	Minus,
	Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ProductCard } from "./product-card";
import { cn, formatPrice } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useToast } from "~/components/toast-provider";

interface ProductDetailPageProps {
	slug: string;
	isAuthenticated: boolean;
}

export function ProductDetailPage({
	slug,
	isAuthenticated,
}: ProductDetailPageProps) {
	const router = useRouter();
	const { toast } = useToast();
	const utils = api.useUtils();

	const { data, isLoading } = api.product.getBySlug.useQuery({ slug });
	const [quantity, setQuantity] = React.useState(1);
	const [selectedImage, setSelectedImage] = React.useState(0);

	const addToCart = api.cart.add.useMutation({
		onSuccess: () => {
			void utils.cart.get.invalidate();
			toast(`Added ${quantity} item(s) to cart`);
		},
		onError: (err) => {
			toast(err.message, "error");
		},
	});

	if (isLoading || !data) {
		return (
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<div className="aspect-square bg-neutral-100 rounded-2xl animate-pulse" />
					<div className="space-y-4">
						<div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
						<div className="h-8 w-2/3 bg-neutral-100 rounded animate-pulse" />
						<div className="h-6 w-24 bg-neutral-100 rounded animate-pulse mt-4" />
						<div className="space-y-2 mt-6">
							<div className="h-4 bg-neutral-100 rounded animate-pulse" />
							<div className="h-4 bg-neutral-100 rounded animate-pulse w-5/6" />
							<div className="h-4 bg-neutral-100 rounded animate-pulse w-4/6" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	const { product, related } = data;
	const images: string[] = (() => {
		try {
			const parsed = JSON.parse(product.images) as string[];
			return [product.image, ...parsed];
		} catch {
			return [product.image];
		}
	})();

	const discount = product.compareAt
		? Math.round(
				((product.compareAt - product.price) / product.compareAt) * 100,
			)
		: 0;

	return (
		<div className="bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
				<nav className="flex items-center gap-1.5 text-sm text-neutral-500">
					<Link href="/" className="hover:text-neutral-900 transition-colors">
						Home
					</Link>
					<ChevronRight className="h-3.5 w-3.5" />
					<Link
						href="/products"
						className="hover:text-neutral-900 transition-colors"
					>
						Products
					</Link>
					<ChevronRight className="h-3.5 w-3.5" />
					<Link
						href={`/products?category=${product.category.slug}`}
						className="hover:text-neutral-900 transition-colors"
					>
						{product.category.name}
					</Link>
					<ChevronRight className="h-3.5 w-3.5" />
					<span className="text-neutral-900 font-medium truncate">
						{product.name}
					</span>
				</nav>
			</div>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4">
							<img
								src={images[selectedImage]}
								alt={product.name}
								className="h-full w-full object-cover"
							/>
						</div>
						{images.length > 1 && (
							<div className="flex gap-3">
								{images.map((img, i) => (
									<button
										key={i}
										onClick={() => setSelectedImage(i)}
										className={cn(
											"h-20 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
											selectedImage === i
												? "border-neutral-900 ring-1 ring-neutral-900"
												: "border-neutral-200 hover:border-neutral-400",
										)}
									>
										<img
											src={img}
											alt=""
											className="h-full w-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="flex flex-col"
					>
						<p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
							{product.category.name}
						</p>
						<h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">
							{product.name}
						</h1>
						{product.reviewCount > 0 && (
							<div className="flex items-center gap-2 mt-3">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={cn(
												"h-4 w-4",
												i < Math.round(product.rating)
													? "fill-amber-400 text-amber-400"
													: "fill-neutral-200 text-neutral-200",
											)}
										/>
									))}
								</div>
								<span className="text-sm text-neutral-500">
									{product.rating.toFixed(1)} ({product.reviewCount} reviews)
								</span>
							</div>
						)}
						<div className="flex items-baseline gap-3 mt-4">
							<span className="text-3xl font-bold text-neutral-900">
								{formatPrice(product.price)}
							</span>
							{product.compareAt && (
								<>
									<span className="text-lg text-neutral-400 line-through">
										{formatPrice(product.compareAt)}
									</span>
									<Badge
										variant="destructive"
										className="text-xs"
									>
										Save {discount}%
									</Badge>
								</>
							)}
						</div>

						<Separator className="my-6" />
						<p className="text-sm text-neutral-600 leading-relaxed">
							{product.description}
						</p>
						<div className="mt-4">
							{product.stock > 0 ? (
								<Badge variant="success" className="text-xs">
									In Stock ({product.stock} available)
								</Badge>
							) : (
								<Badge variant="destructive" className="text-xs">
									Out of Stock
								</Badge>
							)}
						</div>
						{product.stock > 0 && isAuthenticated && (
							<div className="mt-8 flex items-center gap-4">
								<div className="flex items-center border border-neutral-300 rounded-lg">
									<button
										onClick={() =>
											setQuantity((q) => Math.max(1, q - 1))
										}
										className="p-3 hover:bg-neutral-100 rounded-l-lg transition-colors cursor-pointer"
									>
										<Minus className="h-4 w-4" />
									</button>
									<span className="px-5 text-sm font-semibold min-w-[3rem] text-center">
										{quantity}
									</span>
									<button
										onClick={() =>
											setQuantity((q) =>
												Math.min(product.stock, q + 1),
											)
										}
										className="p-3 hover:bg-neutral-100 rounded-r-lg transition-colors cursor-pointer"
									>
										<Plus className="h-4 w-4" />
									</button>
								</div>

								<Button
									size="lg"
									className="flex-1 gap-2"
									onClick={() =>
										addToCart.mutate({
											productId: product.id,
											quantity,
										})
									}
									disabled={addToCart.isPending}
								>
									<ShoppingBag className="h-5 w-5" />
									{addToCart.isPending
										? "Adding..."
										: "Add to Cart"}
								</Button>

								<Button variant="outline" size="icon" className="h-12 w-12">
									<Heart className="h-5 w-5" />
								</Button>
							</div>
						)}

						{!isAuthenticated && (
							<div className="mt-8">
								<Link href="/api/auth/signin">
									<Button size="lg" className="w-full">
										Sign in to purchase
									</Button>
								</Link>
							</div>
						)}
						<div className="mt-8 grid grid-cols-3 gap-4">
							{[
								{
									icon: Truck,
									label: "Free Shipping",
									desc: "Orders $100+",
								},
								{
									icon: Shield,
									label: "Warranty",
									desc: "2 year guarantee",
								},
								{
									icon: RefreshCcw,
									label: "Easy Returns",
									desc: "30-day policy",
								},
							].map((benefit) => (
								<div
									key={benefit.label}
									className="text-center p-3 rounded-xl bg-neutral-50 border border-neutral-100"
								>
									<benefit.icon className="h-5 w-5 mx-auto text-neutral-600" />
									<p className="text-xs font-semibold text-neutral-900 mt-2">
										{benefit.label}
									</p>
									<p className="text-[10px] text-neutral-500 mt-0.5">
										{benefit.desc}
									</p>
								</div>
							))}
						</div>
					</motion.div>
				</div>
				{related.length > 0 && (
					<section className="mt-20">
						<h2 className="text-xl font-bold text-neutral-900 mb-6">
							You might also like
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
							{related.map((p, i) => (
								<ProductCard
									key={p.id}
									product={p}
									index={i}
									isAuthenticated={isAuthenticated}
								/>
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
