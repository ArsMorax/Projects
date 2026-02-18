import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Heart,
    User,
    Search,
    Menu,
    X,
    Package,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { type PageProps } from "@/types";
import { router } from "@inertiajs/react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { auth, cartCount } = usePage<PageProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route("products.index"), { search: searchQuery });
            setSearchOpen(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href={route("home")} className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">L</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight">LUXURA</span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-6">
                                <Link
                                    href={route("home")}
                                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href={route("products.index")}
                                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                    Products
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="hidden sm:flex"
                            >
                                <Search className="h-5 w-5" />
                            </Button>

                            {auth.user && (
                                <Link href={route("wishlist.index")}>
                                    <Button variant="ghost" size="icon">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </Link>
                            )}

                            <Link href={route("cart.index")} className="relative">
                                <Button variant="ghost" size="icon">
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {auth.user ? (
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="hidden sm:flex items-center gap-1"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="max-w-[100px] truncate">{auth.user.name}</span>
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setUserMenuOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50"
                                                >
                                                    <Link
                                                        href={route("orders.index")}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        My Orders
                                                    </Link>
                                                    <Link
                                                        href={route("profile.edit")}
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <User className="h-4 w-4" />
                                                        Profile
                                                    </Link>
                                                    <hr className="my-1" />
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Logout
                                                    </Link>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link href={route("login")}>
                                        <Button variant="ghost" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href={route("register")}>
                                        <Button size="sm">Sign Up</Button>
                                    </Link>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {searchOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <form onSubmit={handleSearch} className="pb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                        <Input
                                            placeholder="Search products..."
                                            className="pl-10"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden overflow-hidden border-t border-neutral-200"
                        >
                            <div className="px-4 py-4 space-y-2 bg-white">
                                <form onSubmit={handleSearch} className="mb-3">
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </form>
                                <Link
                                    href={route("home")}
                                    className="block py-2 text-sm font-medium text-neutral-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href={route("products.index")}
                                    className="block py-2 text-sm font-medium text-neutral-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Products
                                </Link>
                                {auth.user ? (
                                    <>
                                        <Link
                                            href={route("orders.index")}
                                            className="block py-2 text-sm font-medium text-neutral-700"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            href={route("profile.edit")}
                                            className="block py-2 text-sm font-medium text-neutral-700"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block py-2 text-sm font-medium text-red-600 w-full text-left"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <div className="flex gap-2 pt-2">
                                        <Link href={route("login")} className="flex-1">
                                            <Button variant="outline" className="w-full" size="sm">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href={route("register")} className="flex-1">
                                            <Button className="w-full" size="sm">
                                                Sign Up
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="bg-neutral-950 text-neutral-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-neutral-900 font-bold text-sm">L</span>
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">LUXURA</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                Premium e-commerce platform offering curated products with exceptional quality and service.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route("products.index")} className="text-sm hover:text-white transition-colors">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("products.index", { sort: "latest" })} className="text-sm hover:text-white transition-colors">
                                        New Arrivals
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("products.index", { sort: "popular" })} className="text-sm hover:text-white transition-colors">
                                        Best Sellers
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route("login")} className="text-sm hover:text-white transition-colors">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("register")} className="text-sm hover:text-white transition-colors">
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("cart.index")} className="text-sm hover:text-white transition-colors">
                                        Cart
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Info</h3>
                            <ul className="space-y-2">
                                <li><span className="text-sm">Free shipping over Rp 500.000</span></li>
                                <li><span className="text-sm">Secure payments</span></li>
                                <li><span className="text-sm">24/7 customer support</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-neutral-800 text-center">
                        <p className="text-sm">&copy; {new Date().getFullYear()} Luxura. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
