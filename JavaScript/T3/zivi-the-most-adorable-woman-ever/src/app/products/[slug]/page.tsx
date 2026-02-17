import { api, HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { ProductDetailPage } from "../../_components/product-detail-page";
import { notFound } from "next/navigation";

export default async function ProductPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const session = await auth();

	try {
		void api.product.getBySlug.prefetch({ slug });
	} catch {
		notFound();
	}

	return (
		<HydrateClient>
			<ProductDetailPage slug={slug} isAuthenticated={!!session} />
		</HydrateClient>
	);
}
