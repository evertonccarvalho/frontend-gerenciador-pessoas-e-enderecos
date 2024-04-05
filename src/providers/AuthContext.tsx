"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '@/services/api';
import { TokenService } from '@/services/tokenService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type User = {
	id: string;
	email: string;
	name: string;
};

type AuthContextData = {
	user?: User;
	signOut: () => void;
};

type AuthProviderProps = {
	children: ReactNode;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | undefined>();
	const router = useRouter();

	const signOut = () => {
		TokenService.removeTokens();
		setUser(undefined)
		router.push('/');
	};

	useEffect(() => {
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

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	return (
		<AuthContext.Provider value={{ user, signOut }}>
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
