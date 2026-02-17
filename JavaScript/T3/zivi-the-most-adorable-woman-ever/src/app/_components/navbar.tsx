"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, User, LogOut, Package } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { CartSheet } from "./cart-sheet";

interface NavbarProps {
	session: {
		user: { id: string; name?: string | null; image?: string | null };
	} | null;
}

export function Navbar({ session }: NavbarProps) {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [cartOpen, setCartOpen] = React.useState(false);
	const [scrolled, setScrolled] = React.useState(false);

	const cartQuery = api.cart.get.useQuery(undefined, {
		enabled: !!session,
	});

	React.useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		{ href: "/products?category=clothing", label: "Clothing" },
		{ href: "/products?category=electronics", label: "Electronics" },
		{ href: "/products?category=accessories", label: "Accessories" },
	];

	return (
		<>
			<header
				className={cn(
					"sticky top-0 z-40 w-full transition-all duration-300",
					scrolled
						? "bg-white/80 backdrop-blur-xl border-b border-neutral-200 shadow-sm"
						: "bg-white border-b border-transparent",
				)}
			>
				<div className="bg-neutral-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
					Free shipping on orders over $100 · Use code{" "}
					<span className="font-bold">SHOP2026</span> for 10% off
				</div>

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<Link href="/" className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center">
								<span className="text-white font-bold text-sm">Z</span>
							</div>
							<span className="text-lg font-bold tracking-tight hidden sm:block">
								ZIVI STORE
							</span>
						</Link>
						<nav className="hidden md:flex items-center gap-1">
							{navLinks.map((link) => {
								const isActive =
									link.href === "/"
										? pathname === "/"
										: pathname.startsWith(link.href.split("?")[0]!);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"px-3 py-2 text-sm font-medium rounded-lg transition-colors",
											isActive
												? "text-neutral-900 bg-neutral-100"
												: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
										)}
									>
										{link.label}
									</Link>
								);
							})}
						</nav>
						<div className="flex items-center gap-2">
							{session ? (
								<>
									<Link href="/orders">
										<Button variant="ghost" size="icon" className="relative">
											<Package className="h-5 w-5" />
										</Button>
									</Link>
									<button
										onClick={() => setCartOpen(true)}
										className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
									>
										<ShoppingBag className="h-5 w-5" />
										{cartQuery.data && cartQuery.data.itemCount > 0 && (
											<motion.span
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center"
											>
												{cartQuery.data.itemCount}
											</motion.span>
										)}
									</button>
									<div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-neutral-200">
										{session.user.image ? (
											<img
												src={session.user.image}
												alt=""
												className="h-7 w-7 rounded-full"
											/>
										) : (
											<div className="h-7 w-7 rounded-full bg-neutral-200 flex items-center justify-center">
												<User className="h-4 w-4 text-neutral-600" />
											</div>
										)}
										<span className="text-sm font-medium text-neutral-700">
											{session.user.name?.split(" ")[0]}
										</span>
									</div>
									<form action="" onSubmit={(e) => { e.preventDefault(); void signOut(); }}>
										<Button variant="ghost" size="icon" className="text-neutral-500" type="submit">
											<LogOut className="h-4 w-4" />
										</Button>
									</form>
								</>
							) : (
								<Link href="/signin">
									<Button variant="default" size="sm">
										Sign In
									</Button>
								</Link>
							)}
							<button
								onClick={() => setMobileOpen(!mobileOpen)}
								className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
							>
								{mobileOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</button>
						</div>
					</div>
				</div>
				<AnimatePresence>
					{mobileOpen && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="md:hidden overflow-hidden border-t border-neutral-200 bg-white"
						>
							<nav className="px-4 py-3 space-y-1">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setMobileOpen(false)}
										className="block px-3 py-2.5 text-sm font-medium text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
									>
										{link.label}
									</Link>
								))}
							</nav>
						</motion.div>
					)}
				</AnimatePresence>
			</header>

			{session && (
				<CartSheet open={cartOpen} onOpenChange={setCartOpen} />
			)}
		</>
	);
}
