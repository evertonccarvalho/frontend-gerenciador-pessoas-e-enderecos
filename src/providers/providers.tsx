import type React from "react";
import { Toaster } from "sonner";
import QueryProvider from "./QueryProvide";
import { AuthProvider } from "./AuthContext";
export default function Providers({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Toaster />
			<QueryProvider>
				<AuthProvider>
					{children}
				</AuthProvider>
			</QueryProvider>
		</>
	);
}
