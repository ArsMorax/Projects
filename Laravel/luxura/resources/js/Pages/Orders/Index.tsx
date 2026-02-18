import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Package, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total: number;
    items_count?: number;
    created_at: string;
    order_items?: { id: number }[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    orders: {
        data: Order[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-neutral-100 text-neutral-700",
};

export default function OrdersIndex({ orders }: Props) {
    return (
        <MainLayout>
            <Head title="My Orders" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold tracking-tight mb-8"
                >
                    My Orders
                </motion.h1>

                {orders.data.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <Package className="h-16 w-16 mx-auto text-neutral-200 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-neutral-500 mb-6">Start shopping to see your orders here.</p>
                        <Link href={route("products.index")}>
                            <Button>Browse Products</Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order, i) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={route("orders.show", order.id)}
                                    className="block rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 hover:border-neutral-300 hover:shadow-sm transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <p className="font-semibold">{order.order_number}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-neutral-100 text-neutral-600"}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-neutral-500">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentColors[order.payment_status] || "bg-neutral-100 text-neutral-600"}`}>
                                                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                                </span>
                                                <p className="font-semibold mt-1">{formatCurrency(order.total)}</p>
                                            </div>
                                            <Eye className="h-5 w-5 text-neutral-400" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {orders.last_page > 1 && (
                            <div className="flex justify-center gap-2 pt-6">
                                {orders.links.map((link, i) => {
                                    if (!link.url) return null;
                                    const isArrow = i === 0 || i === orders.links.length - 1;
                                    return (
                                        <Link key={i} href={link.url}>
                                            <Button
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                className="min-w-[36px]"
                                            >
                                                {isArrow && i === 0 && <ChevronLeft className="h-4 w-4" />}
                                                {!isArrow && <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                                                {isArrow && i !== 0 && <ChevronRight className="h-4 w-4" />}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
