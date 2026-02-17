import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { OrderDetailPage } from "../../_components/order-detail-page";

export default async function OrderDetail({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const session = await auth();

	if (!session) {
		redirect("/signin");
	}

	void api.order.getById.prefetch({ id });

	return (
		<HydrateClient>
			<OrderDetailPage id={id} />
		</HydrateClient>
	);
}
