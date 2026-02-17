import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { CheckoutPage } from "../_components/checkout-page";

export default async function Checkout() {
	const session = await auth();

	if (!session) {
		redirect("/signin");
	}

	void api.cart.get.prefetch();

	return (
		<HydrateClient>
			<CheckoutPage />
		</HydrateClient>
	);
}
