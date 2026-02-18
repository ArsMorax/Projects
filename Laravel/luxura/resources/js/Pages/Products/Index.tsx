import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import ProductCard from "@/Components/ProductCard";
import type { Product, Category, PaginatedData, PageProps } from "@/types";

interface Props extends PageProps {
    products: PaginatedData<Product>;
    categories: Category[];
    brands: string[];
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
    };
}

export default function ProductsIndex({ products, categories, brands, filters }: Props) {
    const [animationParent] = useAutoAnimate();
    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = (key: string, value: string | undefined) => {
        const newFilters = { ...filters, [key]: value };
        Object.keys(newFilters).forEach((k) => {
            if (!newFilters[k as keyof typeof newFilters]) {
                delete newFilters[k as keyof typeof newFilters];
            }
        });
        router.get(route("products.index"), newFilters, { preserveState: true });
    };

    const clearFilters = () => {
        router.get(route("products.index"));
    };

    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <MainLayout>
            <Head title="Products" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-neutral-500 mt-1">
                        {products.total} product{products.total !== 1 ? "s" : ""} found
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4 lg:hidden">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                            <div>
                                <h3 className="font-semibold text-sm mb-3">Category</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => updateFilter("category", undefined)}
                                        className={`block text-sm py-1.5 px-2 rounded w-full text-left transition-colors ${
                                            !filters.category ? "bg-neutral-100 font-medium" : "text-neutral-600 hover:bg-neutral-50"
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => updateFilter("category", String(cat.id))}
                                            className={`block text-sm py-1.5 px-2 rounded w-full text-left transition-colors ${
                                                filters.category === String(cat.id)
                                                    ? "bg-neutral-100 font-medium"
                                                    : "text-neutral-600 hover:bg-neutral-50"
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {brands.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-3">Brand</h3>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => updateFilter("brand", undefined)}
                                            className={`block text-sm py-1.5 px-2 rounded w-full text-left transition-colors ${
                                                !filters.brand ? "bg-neutral-100 font-medium" : "text-neutral-600 hover:bg-neutral-50"
                                            }`}
                                        >
                                            All Brands
                                        </button>
                                        {brands.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => updateFilter("brand", brand)}
                                                className={`block text-sm py-1.5 px-2 rounded w-full text-left transition-colors ${
                                                    filters.brand === brand
                                                        ? "bg-neutral-100 font-medium"
                                                        : "text-neutral-600 hover:bg-neutral-50"
                                                }`}
                                            >
                                                {brand}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-sm mb-3">Price Range</h3>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Min"
                                        type="number"
                                        value={filters.min_price || ""}
                                        onChange={(e) => updateFilter("min_price", e.target.value || undefined)}
                                        className="text-sm"
                                    />
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        value={filters.max_price || ""}
                                        onChange={(e) => updateFilter("max_price", e.target.value || undefined)}
                                        className="text-sm"
                                    />
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                                    <X className="h-4 w-4 mr-1" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-2">
                                    {filters.search && (
                                        <Badge variant="secondary" className="gap-1">
                                            Search: {filters.search}
                                            <button onClick={() => updateFilter("search", undefined)}>
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            <div className="ml-auto">
                                <Select
                                    value={filters.sort || "latest"}
                                    onValueChange={(value) => updateFilter("sort", value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Latest</SelectItem>
                                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="popular">Popular</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div ref={animationParent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.data.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <p className="text-neutral-400 text-lg">No products found.</p>
                                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </motion.div>
                        )}

                        {products.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                {products.links.map((link, i) => {
                                    if (i === 0) {
                                        return (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                size="icon"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                        );
                                    }
                                    if (i === products.links.length - 1) {
                                        return (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                size="icon"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={i}
                                            variant={link.active ? "default" : "outline"}
                                            size="icon"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                        >
                                            {link.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
