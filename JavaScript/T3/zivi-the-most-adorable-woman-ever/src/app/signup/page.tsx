"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, ShoppingBag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});

			const data = (await res.json()) as { error?: string };

			if (!res.ok) {
				setError(data.error ?? "Something went wrong");
				setLoading(false);
				return;
			}

			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError("Account created but sign-in failed. Please sign in manually.");
				setLoading(false);
				return;
			}

			router.push("/");
			router.refresh();
		} catch {
			setError("Something went wrong. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2">
						<div className="h-10 w-10 rounded-xl bg-neutral-900 flex items-center justify-center">
							<ShoppingBag className="h-5 w-5 text-white" />
						</div>
						<span className="text-xl font-bold tracking-tight">ZIVI STORE</span>
					</Link>
				</div>

				<Card className="shadow-lg border-neutral-200">
					<CardHeader className="text-center pb-2">
						<CardTitle className="text-2xl">Create an account</CardTitle>
						<p className="text-sm text-neutral-500 mt-1">
							Join ZIVI STORE and start shopping
						</p>
					</CardHeader>
					<CardContent className="pt-4">
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3"
								>
									{error}
								</motion.div>
							)}

							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
									<Input
										id="name"
										type="text"
										placeholder="John Doe"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10"
										required
										minLength={6}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
									<Input
										id="confirmPassword"
										type="password"
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="pl-10"
										required
										minLength={6}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Creating account...
									</>
								) : (
									"Create Account"
								)}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm text-neutral-500">
							Already have an account?{" "}
							<Link
								href="/signin"
								className="font-semibold text-neutral-900 hover:underline"
							>
								Sign in
							</Link>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
