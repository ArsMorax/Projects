"use client";

import { useRouter } from "next/navigation";
import {
	CreditCard,
	Lock,
	ShieldCheck,
	Truck,
	ArrowLeft,
	Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { formatPrice } from "~/lib/utils";
import { useToast } from "~/components/toast-provider";

export function CheckoutPage() {
	const router = useRouter();
	const { toast } = useToast();
	const cartQuery = api.cart.get.useQuery();

	const [form, setForm] = React.useState({
		shippingName: "",
		shippingEmail: "",
		shippingAddress: "",
		shippingCity: "",
		shippingState: "",
		shippingZip: "",
		shippingCountry: "US",
		paymentMethod: "card" as "card" | "paypal",
		cardNumber: "",
		cardExpiry: "",
		cardCvc: "",
	});

	const createOrder = api.order.create.useMutation({
		onSuccess: (order) => {
			toast("Order placed successfully!");
			router.push(`/orders/${order.id}`);
		},
		onError: (err) => {
			toast(err.message, "error");
		},
	});

	const updateField = (field: string, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createOrder.mutate(form);
	};

	const items = cartQuery.data?.items ?? [];
	const subtotal = cartQuery.data?.subtotal ?? 0;
	const tax = Math.round(subtotal * 0.08 * 100) / 100;
	const shipping = subtotal > 100 ? 0 : 9.99;
	const total = Math.round((subtotal + tax + shipping) * 100) / 100;

	if (cartQuery.isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-20 text-center">
				<h1 className="text-2xl font-bold text-neutral-900">
					Your cart is empty
				</h1>
				<p className="text-neutral-500 mt-2">
					Add some items before checking out.
				</p>
				<Button className="mt-6" asChild>
					<Link href="/products">Continue Shopping</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-neutral-50 min-h-screen">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center gap-4 mb-8">
					<Link href="/products">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-5 w-5" />
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-neutral-900">Checkout</h1>
						<p className="text-sm text-neutral-500">
							Complete your order securely
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<Truck className="h-5 w-5" />
											Shipping Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="name">Full Name</Label>
												<Input
													id="name"
													placeholder="John Doe"
													value={form.shippingName}
													onChange={(e) =>
														updateField("shippingName", e.target.value)
													}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="email">Email</Label>
												<Input
													id="email"
													type="email"
													placeholder="john@example.com"
													value={form.shippingEmail}
													onChange={(e) =>
														updateField("shippingEmail", e.target.value)
													}
													required
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="address">Address</Label>
											<Input
												id="address"
												placeholder="123 Main Street, Apt 4"
												value={form.shippingAddress}
												onChange={(e) =>
													updateField("shippingAddress", e.target.value)
												}
												required
											/>
										</div>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
											<div className="space-y-2 col-span-2 sm:col-span-1">
												<Label htmlFor="city">City</Label>
												<Input
													id="city"
													placeholder="New York"
													value={form.shippingCity}
													onChange={(e) =>
														updateField("shippingCity", e.target.value)
													}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="state">State</Label>
												<Input
													id="state"
													placeholder="NY"
													value={form.shippingState}
													onChange={(e) =>
														updateField("shippingState", e.target.value)
													}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="zip">ZIP Code</Label>
												<Input
													id="zip"
													placeholder="10001"
													value={form.shippingZip}
													onChange={(e) =>
														updateField("shippingZip", e.target.value)
													}
													required
												/>
											</div>
											<div className="space-y-2">
												<Label>Country</Label>
												<Select
													value={form.shippingCountry}
													onValueChange={(v) =>
														updateField("shippingCountry", v)
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="US">United States</SelectItem>
														<SelectItem value="CA">Canada</SelectItem>
														<SelectItem value="UK">United Kingdom</SelectItem>
														<SelectItem value="AU">Australia</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.1 }}
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<CreditCard className="h-5 w-5" />
											Payment Method
											<Badge variant="secondary" className="ml-auto text-[10px]">
												TEST MODE
											</Badge>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-3">
											<button
												type="button"
												onClick={() =>
													updateField("paymentMethod", "card")
												}
												className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
													form.paymentMethod === "card"
														? "border-neutral-900 bg-neutral-50"
														: "border-neutral-200 hover:border-neutral-300"
												}`}
											>
												<CreditCard className="h-5 w-5 mb-2" />
												<p className="text-sm font-semibold">Credit Card</p>
												<p className="text-xs text-neutral-500">
													Visa, Mastercard, Amex
												</p>
											</button>
											<button
												type="button"
												onClick={() =>
													updateField("paymentMethod", "paypal")
												}
												className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
													form.paymentMethod === "paypal"
														? "border-neutral-900 bg-neutral-50"
														: "border-neutral-200 hover:border-neutral-300"
												}`}
											>
												<div className="h-5 w-12 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center mb-2">
													PayPal
												</div>
												<p className="text-sm font-semibold">PayPal</p>
												<p className="text-xs text-neutral-500">
													Pay with PayPal
												</p>
											</button>
										</div>

										{form.paymentMethod === "card" && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												transition={{ duration: 0.2 }}
												className="space-y-4"
											>
												<div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
													<p className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
														<ShieldCheck className="h-3.5 w-3.5" />
														This is a test payment gateway. No real charges
														will be made. Use any card number.
													</p>
												</div>
												<div className="space-y-2">
													<Label htmlFor="cardNumber">Card Number</Label>
													<Input
														id="cardNumber"
														placeholder="4242 4242 4242 4242"
														value={form.cardNumber}
														onChange={(e) =>
															updateField("cardNumber", e.target.value)
														}
														maxLength={19}
													/>
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="expiry">Expiry Date</Label>
														<Input
															id="expiry"
															placeholder="MM/YY"
															value={form.cardExpiry}
															onChange={(e) =>
																updateField("cardExpiry", e.target.value)
															}
															maxLength={5}
														/>
													</div>
													<div className="space-y-2">
														<Label htmlFor="cvc">CVC</Label>
														<Input
															id="cvc"
															placeholder="123"
															value={form.cardCvc}
															onChange={(e) =>
																updateField("cardCvc", e.target.value)
															}
															maxLength={4}
														/>
													</div>
												</div>
											</motion.div>
										)}

										{form.paymentMethod === "paypal" && (
											<div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
												<p className="text-xs text-blue-800 font-medium">
													You will be redirected to PayPal to complete the
													payment (simulated in test mode).
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						</div>
						<div className="lg:col-span-1">
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.2 }}
							>
								<Card className="sticky top-24">
									<CardHeader>
										<CardTitle className="text-lg">Order Summary</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{items.map((item) => (
											<div
												key={item.id}
												className="flex items-center gap-3"
											>
												<div className="h-14 w-14 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
													<img
														src={item.product.image}
														alt={item.product.name}
														className="h-full w-full object-cover"
													/>
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{item.product.name}
													</p>
													<p className="text-xs text-neutral-500">
														Qty: {item.quantity}
													</p>
												</div>
												<p className="text-sm font-semibold">
													{formatPrice(item.product.price * item.quantity)}
												</p>
											</div>
										))}

										<Separator />

										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-neutral-500">Subtotal</span>
												<span>{formatPrice(subtotal)}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-neutral-500">
													Tax (8%)
												</span>
												<span>{formatPrice(tax)}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-neutral-500">Shipping</span>
												<span>
													{shipping === 0
														? "Free"
														: formatPrice(shipping)}
												</span>
											</div>
										</div>

										<Separator />

										<div className="flex justify-between items-center">
											<span className="font-bold text-lg">Total</span>
											<span className="font-bold text-xl">
												{formatPrice(total)}
											</span>
										</div>

										<Button
											type="submit"
											size="lg"
											className="w-full gap-2"
											disabled={createOrder.isPending}
										>
											{createOrder.isPending ? (
												<>
													<Loader2 className="h-4 w-4 animate-spin" />
													Processing Payment...
												</>
											) : (
												<>
													<Lock className="h-4 w-4" />
													Place Order — {formatPrice(total)}
												</>
											)}
										</Button>

										<p className="text-[10px] text-neutral-400 text-center leading-relaxed">
											By placing this order, you agree to our Terms of Service
											and Privacy Policy. This is a test payment — no real
											charges will be made.
										</p>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
