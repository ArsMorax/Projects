"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ProductCard } from "./product-card";

interface FeaturedProductsProps {
	products: Array<{
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
	}>;
	isAuthenticated?: boolean;
}

export function FeaturedProducts({
	products,
	isAuthenticated,
}: FeaturedProductsProps) {
	const [gridRef] = useAutoAnimate();

	if (products.length === 0) return null;

	return (
		<section className="py-16 sm:py-20 bg-neutral-50/50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-8">
					<div>
						<motion.h2
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-2xl sm:text-3xl font-bold tracking-tight"
						>
							Featured Products
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="text-neutral-500 mt-2"
						>
							Handpicked favorites from our collection
						</motion.p>
					</div>
					<Link
						href="/products"
						className="hidden sm:flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
					>
						See all products
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div
					ref={gridRef}
					className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
				>
					{products.map((product, i) => (
						<ProductCard
							key={product.id}
							product={product}
							index={i}
							isAuthenticated={isAuthenticated}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
