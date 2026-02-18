import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Lock, ChevronRight, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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
        images: { path: string }[];
    };
}

interface Props {
    cart: {
        items: CartItem[];
        total: number;
    };
}

export default function Checkout({ cart }: Props) {
    const items = cart?.items || [];
    const subtotal = cart?.total || 0;
    const shipping = subtotal > 500000 ? 0 : 25000;
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + shipping + tax;

    const form = useForm({
        shipping_name: "",
        shipping_phone: "",
        shipping_address: "",
        shipping_city: "",
        shipping_postal_code: "",
        payment_method: "bank_transfer",
        notes: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route("checkout.store"));
    };

    return (
        <MainLayout>
            <Head title="Checkout" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                    <Link href={route("cart.index")} className="hover:text-neutral-900 transition-colors">Cart</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-neutral-900 font-medium">Checkout</span>
                </nav>

                <form onSubmit={submit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl border border-neutral-200 bg-white p-6"
                            >
                                <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_name">Full Name *</Label>
                                        <Input
                                            id="shipping_name"
                                            value={form.data.shipping_name}
                                            onChange={(e) => form.setData("shipping_name", e.target.value)}
                                            placeholder="John Doe"
                                        />
                                        {form.errors.shipping_name && (
                                            <p className="text-red-600 text-xs">{form.errors.shipping_name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_phone">Phone Number *</Label>
                                        <Input
                                            id="shipping_phone"
                                            value={form.data.shipping_phone}
                                            onChange={(e) => form.setData("shipping_phone", e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                        />
                                        {form.errors.shipping_phone && (
                                            <p className="text-red-600 text-xs">{form.errors.shipping_phone}</p>
                                        )}
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label htmlFor="shipping_address">Address *</Label>
                                        <Input
                                            id="shipping_address"
                                            value={form.data.shipping_address}
                                            onChange={(e) => form.setData("shipping_address", e.target.value)}
                                            placeholder="Jl. Contoh No. 123"
                                        />
                                        {form.errors.shipping_address && (
                                            <p className="text-red-600 text-xs">{form.errors.shipping_address}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_city">City *</Label>
                                        <Input
                                            id="shipping_city"
                                            value={form.data.shipping_city}
                                            onChange={(e) => form.setData("shipping_city", e.target.value)}
                                            placeholder="Jakarta"
                                        />
                                        {form.errors.shipping_city && (
                                            <p className="text-red-600 text-xs">{form.errors.shipping_city}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_postal_code">Postal Code *</Label>
                                        <Input
                                            id="shipping_postal_code"
                                            value={form.data.shipping_postal_code}
                                            onChange={(e) => form.setData("shipping_postal_code", e.target.value)}
                                            placeholder="12345"
                                        />
                                        {form.errors.shipping_postal_code && (
                                            <p className="text-red-600 text-xs">{form.errors.shipping_postal_code}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-xl border border-neutral-200 bg-white p-6"
                            >
                                <h2 className="text-lg font-semibold mb-6">Payment Method</h2>
                                <div className="space-y-3">
                                    {[
                                        { value: "bank_transfer", label: "Bank Transfer", icon: Banknote, desc: "Transfer to our bank account" },
                                        { value: "credit_card", label: "Credit Card", icon: CreditCard, desc: "Pay with Visa / Mastercard" },
                                    ].map((method) => (
                                        <label
                                            key={method.value}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                form.data.payment_method === method.value
                                                    ? "border-neutral-900 bg-neutral-50"
                                                    : "border-neutral-200 hover:border-neutral-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={form.data.payment_method === method.value}
                                                onChange={(e) => form.setData("payment_method", e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                form.data.payment_method === method.value
                                                    ? "border-neutral-900"
                                                    : "border-neutral-300"
                                            }`}>
                                                {form.data.payment_method === method.value && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                                                )}
                                            </div>
                                            <method.icon className="h-5 w-5 text-neutral-600" />
                                            <div>
                                                <p className="font-medium text-sm">{method.label}</p>
                                                <p className="text-xs text-neutral-400">{method.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="rounded-xl border border-neutral-200 bg-white p-6"
                            >
                                <h2 className="text-lg font-semibold mb-4">Order Notes (Optional)</h2>
                                <Input
                                    value={form.data.notes}
                                    onChange={(e) => form.setData("notes", e.target.value)}
                                    placeholder="Special delivery instructions..."
                                />
                            </motion.div>
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

                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                                                <img
                                                    src={item.product.images[0]?.path}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                                <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-medium shrink-0">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Shipping</span>
                                        <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatCurrency(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Tax (11%)</span>
                                        <span>{formatCurrency(tax)}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={form.processing}
                                >
                                    <Lock className="h-4 w-4 mr-2" />
                                    {form.processing ? "Processing..." : "Place Order"}
                                </Button>

                                <p className="text-xs text-neutral-400 text-center">
                                    By placing your order, you agree to our terms and conditions.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
