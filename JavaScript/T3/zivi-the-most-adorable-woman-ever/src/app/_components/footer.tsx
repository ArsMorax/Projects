import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-neutral-950 text-neutral-400 mt-auto">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
								<span className="text-neutral-900 font-bold text-sm">Z</span>
							</div>
							<span className="text-lg font-bold text-white tracking-tight">
								ZIVI STORE
							</span>
						</div>
						<p className="text-sm leading-relaxed">
							Premium products curated for those who appreciate quality
							craftsmanship and modern design.
						</p>
					</div>
					<div>
						<h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
							Shop
						</h3>
						<ul className="space-y-2.5">
							<li>
								<Link
									href="/products"
									className="text-sm hover:text-white transition-colors"
								>
									All Products
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=clothing"
									className="text-sm hover:text-white transition-colors"
								>
									Clothing
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=electronics"
									className="text-sm hover:text-white transition-colors"
								>
									Electronics
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=accessories"
									className="text-sm hover:text-white transition-colors"
								>
									Accessories
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
							Support
						</h3>
						<ul className="space-y-2.5">
							<li>
								<span className="text-sm">help@zivistore.com</span>
							</li>
							<li>
								<span className="text-sm">Shipping & Returns</span>
							</li>
							<li>
								<span className="text-sm">FAQ</span>
							</li>
							<li>
								<span className="text-sm">Size Guide</span>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
							Legal
						</h3>
						<ul className="space-y-2.5">
							<li>
								<span className="text-sm">Privacy Policy</span>
							</li>
							<li>
								<span className="text-sm">Terms of Service</span>
							</li>
							<li>
								<span className="text-sm">Cookie Policy</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-neutral-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs">
						&copy; {new Date().getFullYear()} ZIVI STORE. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className="h-6 w-10 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-400">
								VISA
							</div>
							<div className="h-6 w-10 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-400">
								MC
							</div>
							<div className="h-6 w-10 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-400">
								AMEX
							</div>
							<div className="h-6 w-10 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-400">
								PP
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
