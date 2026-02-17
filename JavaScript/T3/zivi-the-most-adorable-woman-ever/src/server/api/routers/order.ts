import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";
import { generateTransactionId } from "~/lib/utils";

export const orderRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				shippingName: z.string().min(1, "Name is required"),
				shippingEmail: z.string().email("Valid email is required"),
				shippingAddress: z.string().min(1, "Address is required"),
				shippingCity: z.string().min(1, "City is required"),
				shippingState: z.string().min(1, "State is required"),
				shippingZip: z.string().min(1, "ZIP code is required"),
				shippingCountry: z.string().default("US"),
				paymentMethod: z.enum(["card", "paypal"]).default("card"),
				cardNumber: z.string().optional(),
				cardExpiry: z.string().optional(),
				cardCvc: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const cartItems = await ctx.db.cartItem.findMany({
				where: { userId: ctx.session.user.id },
				include: { product: true },
			});

			if (cartItems.length === 0) {
				throw new Error("Cart is empty");
			}

			for (const item of cartItems) {
				if (item.product.stock < item.quantity) {
					throw new Error(
						`Not enough stock for ${item.product.name}. Only ${item.product.stock} available.`,
					);
				}
			}

			const subtotal = cartItems.reduce(
				(sum, item) => sum + item.product.price * item.quantity,
				0,
			);
			const tax = Math.round(subtotal * 0.08 * 100) / 100;
			const shipping = subtotal > 100 ? 0 : 9.99;
			const total = Math.round((subtotal + tax + shipping) * 100) / 100;

			await new Promise((resolve) => setTimeout(resolve, 1500));
			const transactionId = generateTransactionId();

			const order = await ctx.db.$transaction(async (tx) => {
				const newOrder = await tx.order.create({
					data: {
						userId: ctx.session.user.id,
						status: "processing",
						subtotal,
						tax,
						shipping,
						total,
						shippingName: input.shippingName,
						shippingEmail: input.shippingEmail,
						shippingAddress: input.shippingAddress,
						shippingCity: input.shippingCity,
						shippingState: input.shippingState,
						shippingZip: input.shippingZip,
						shippingCountry: input.shippingCountry,
						paymentMethod: input.paymentMethod,
						paymentStatus: "paid",
						transactionId,
						items: {
							create: cartItems.map((item) => ({
								productId: item.product.id,
								quantity: item.quantity,
								price: item.product.price,
								name: item.product.name,
								image: item.product.image,
							})),
						},
					},
					include: { items: true },
				});

				for (const item of cartItems) {
					await tx.product.update({
						where: { id: item.productId },
						data: { stock: { decrement: item.quantity } },
					});
				}

				await tx.cartItem.deleteMany({
					where: { userId: ctx.session.user.id },
				});

				return newOrder;
			});

			return order;
		}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.order.findMany({
			where: { userId: ctx.session.user.id },
			include: {
				items: {
					include: { product: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}),

	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const order = await ctx.db.order.findFirst({
				where: {
					id: input.id,
					userId: ctx.session.user.id,
				},
				include: {
					items: {
						include: { product: true },
					},
				},
			});

			if (!order) {
				throw new Error("Order not found");
			}

			return order;
		}),
});
