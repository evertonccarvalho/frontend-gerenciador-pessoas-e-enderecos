"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '@/services/api';
import { TokenService } from '@/services/tokenService';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { LoginSchema } from '@/lib/schemas';
import { z } from 'zod';

type User = {
	id: string;
	email: string;
	name: string;
};

type AuthContextData = {
	signIn: (credentials: z.infer<typeof LoginSchema>) => Promise<void>
	signOut: () => void;
	user?: User;
	isAuthenticated: boolean;
};

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | undefined>();
	const router = useRouter();
	const isAuthenticated = !!user;

	const signOut = () => {
		TokenService.removeTokens();
		setUser(undefined)
		router.push('/');
	};

	async function signIn(credentials: z.infer<typeof LoginSchema>) {
		try {
			const response = await authService.login(credentials);
			if (response.status === 200) {
				toast.success('Logado com sucesso!')
				setUser(response.data.user);
			} else {
				toast.success(response.data.message)
			}
		} catch (error) {
			if (error instanceof Error)
				toast.error(error.message)
		}
	}

	const handleFetchError = async () => {
		try {
			const res = await api.get('/users/current');
			if (res.status === 200) {
				setUser(res.data);
			}
		} catch (error) {
			toast.error('Failed to load user data');
			signOut();
		}
	};

	const fetchData = async () => {
		try {
			if (TokenService.getAccessToken()) {
				const res = await api.get('/users/current');
				if (res.status === 200) {
					setUser(res.data);
				}
			}
		} catch (error) {
			handleFetchError();
		}
	};

	useEffect(() => {
		fetchData();

		if (!isAuthenticated) {
			TokenService.getAccessToken();
		}
		if (isAuthenticated) {
			router.push("/person",)
		} else if (location.pathname !== "/") {
			router.push("/auth/login",)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, router])



	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
