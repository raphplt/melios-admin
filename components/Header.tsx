"use client";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
} from "@nextui-org/react";
import Melios from "@/public/Melios.png";
import Image from "next/image";
import { useAuth } from "@/providers/AuthContext";

export default function App() {
	const { user } = useAuth();
	return (
		<Navbar>
			<button onClick={() => (window.location.href = "/")}>
				<NavbarBrand>
					<Image src={Melios} alt="Melios" width={40} height={40} />
					<p className="font-bold text-inherit px-2">Melios</p>
				</NavbarBrand>
			</button>
			<NavbarContent className="hidden sm:flex gap-4" justify="center">
				{user ? (
					<NavbarItem>
						<Link color="foreground" href="/">
							Dashboard
						</Link>
					</NavbarItem>
				) : (
					<NavbarItem>
						<Link color="foreground" href="/login">
							Me connecter
						</Link>
					</NavbarItem>
				)}
			</NavbarContent>
		</Navbar>
	);
}
