import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Headphones, Star } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import ProductCard from "@/Components/ProductCard";
import type { Product, Category, PageProps } from "@/types";

interface Props extends PageProps {
    featuredProducts: Product[];
    categories: Category[];
    newArrivals: Product[];
    bestSellers: Product[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home({ featuredProducts, categories, newArrivals, bestSellers }: Props) {
    return (
        <MainLayout>
            <Head title="Premium E-Commerce" />

            <section className="relative overflow-hidden bg-neutral-950 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <Badge variant="secondary" className="bg-white/10 text-white border-0">
                                New Collection 2026
                            </Badge>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                                Discover Premium
                                <br />
                                <span className="text-neutral-400">Quality Products</span>
                            </h1>
                            <p className="text-lg text-neutral-400 max-w-md leading-relaxed">
                                Curated selection of premium products with unmatched quality. Experience luxury at every touchpoint.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link href={route("products.index")}>
                                    <Button size="xl" className="bg-white text-neutral-900 hover:bg-neutral-100">
                                        Shop Now
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={route("products.index", { sort: "latest" })}>
                                    <Button size="xl" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 bg-transparent">
                                        New Arrivals
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:block"
                        >
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-24 h-24 mx-auto bg-white/10 rounded-2xl flex items-center justify-center">
                                            <span className="text-5xl font-bold">L</span>
                                        </div>
                                        <p className="text-2xl font-semibold">LUXURA</p>
                                        <p className="text-neutral-500 text-sm">Premium Shopping Experience</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-2xl backdrop-blur-sm" />
                                <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/5 rounded-2xl backdrop-blur-sm" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-12 border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { icon: Truck, title: "Free Shipping", desc: "On orders over Rp 500.000" },
                            { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
                            { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service" },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="h-5 w-5 text-neutral-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                                    <p className="text-sm text-neutral-500">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-end justify-between mb-10"
                    >
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Shop by Category</h2>
                            <p className="text-neutral-500 mt-2">Browse our curated collections</p>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
                    >
                        {categories.map((category) => (
                            <motion.div key={category.id} variants={item}>
                                <Link
                                    href={route("products.index", { category: category.id })}
                                    className="group block"
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                <span className="text-3xl font-bold">{category.name[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-medium text-sm group-hover:text-neutral-600 transition-colors">{category.name}</h3>
                                    <p className="text-xs text-neutral-400">{category.products_count} products</p>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {featuredProducts.length > 0 && (
                <section className="py-16 lg:py-20 bg-neutral-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-end justify-between mb-10"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Products</h2>
                                <p className="text-neutral-500 mt-2">Handpicked for excellence</p>
                            </div>
                            <Link href={route("products.index")}>
                                <Button variant="ghost" size="sm">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {featuredProducts.map((product) => (
                                <motion.div key={product.id} variants={item}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {newArrivals.length > 0 && (
                <section className="py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-end justify-between mb-10"
                        >
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">New Arrivals</h2>
                                <p className="text-neutral-500 mt-2">Latest additions to our store</p>
                            </div>
                            <Link href={route("products.index", { sort: "latest" })}>
                                <Button variant="ghost" size="sm">
                                    View All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {newArrivals.map((product) => (
                                <motion.div key={product.id} variants={item}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            <section className="py-16 lg:py-20 bg-neutral-950 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 max-w-2xl mx-auto"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Start Shopping Today</h2>
                        <p className="text-neutral-400 text-lg">
                            Join thousands of satisfied customers and discover our premium collection.
                        </p>
                        <Link href={route("products.index")}>
                            <Button size="xl" className="bg-white text-neutral-900 hover:bg-neutral-100 mt-4">
                                Explore Products <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </MainLayout>
    );
}
