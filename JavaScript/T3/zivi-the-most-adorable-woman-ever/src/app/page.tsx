import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { HomePage } from "./_components/home-page";

export default async function Home() {
	let session = null;
	try {
		session = await auth();
	} catch {
	}

	try {
		void api.product.getFeatured.prefetch();
		void api.product.getCategories.prefetch();
	} catch {
	}

	return (
		<HydrateClient>
			<HomePage isAuthenticated={!!session} />
		</HydrateClient>
	);
}
