"use client";
import {
	QueryClient,
	QueryClientProvider as Provider,
} from "@tanstack/react-query";

export default function QueryProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const queryClient = new QueryClient();

	return <Provider client={queryClient}>{children}</Provider>;
}
