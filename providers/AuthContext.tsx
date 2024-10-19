"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";

interface AuthContextProps {
	user: User | null;
	isAdmin: boolean;
	loading: boolean;

	setUser: (user: User | null) => void;
	setIsAdmin: (isAdmin: boolean) => void;
	setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
	user: null,
	isAdmin: false,
	loading: true,
	setUser: () => {},
	setIsAdmin: () => {},
	setLoading: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);
			if (user) {
				const token = await user.getIdTokenResult();
				setIsAdmin(token.claims.admin === true);
			} else {
				setIsAdmin(false);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	console.log(user);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAdmin,
				loading,
				setUser,
				setIsAdmin,
				setLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
