/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useAuth } from "@/providers/AuthContext";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { user, setUser } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			setUser(auth.currentUser);
			router.push("/");
		} catch (error: any) {
			setError(error.message);
		}
	};

	if (user) {
		return <p>Vous êtes déjà connecté.</p>;
	}

	return (
		<div className="max-w-md mx-auto mt-10 p-4 border rounded-md shadow-md">
			<h1 className="text-2xl font-bold mb-4">Me connecter</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Email :
					</label>
					<Input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						fullWidth
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Mot de passe :
					</label>
					<Input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						fullWidth
					/>
				</div>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<Button type="submit" color="primary" fullWidth className="text-default-50">
					Se connecter
				</Button>
			</form>
		</div>
	);
};

export default LoginForm;
