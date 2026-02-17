import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { OrdersPage } from "../_components/orders-page";

export default async function Orders() {
	const session = await auth();

	if (!session) {
		redirect("/signin");
	}

	void api.order.getAll.prefetch();

	return (
		<HydrateClient>
			<OrdersPage />
		</HydrateClient>
	);
}
