import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
	get: protectedProcedure.query(async ({ ctx }) => {
		const items = await ctx.db.cartItem.findMany({
			where: { userId: ctx.session.user.id },
			include: {
				product: {
					include: { category: true },
				},
			},
			orderBy: { createdAt: "asc" },
		});

		const subtotal = items.reduce(
			(sum, item) => sum + item.product.price * item.quantity,
			0,
		);
		const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

		return { items, subtotal, itemCount };
	}),

	add: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
				quantity: z.number().min(1).default(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const product = await ctx.db.product.findUnique({
				where: { id: input.productId },
			});

			if (!product) {
				throw new Error("Product not found");
			}

			if (product.stock < input.quantity) {
				throw new Error("Not enough stock available");
			}

			return ctx.db.cartItem.upsert({
				where: {
					userId_productId: {
						userId: ctx.session.user.id,
						productId: input.productId,
					},
				},
				update: {
					quantity: { increment: input.quantity },
				},
				create: {
					userId: ctx.session.user.id,
					productId: input.productId,
					quantity: input.quantity,
				},
			});
		}),

	updateQuantity: protectedProcedure
		.input(
			z.object({
				productId: z.string(),
				quantity: z.number().min(0),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.quantity === 0) {
				return ctx.db.cartItem.delete({
					where: {
						userId_productId: {
							userId: ctx.session.user.id,
							productId: input.productId,
						},
					},
				});
			}

			return ctx.db.cartItem.update({
				where: {
					userId_productId: {
						userId: ctx.session.user.id,
						productId: input.productId,
					},
				},
				data: { quantity: input.quantity },
			});
		}),

	remove: protectedProcedure
		.input(z.object({ productId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.cartItem.delete({
				where: {
					userId_productId: {
						userId: ctx.session.user.id,
						productId: input.productId,
					},
				},
			});
		}),

	clear: protectedProcedure.mutation(async ({ ctx }) => {
		return ctx.db.cartItem.deleteMany({
			where: { userId: ctx.session.user.id },
		});
	}),
});
