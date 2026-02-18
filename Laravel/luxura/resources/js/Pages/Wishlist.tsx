import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface WishlistItem {
    id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        compare_price: number | null;
        stock: number;
        rating: number;
        brand: string | null;
        images: { path: string }[];
    };
}

interface Props {
    wishlists: WishlistItem[];
}

export default function Wishlist({ wishlists }: Props) {
    const removeFromWishlist = (productId: number) => {
        router.post(route("wishlist.toggle"), { product_id: productId }, { preserveScroll: true });
    };

    const addToCart = (productId: number) => {
        router.post(route("cart.store"), { product_id: productId, quantity: 1 });
    };

    return (
        <MainLayout>
            <Head title="Wishlist" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold tracking-tight mb-8"
                >
                    My Wishlist
                </motion.h1>

                {wishlists.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <Heart className="h-16 w-16 mx-auto text-neutral-200 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                        <p className="text-neutral-500 mb-6">Save products you love for later.</p>
                        <Link href={route("products.index")}>
                            <Button>Browse Products</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {wishlists.map((item, i) => {
                                const product = item.product;
                                const hasDiscount = product.compare_price && product.compare_price > product.price;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group rounded-xl border border-neutral-200 bg-white overflow-hidden"
                                    >
                                        <Link href={route("products.show", product.slug)} className="block">
                                            <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                                                <img
                                                    src={product.images[0]?.path}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {hasDiscount && (
                                                    <Badge className="absolute top-3 left-3 bg-red-600 text-white border-0">
                                                        -{Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}%
                                                    </Badge>
                                                )}
                                                {product.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-4 space-y-2">
                                            {product.brand && (
                                                <p className="text-xs text-neutral-400 uppercase tracking-wider">{product.brand}</p>
                                            )}
                                            <Link href={route("products.show", product.slug)}>
                                                <h3 className="font-semibold text-sm line-clamp-2 hover:text-neutral-600 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, j) => (
                                                    <Star
                                                        key={j}
                                                        className={`h-3 w-3 ${
                                                            j < Math.round(product.rating)
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-neutral-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold">{formatCurrency(product.price)}</span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-neutral-400 line-through">
                                                        {formatCurrency(product.compare_price!)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                {product.stock > 0 && (
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 text-xs"
                                                        onClick={() => addToCart(product.id)}
                                                    >
                                                        <ShoppingCart className="h-3 w-3 mr-1" />
                                                        Add to Cart
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() => removeFromWishlist(product.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
