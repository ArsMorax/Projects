"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Category {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	image: string | null;
	_count: { products: number };
}

const categoryImages: Record<string, string> = {
	clothing:
		"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
	electronics:
		"https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
	accessories:
		"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
	home: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
	if (categories.length === 0) return null;

	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-8">
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
							Shop by Category
						</h2>
						<p className="text-neutral-500 mt-2">
							Browse our curated collections
						</p>
					</div>
					<Link
						href="/products"
						className="hidden sm:flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{categories.map((category, i) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
						>
							<Link
								href={`/products?category=${category.slug}`}
								className="group relative block h-64 rounded-2xl overflow-hidden"
							>
								<img
									src={
										category.image ??
										categoryImages[category.slug] ??
										categoryImages.clothing!
									}
									alt={category.name}
									className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
								<div className="absolute bottom-0 left-0 right-0 p-6">
									<h3 className="text-xl font-bold text-white">
										{category.name}
									</h3>
									<p className="text-sm text-white/70 mt-1">
										{category._count.products} products
									</p>
									<div className="flex items-center gap-1 mt-3 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
										Explore
										<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
