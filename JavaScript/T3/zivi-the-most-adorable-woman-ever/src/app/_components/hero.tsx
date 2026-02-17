"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-neutral-950 text-white">
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(54,79,199,0.3),#0a0a0a_50%,#0a0a0a)]" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-700/10 rounded-full blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
				<div className="max-w-2xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/10">
							<Sparkles className="h-4 w-4 text-brand-400" />
							New Collection 2026
						</div>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
					>
						Discover Premium
						<br />
						<span className="bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">
							Quality Products
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg"
					>
						Curated collections of clothing, electronics, and accessories.
						Designed for those who value quality and modern aesthetics.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="mt-8 flex flex-wrap gap-4"
					>
						<Button
							size="lg"
							className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-8"
							asChild
						>
							<Link href="/products" className="gap-2">
								Shop Now
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
							asChild
						>
							<Link href="/products?sort=popular">Trending</Link>
						</Button>
					</motion.div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="mt-16 flex gap-8 sm:gap-12"
					>
						{[
							{ label: "Products", value: "200+" },
							{ label: "Happy Customers", value: "15K+" },
							{ label: "5-Star Reviews", value: "4.9" },
						].map((stat) => (
							<div key={stat.label}>
								<p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
								<p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
							</div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
