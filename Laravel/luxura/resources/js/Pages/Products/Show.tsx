import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronRight, Check, Truck, RotateCcw, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import ProductCard from "@/Components/ProductCard";
import { formatCurrency } from "@/lib/utils";
import type { Product, PageProps } from "@/types";

interface Props extends PageProps {
    product: Product & {
        images: { id: number; path: string; alt: string; is_primary: boolean }[];
        approved_reviews: {
            id: number;
            rating: number;
            comment: string;
            created_at: string;
            user: { id: number; name: string };
        }[];
    };
    relatedProducts: Product[];
    isWishlisted: boolean;
}

export default function ProductShow({ product, relatedProducts, isWishlisted }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const reviewForm = useForm({
        rating: 5,
        comment: "",
    });

    const hasDiscount = product.compare_price && product.compare_price > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
        : 0;

    const addToCart = () => {
        router.post(route("cart.store"), {
            product_id: product.id,
            quantity,
        });
    };

    const toggleWishlist = () => {
        router.post(route("wishlist.toggle"), {
            product_id: product.id,
        });
    };

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(route("reviews.store", product.id), {
            preserveScroll: true,
            onSuccess: () => reviewForm.reset(),
        });
    };

    const specs = typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications;

    return (
        <MainLayout>
            <Head title={product.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                    <Link href={route("home")} className="hover:text-neutral-900 transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href={route("products.index")} className="hover:text-neutral-900 transition-colors">Products</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={route("products.index", { category: product.category_id })}
                        className="hover:text-neutral-900 transition-colors"
                    >
                        {product.category?.name}
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-neutral-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={product.images[selectedImage]?.path}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage === i ? "border-neutral-900" : "border-transparent"
                                        }`}
                                    >
                                        <img src={img.path} alt={img.alt} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div>
                            {product.brand && (
                                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">{product.brand}</p>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>

                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < Math.round(product.rating)
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-neutral-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-neutral-500">
                                    {product.rating} ({product.reviews_count} reviews)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                            {hasDiscount && (
                                <>
                                    <span className="text-lg text-neutral-400 line-through">
                                        {formatCurrency(product.compare_price!)}
                                    </span>
                                    <Badge className="bg-red-600 text-white border-0">-{discountPercent}%</Badge>
                                </>
                            )}
                        </div>

                        <p className="text-neutral-600 leading-relaxed">{product.description}</p>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Availability:</span>
                                {product.stock > 0 ? (
                                    <Badge variant="success">
                                        <Check className="h-3 w-3 mr-1" />
                                        In Stock ({product.stock})
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive">Out of Stock</Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">SKU:</span>
                                <span className="text-sm text-neutral-500">{product.sku}</span>
                            </div>
                        </div>

                        {product.stock > 0 && (
                            <>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium">Quantity:</span>
                                    <div className="flex items-center border border-neutral-300 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-r-none"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center font-medium text-sm">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-l-none"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button size="lg" className="flex-1" onClick={addToCart}>
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                    </Button>
                                    {auth.user && (
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            onClick={toggleWishlist}
                                            className={isWishlisted ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                                        >
                                            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-600" : ""}`} />
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {[
                                { icon: Truck, label: "Free Shipping", sub: "Over Rp 500K" },
                                { icon: RotateCcw, label: "Easy Returns", sub: "30 Days" },
                                { icon: Shield, label: "Warranty", sub: "1 Year" },
                            ].map((item, i) => (
                                <div key={i} className="text-center p-3 rounded-lg bg-neutral-50">
                                    <item.icon className="h-5 w-5 mx-auto mb-1 text-neutral-600" />
                                    <p className="text-xs font-medium">{item.label}</p>
                                    <p className="text-xs text-neutral-400">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {specs && Object.keys(specs).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16"
                    >
                        <h2 className="text-xl font-bold mb-6">Specifications</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Object.entries(specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 px-4 rounded-lg bg-neutral-50">
                                    <span className="text-sm font-medium text-neutral-500">{key}</span>
                                    <span className="text-sm font-medium">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <h2 className="text-xl font-bold mb-6">
                        Reviews ({product.approved_reviews?.length || 0})
                    </h2>

                    {auth.user && (
                        <form onSubmit={submitReview} className="mb-8 p-6 rounded-xl border border-neutral-200">
                            <h3 className="font-semibold mb-4">Write a Review</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-2 block">Rating</Label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => reviewForm.setData("rating", star)}
                                            >
                                                <Star
                                                    className={`h-6 w-6 transition-colors ${
                                                        star <= reviewForm.data.rating
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-neutral-200"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2 block">Comment</Label>
                                    <Textarea
                                        placeholder="Share your experience..."
                                        value={reviewForm.data.comment}
                                        onChange={(e) => reviewForm.setData("comment", e.target.value)}
                                        rows={4}
                                    />
                                    {reviewForm.errors.comment && (
                                        <p className="text-red-600 text-sm mt-1">{reviewForm.errors.comment}</p>
                                    )}
                                </div>
                                <Button type="submit" disabled={reviewForm.processing}>
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-6">
                        {product.approved_reviews?.map((review) => (
                            <div key={review.id} className="p-5 rounded-xl border border-neutral-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center">
                                            <span className="text-sm font-semibold">{review.user.name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{review.user.name}</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${
                                                            i < review.rating
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-neutral-200"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-neutral-400">
                                        {new Date(review.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                            </div>
                        ))}

                        {(!product.approved_reviews || product.approved_reviews.length === 0) && (
                            <p className="text-neutral-400 text-center py-8">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </motion.div>

                {relatedProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16"
                    >
                        <h2 className="text-xl font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </MainLayout>
    );
}
