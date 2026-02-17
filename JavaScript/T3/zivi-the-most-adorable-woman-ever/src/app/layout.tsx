import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ClientLayout } from "./_components/client-layout";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
	title: "ZIVI STORE — Premium E-Commerce",
	description:
		"Discover premium quality products. Curated collections of clothing, electronics, and accessories.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();

	return (
		<html className={`${geist.variable}`} lang="en">
			<body>
				<TRPCReactProvider>
					<ClientLayout
						session={
							session?.user
								? {
										user: {
											id: session.user.id!,
											name: session.user.name,
											image: session.user.image,
										},
									}
								: null
						}
					>
						{children}
					</ClientLayout>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
