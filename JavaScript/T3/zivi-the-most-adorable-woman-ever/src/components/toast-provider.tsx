"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "~/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

const icons: Record<ToastType, React.ReactNode> = {
	success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
	error: <XCircle className="h-5 w-5 text-red-500" />,
	info: <Info className="h-5 w-5 text-blue-500" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = React.useState<Toast[]>([]);

	const toast = React.useCallback((message: string, type: ToastType = "success") => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 4000);
	}, []);

	const dismiss = React.useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
				<AnimatePresence mode="popLayout">
					{toasts.map((t) => (
						<motion.div
							key={t.id}
							layout
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className={cn(
								"flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg min-w-[300px] max-w-[420px]",
								t.type === "success" && "border-emerald-200",
								t.type === "error" && "border-red-200",
								t.type === "info" && "border-blue-200",
							)}
						>
							{icons[t.type]}
							<p className="flex-1 text-sm font-medium text-neutral-800">
								{t.message}
							</p>
							<button
								onClick={() => dismiss(t.id)}
								className="rounded-md p-1 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
							>
								<X className="h-4 w-4" />
							</button>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
}
