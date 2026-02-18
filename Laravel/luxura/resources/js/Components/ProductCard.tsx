import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import { router } from "@inertiajs/react";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const image = product.primary_image?.path || product.images?.[0]?.path;
    const hasDiscount = product.compare_price && product.compare_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
        : 0;

    const addToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route("cart.store"), {
            product_id: product.id,
            quantity: 1,
        });
    };

    return (
        <Link href={route("products.show", product.slug)} className="group block">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <ShoppingCart className="h-12 w-12" />
                    </div>
                )}

                {hasDiscount && (
                    <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0">
                        -{discountPercent}%
                    </Badge>
                )}

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
                    </div>
                )}

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.stock > 0 && (
                        <Button
                            size="icon"
                            className="rounded-full shadow-lg h-10 w-10"
                            onClick={addToCart}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-xs text-neutral-400 uppercase tracking-wider">
                    {product.category?.name || product.brand}
                </p>
                <h3 className="font-medium text-sm group-hover:text-neutral-600 transition-colors line-clamp-1">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${
                                    i < Math.round(product.rating)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-neutral-200"
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-neutral-400">({product.reviews_count})</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <span className="font-semibold text-sm">{formatCurrency(product.price)}</span>
                    {hasDiscount && (
                        <span className="text-xs text-neutral-400 line-through">
                            {formatCurrency(product.compare_price!)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
