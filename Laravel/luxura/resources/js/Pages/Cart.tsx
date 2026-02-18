import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        images: { path: string }[];
        brand: string | null;
    };
}

interface Props {
    cart: {
        id: number;
        items: CartItem[];
        total: number;
        items_count: number;
    } | null;
}

export default function Cart({ cart }: Props) {
    const items = cart?.items || [];
    const total = cart?.total || 0;

    const updateQuantity = (itemId: number, quantity: number) => {
        router.put(route("cart.update", itemId), { quantity }, { preserveScroll: true });
    };

    const removeItem = (itemId: number) => {
        router.delete(route("cart.destroy", itemId), { preserveScroll: true });
    };

    const shipping = total > 500000 ? 0 : 25000;
    const tax = Math.round(total * 0.11);
    const grandTotal = total + shipping + tax;

    return (
        <MainLayout>
            <Head title="Shopping Cart" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold tracking-tight mb-8"
                >
                    Shopping Cart
                </motion.h1>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <ShoppingBag className="h-16 w-16 mx-auto text-neutral-200 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-neutral-500 mb-6">Start shopping to add items to your cart.</p>
                        <Link href={route("products.index")}>
                            <Button>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Browse Products
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {items.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl border border-neutral-200 bg-white"
                                    >
                                        <Link href={route("products.show", item.product.slug)} className="shrink-0">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-neutral-100">
                                                <img
                                                    src={item.product.images[0]?.path}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </Link>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    {item.product.brand && (
                                                        <p className="text-xs text-neutral-400 uppercase tracking-wider">
                                                            {item.product.brand}
                                                        </p>
                                                    )}
                                                    <Link
                                                        href={route("products.show", item.product.slug)}
                                                        className="font-semibold text-sm sm:text-base hover:text-neutral-600 transition-colors line-clamp-2"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-neutral-400 hover:text-red-600 shrink-0"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <p className="text-sm text-neutral-500 mt-1">
                                                {formatCurrency(item.price)} each
                                            </p>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-neutral-300 rounded-lg">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-r-none"
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-l-none"
                                                        onClick={() =>
                                                            updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <p className="font-semibold text-sm sm:text-base">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:sticky lg:top-24 h-fit"
                        >
                            <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
                                <h2 className="font-semibold text-lg">Order Summary</h2>
                                <Separator />

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Subtotal ({items.length} items)</span>
                                        <span className="font-medium">{formatCurrency(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? (
                                                <span className="text-green-600">Free</span>
                                            ) : (
                                                formatCurrency(shipping)
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Tax (11%)</span>
                                        <span className="font-medium">{formatCurrency(tax)}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(grandTotal)}</span>
                                </div>

                                {shipping > 0 && (
                                    <p className="text-xs text-neutral-400">
                                        Free shipping on orders over {formatCurrency(500000)}
                                    </p>
                                )}

                                <Link href={route("checkout.index")} className="block">
                                    <Button size="lg" className="w-full">
                                        Proceed to Checkout
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>

                                <Link
                                    href={route("products.index")}
                                    className="block text-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
