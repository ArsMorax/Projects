import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { ProductsPage } from "../_components/products-page";

export default async function Products() {
	const session = await auth();

	void api.product.getAll.prefetch();
	void api.product.getCategories.prefetch();

	return (
		<HydrateClient>
			<ProductsPage isAuthenticated={!!session} />
		</HydrateClient>
	);
}
