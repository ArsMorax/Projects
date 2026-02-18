import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ChevronRight, Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        slug: string;
        images: { path: string }[];
    } | null;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    notes: string | null;
    created_at: string;
    order_items: OrderItem[];
}

interface Props {
    order: Order;
}

const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderShow({ order }: Props) {
    const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
    const isCancelled = order.status === "cancelled";

    return (
        <MainLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8">
                    <Link href={route("orders.index")} className="hover:text-neutral-900 transition-colors">My Orders</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-neutral-900 font-medium">{order.order_number}</span>
                </nav>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-xl font-bold">{order.order_number}</h1>
                            <p className="text-sm text-neutral-500 mt-1">Placed on {formatDate(order.created_at)}</p>
                        </div>
                        {isCancelled ? (
                            <Badge variant="destructive" className="text-sm px-4 py-1.5">Cancelled</Badge>
                        ) : (
                            <Badge variant="success" className="text-sm px-4 py-1.5">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        )}
                    </div>

                    {!isCancelled && (
                        <div className="relative mb-8">
                            <div className="flex justify-between">
                                {statusSteps.map((step, i) => {
                                    const isCompleted = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;
                                    return (
                                        <div key={step.key} className="flex flex-col items-center relative z-10">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                                                    isCompleted
                                                        ? "bg-neutral-900 text-white"
                                                        : "bg-neutral-100 text-neutral-400"
                                                } ${isCurrent ? "ring-4 ring-neutral-200" : ""}`}
                                            >
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            <span className={`text-xs font-medium text-center ${
                                                isCompleted ? "text-neutral-900" : "text-neutral-400"
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-100 -z-0">
                                <div
                                    className="h-full bg-neutral-900 transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-xl border border-neutral-200 bg-white p-6"
                        >
                            <h2 className="font-semibold text-lg mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                                            {item.product?.images?.[0]?.path ? (
                                                <img
                                                    src={item.product.images[0].path}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-neutral-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {item.product ? (
                                                <Link
                                                    href={route("products.show", item.product.slug)}
                                                    className="font-medium text-sm hover:text-neutral-600 transition-colors"
                                                >
                                                    {item.product_name}
                                                </Link>
                                            ) : (
                                                <p className="font-medium text-sm">{item.product_name}</p>
                                            )}
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                {formatCurrency(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-sm shrink-0">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Shipping</span>
                                    <span>{order.shipping_cost === 0 ? <span className="text-green-600">Free</span> : formatCurrency(order.shipping_cost)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Tax</span>
                                    <span>{formatCurrency(order.tax)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base pt-1">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-xl border border-neutral-200 bg-white p-6"
                        >
                            <h2 className="font-semibold mb-4">Shipping Address</h2>
                            <div className="text-sm space-y-1 text-neutral-600">
                                <p className="font-medium text-neutral-900">{order.shipping_name}</p>
                                <p>{order.shipping_phone}</p>
                                <p>{order.shipping_address}</p>
                                <p>{order.shipping_city}, {order.shipping_postal_code}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-xl border border-neutral-200 bg-white p-6"
                        >
                            <h2 className="font-semibold mb-4">Payment</h2>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Method</span>
                                    <span className="font-medium capitalize">{order.payment_method.replace("_", " ")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Status</span>
                                    <span className={`font-medium capitalize ${
                                        order.payment_status === "paid" ? "text-green-600" :
                                        order.payment_status === "failed" ? "text-red-600" : "text-yellow-600"
                                    }`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {order.notes && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="rounded-xl border border-neutral-200 bg-white p-6"
                            >
                                <h2 className="font-semibold mb-2">Order Notes</h2>
                                <p className="text-sm text-neutral-600">{order.notes}</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <Link href={route("orders.index")}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Button>
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
