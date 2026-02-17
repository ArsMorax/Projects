"use client";

import Link from "next/link";
import { ArrowRight, TruckIcon, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Hero } from "./hero";
import { ProductCard } from "./product-card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface HomePageProps {
	isAuthenticated: boolean;
}

export function HomePage({ isAuthenticated }: HomePageProps) {
	const [gridRef] = useAutoAnimate();
	const featuredQuery = api.product.getFeatured.useQuery();
	const categoriesQuery = api.product.getCategories.useQuery();

	const features = [
		{
			icon: TruckIcon,
			title: "Free Shipping",
			desc: "On orders over $100",
		},
		{
			icon: ShieldCheck,
			title: "Secure Payment",
			desc: "100% protected checkout",
		},
		{
			icon: RefreshCcw,
			title: "Easy Returns",
			desc: "30-day return policy",
		},
		{
			icon: Headphones,
			title: "24/7 Support",
			desc: "Always here to help",
		},
	];

	return (
		<div>
			<Hero />
			<section className="border-b border-neutral-200 bg-white">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, i) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 * i, duration: 0.4 }}
								className="flex items-center gap-3"
							>
								<div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
									<feature.icon className="h-5 w-5 text-neutral-600" />
								</div>
								<div>
									<p className="text-sm font-semibold text-neutral-900">
										{feature.title}
									</p>
									<p className="text-xs text-neutral-500">{feature.desc}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>
			{categoriesQuery.data && categoriesQuery.data.length > 0 && (
				<section className="bg-white py-16">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex items-end justify-between mb-8">
							<div>
								<h2 className="text-2xl font-bold text-neutral-900">
									Shop by Category
								</h2>
								<p className="text-neutral-500 mt-1 text-sm">
									Browse our curated collections
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
							{categoriesQuery.data.map((category, i) => (
								<motion.div
									key={category.id}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.05 * i, duration: 0.3 }}
								>
									<Link
										href={`/products?category=${category.slug}`}
										className="group relative block aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100"
									>
										{category.image && (
											<img
												src={category.image}
												alt={category.name}
												className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
										<div className="absolute bottom-0 left-0 right-0 p-4">
											<h3 className="text-white font-semibold text-sm">
												{category.name}
											</h3>
											<p className="text-white/70 text-xs mt-0.5">
												{category._count.products} products
											</p>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			)}
			<section className="bg-neutral-50 py-16">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-8">
						<div>
							<h2 className="text-2xl font-bold text-neutral-900">
								Featured Products
							</h2>
							<p className="text-neutral-500 mt-1 text-sm">
								Handpicked favorites for you
							</p>
						</div>
						<Button variant="ghost" className="gap-1 text-sm" asChild>
							<Link href="/products">
								View All
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div
						ref={gridRef}
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
					>
						{featuredQuery.data?.map((product, i) => (
							<ProductCard
								key={product.id}
								product={product}
								index={i}
								isAuthenticated={isAuthenticated}
							/>
						))}
					</div>

					{featuredQuery.data?.length === 0 && (
						<div className="text-center py-20">
							<p className="text-neutral-500">
								No products yet. Seed the database to see products.
							</p>
						</div>
					)}
				</div>
			</section>
			<section className="bg-neutral-900 text-white py-20">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="text-3xl sm:text-4xl font-bold">
							Ready to upgrade your style?
						</h2>
						<p className="mt-4 text-neutral-400 max-w-md mx-auto">
							Join thousands of satisfied customers. Free shipping, easy
							returns, and premium quality guaranteed.
						</p>
						<Button
							size="lg"
							className="mt-8 bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-10"
							asChild
						>
							<Link href="/products">
								Explore Collection
								<ArrowRight className="h-4 w-4 ml-2" />
							</Link>
						</Button>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
