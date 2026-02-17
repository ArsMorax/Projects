"use client";

import Link from "next/link";
import {
	CheckCircle,
	Package,
	Truck,
	ArrowLeft,
	MapPin,
	CreditCard,
	Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";
import { formatPrice } from "~/lib/utils";
import { useToast } from "~/components/toast-provider";

interface OrderDetailPageProps {
	id: string;
}

const statusSteps = [
	{ key: "processing", label: "Confirmed", icon: CheckCircle },
	{ key: "shipped", label: "Shipped", icon: Truck },
	{ key: "delivered", label: "Delivered", icon: Package },
];

export function OrderDetailPage({ id }: OrderDetailPageProps) {
	const { toast } = useToast();
	const { data: order, isLoading } = api.order.getById.useQuery({ id });

	const copyOrderId = () => {
		void navigator.clipboard.writeText(id);
		toast("Order ID copied to clipboard");
	};

	if (isLoading || !order) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-12">
				<div className="space-y-4 animate-pulse">
					<div className="h-8 w-48 bg-neutral-100 rounded" />
					<div className="h-4 w-32 bg-neutral-100 rounded" />
					<div className="h-64 bg-neutral-100 rounded-xl mt-8" />
				</div>
			</div>
		);
	}

	const currentStep =
		order.status === "delivered"
			? 3
			: order.status === "shipped"
				? 2
				: 1;

	return (
		<div className="bg-neutral-50 min-h-screen">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-start justify-between mb-8">
					<div className="flex items-center gap-4">
						<Link href="/orders">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</Link>
						<div>
							<div className="flex items-center gap-3">
								<h1 className="text-2xl font-bold text-neutral-900">
									Order Confirmed
								</h1>
								<CheckCircle className="h-6 w-6 text-emerald-500" />
							</div>
							<div className="flex items-center gap-2 mt-1">
								<p className="text-sm text-neutral-500 font-mono">
									#{order.id.slice(-8).toUpperCase()}
								</p>
								<button
									onClick={copyOrderId}
									className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
								>
									<Copy className="h-3.5 w-3.5" />
								</button>
							</div>
						</div>
					</div>
					<Badge variant="success">
						{order.paymentStatus === "paid" ? "Paid" : order.paymentStatus}
					</Badge>
				</div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<Card className="mb-8">
						<CardContent className="p-8">
							<div className="flex items-center justify-between relative">
								<div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
									<motion.div
										className="h-full bg-emerald-500"
										initial={{ width: "0%" }}
										animate={{
											width: `${((currentStep - 1) / (statusSteps.length - 1)) * 100}%`,
										}}
										transition={{ duration: 0.8, delay: 0.3 }}
									/>
								</div>

								{statusSteps.map((step, i) => {
									const isCompleted = i < currentStep;
									const isCurrent = i === currentStep - 1;
									return (
										<div
											key={step.key}
											className="relative flex flex-col items-center"
										>
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: 0.2 + i * 0.15 }}
												className={`h-10 w-10 rounded-full flex items-center justify-center ${
													isCompleted
														? "bg-emerald-500 text-white"
														: "bg-neutral-200 text-neutral-400"
												}`}
											>
												<step.icon className="h-5 w-5" />
											</motion.div>
											<p
												className={`text-xs mt-2 font-medium ${
													isCompleted
														? "text-emerald-600"
														: "text-neutral-400"
												}`}
											>
												{step.label}
											</p>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<motion.div
						className="lg:col-span-2"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Order Items</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{order.items.map((item) => (
									<div
										key={item.id}
										className="flex items-center gap-4"
									>
										<div className="h-16 w-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
											<img
												src={item.image}
												alt={item.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<Link
												href={`/products/${item.product.slug}`}
												className="text-sm font-medium hover:text-brand-700 transition-colors"
											>
												{item.name}
											</Link>
											<p className="text-xs text-neutral-500">
												Qty: {item.quantity} × {formatPrice(item.price)}
											</p>
										</div>
										<p className="text-sm font-semibold">
											{formatPrice(item.price * item.quantity)}
										</p>
									</div>
								))}

								<Separator className="my-4" />

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-neutral-500">Subtotal</span>
										<span>{formatPrice(order.subtotal)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-500">Tax</span>
										<span>{formatPrice(order.tax)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-neutral-500">Shipping</span>
										<span>
											{order.shipping === 0
												? "Free"
												: formatPrice(order.shipping)}
										</span>
									</div>
									<Separator />
									<div className="flex justify-between font-bold text-base">
										<span>Total</span>
										<span>{formatPrice(order.total)}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
					<motion.div
						className="space-y-6"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="text-sm flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									Shipping Address
								</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-neutral-600 space-y-1">
								<p className="font-medium text-neutral-900">
									{order.shippingName}
								</p>
								<p>{order.shippingAddress}</p>
								<p>
									{order.shippingCity}, {order.shippingState}{" "}
									{order.shippingZip}
								</p>
								<p>{order.shippingCountry}</p>
								<p className="text-neutral-500">{order.shippingEmail}</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-sm flex items-center gap-2">
									<CreditCard className="h-4 w-4" />
									Payment
								</CardTitle>
							</CardHeader>
							<CardContent className="text-sm text-neutral-600 space-y-1">
								<p className="capitalize">
									{order.paymentMethod === "card"
										? "Credit Card"
										: "PayPal"}
								</p>
								{order.transactionId && (
									<p className="text-xs font-mono text-neutral-400">
										{order.transactionId}
									</p>
								)}
								<Badge variant="success" className="mt-2">
									Payment Successful
								</Badge>
							</CardContent>
						</Card>

						<Button className="w-full" variant="outline" asChild>
							<Link href="/products">Continue Shopping</Link>
						</Button>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
