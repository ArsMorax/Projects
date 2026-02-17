"use client";

import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface ProductsPageProps {
	isAuthenticated: boolean;
}

export function ProductsPage({ isAuthenticated }: ProductsPageProps) {
	const searchParams = useSearchParams();
	const categoryParam = searchParams.get("category");
	const sortParam = searchParams.get("sort");

	const [search, setSearch] = React.useState("");
	const [sort, setSort] = React.useState(sortParam ?? "newest");
	const [selectedCategory, setSelectedCategory] = React.useState(
		categoryParam ?? "",
	);
	const [gridRef] = useAutoAnimate();

	const productsQuery = api.product.getAll.useQuery({
		categorySlug: selectedCategory || undefined,
		search: search || undefined,
		sort: sort as "newest" | "price-asc" | "price-desc" | "popular",
	});

	const categoriesQuery = api.product.getCategories.useQuery();

	return (
		<div className="bg-white min-h-screen">
			<div className="bg-neutral-50 border-b border-neutral-200">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<h1 className="text-2xl font-bold text-neutral-900">
							{selectedCategory
								? categoriesQuery.data?.find(
										(c) => c.slug === selectedCategory,
									)?.name ?? "Products"
								: "All Products"}
						</h1>
						<p className="text-sm text-neutral-500 mt-1">
							{productsQuery.data?.length ?? 0} products found
						</p>
					</motion.div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
					<div className="flex-1 w-full sm:max-w-xs">
						<Input
							placeholder="Search products..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="h-10"
						/>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<Button
							variant={selectedCategory === "" ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedCategory("")}
						>
							All
						</Button>
						{categoriesQuery.data?.map((cat) => (
							<Button
								key={cat.id}
								variant={
									selectedCategory === cat.slug ? "default" : "outline"
								}
								size="sm"
								onClick={() => setSelectedCategory(cat.slug)}
							>
								{cat.name}
							</Button>
						))}
					</div>
					<div className="ml-auto">
						<Select value={sort} onValueChange={setSort}>
							<SelectTrigger className="w-[160px] h-9">
								<SlidersHorizontal className="h-4 w-4 mr-2" />
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest</SelectItem>
								<SelectItem value="price-asc">Price: Low → High</SelectItem>
								<SelectItem value="price-desc">Price: High → Low</SelectItem>
								<SelectItem value="popular">Most Popular</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div
					ref={gridRef}
					className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
				>
					{productsQuery.data?.map((product, i) => (
						<ProductCard
							key={product.id}
							product={product}
							index={i}
							isAuthenticated={isAuthenticated}
						/>
					))}
				</div>

				{productsQuery.isLoading && (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								className="rounded-xl border border-neutral-200 overflow-hidden"
							>
								<div className="aspect-[4/5] bg-neutral-100 animate-pulse" />
								<div className="p-4 space-y-2">
									<div className="h-3 bg-neutral-100 rounded animate-pulse w-1/3" />
									<div className="h-4 bg-neutral-100 rounded animate-pulse w-2/3" />
									<div className="h-5 bg-neutral-100 rounded animate-pulse w-1/4 mt-3" />
								</div>
							</div>
						))}
					</div>
				)}

				{productsQuery.data?.length === 0 && !productsQuery.isLoading && (
					<div className="text-center py-20">
						<p className="text-neutral-500 text-lg">No products found</p>
						<p className="text-neutral-400 text-sm mt-1">
							Try adjusting your search or filters
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
