"use client";

import Link from "next/link";
import { Package, ChevronRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { formatPrice } from "~/lib/utils";

const statusColors: Record<string, string> = {
	pending: "bg-amber-100 text-amber-800",
	processing: "bg-blue-100 text-blue-800",
	shipped: "bg-purple-100 text-purple-800",
	delivered: "bg-emerald-100 text-emerald-800",
	cancelled: "bg-red-100 text-red-800",
};

export function OrdersPage() {
	const ordersQuery = api.order.getAll.useQuery();

	return (
		<div className="bg-white min-h-screen">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
					<p className="text-sm text-neutral-500 mt-1">
						Track and manage your orders
					</p>
				</motion.div>

				<div className="mt-8 space-y-4">
					{ordersQuery.data?.map((order, i) => (
						<motion.div
							key={order.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05, duration: 0.3 }}
						>
							<Card className="hover:shadow-md transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div>
											<div className="flex items-center gap-3">
												<Package className="h-5 w-5 text-neutral-400" />
												<p className="text-sm font-mono text-neutral-500">
													#{order.id.slice(-8).toUpperCase()}
												</p>
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status] ?? "bg-neutral-100 text-neutral-800"}`}
												>
													{order.status.charAt(0).toUpperCase() +
														order.status.slice(1)}
												</span>
											</div>
											<p className="text-xs text-neutral-400 mt-1">
												{new Date(order.createdAt).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
													},
												)}
											</p>
										</div>
										<div className="text-right">
											<p className="text-lg font-bold">
												{formatPrice(order.total)}
											</p>
											<p className="text-xs text-neutral-500">
												{order.items.length} item
												{order.items.length > 1 ? "s" : ""}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2 mt-4">
										{order.items.slice(0, 4).map((item) => (
											<div
												key={item.id}
												className="h-12 w-12 rounded-lg bg-neutral-100 overflow-hidden"
											>
												<img
													src={item.image}
													alt={item.name}
													className="h-full w-full object-cover"
												/>
											</div>
										))}
										{order.items.length > 4 && (
											<div className="h-12 w-12 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
												+{order.items.length - 4}
											</div>
										)}
										<div className="ml-auto">
											<Link href={`/orders/${order.id}`}>
												<Button variant="ghost" size="sm" className="gap-1">
													View Details
													<ChevronRight className="h-3.5 w-3.5" />
												</Button>
											</Link>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}

					{ordersQuery.data?.length === 0 && (
						<div className="text-center py-20">
							<Package className="h-16 w-16 text-neutral-200 mx-auto" />
							<p className="text-neutral-500 mt-4">No orders yet</p>
							<Button className="mt-4" asChild>
								<Link href="/products">Start Shopping</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
