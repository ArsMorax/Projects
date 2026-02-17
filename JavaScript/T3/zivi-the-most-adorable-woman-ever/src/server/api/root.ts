import { productRouter } from "~/server/api/routers/product";
import { cartRouter } from "~/server/api/routers/cart";
import { orderRouter } from "~/server/api/routers/order";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
	product: productRouter,
	cart: cartRouter,
	order: orderRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
