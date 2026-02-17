"use client";

import * as React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ToastProvider } from "~/components/toast-provider";

interface ClientLayoutProps {
	children: React.ReactNode;
	session: {
		user: { id: string; name?: string | null; image?: string | null };
	} | null;
}

export function ClientLayout({ children, session }: ClientLayoutProps) {
	return (
		<ToastProvider>
			<div className="flex min-h-screen flex-col">
				<Navbar session={session} />
				<main className="flex-1">{children}</main>
				<Footer />
			</div>
		</ToastProvider>
	);
}
