import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/Header";
import { AuthProvider } from "@/providers/AuthContext";

export const metadata: Metadata = {
	title: "Melios Admin",
	description: "Le tableau de bord de Melios",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryProvider>
			<AuthProvider>
			<html lang="fr">
				<body>
					<Header />
					{children}
				</body>
				</html>
			</AuthProvider>
		</QueryProvider>
	);
}
