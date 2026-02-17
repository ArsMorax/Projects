import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
	getAll: publicProcedure
		.input(
			z
				.object({
					categorySlug: z.string().optional(),
					search: z.string().optional(),
					sort: z
						.enum(["newest", "price-asc", "price-desc", "popular"])
						.optional(),
					limit: z.number().min(1).max(50).optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const where: Record<string, unknown> = {};

			if (input?.categorySlug) {
				where.category = { slug: input.categorySlug };
			}

			if (input?.search) {
				where.OR = [
					{ name: { contains: input.search } },
					{ description: { contains: input.search } },
				];
			}

			let orderBy: Record<string, string> = { createdAt: "desc" };
			if (input?.sort === "price-asc") orderBy = { price: "asc" };
			if (input?.sort === "price-desc") orderBy = { price: "desc" };
			if (input?.sort === "popular") orderBy = { rating: "desc" };

			return ctx.db.product.findMany({
				where,
				orderBy,
				take: input?.limit ?? 50,
				include: { category: true },
			});
		}),

	getFeatured: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.product.findMany({
			where: { featured: true },
			take: 8,
			include: { category: true },
			orderBy: { createdAt: "desc" },
		});
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			const product = await ctx.db.product.findUnique({
				where: { slug: input.slug },
				include: { category: true },
			});

			if (!product) {
				throw new Error("Product not found");
			}

			const related = await ctx.db.product.findMany({
				where: {
					categoryId: product.categoryId,
					id: { not: product.id },
				},
				take: 4,
				include: { category: true },
			});

			return { product, related };
		}),

	getCategories: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.category.findMany({
			include: {
				_count: { select: { products: true } },
			},
			orderBy: { name: "asc" },
		});
	}),
});
