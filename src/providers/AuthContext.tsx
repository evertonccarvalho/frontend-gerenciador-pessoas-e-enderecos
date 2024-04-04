"use client"
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import api from '@/services/api'
import { TokenService } from '@/services/tokenService'
import { toast } from 'sonner';
import { z } from 'zod';
import authService, { LoginSchema } from '@/services/authService';

import { useRouter } from 'next/navigation';



type User = {
	id: string
	email: string
	name: string,
	role: UserType
	image: string | null,
}

type SignInCredentials = {
	email: string
	password: string
}

export enum UserType {
	USER = 'USER',
	ADMIN = 'ADMIN',
	SELLER = 'SELLER',
}


type AuthContextData = {
	signIn: (credentials: SignInCredentials) => Promise<void>
	signOut: () => void
	user?: User
	isAuthenticated: boolean
}

type AuthProviderProps = {
	children: ReactNode
}

const AuthContext = createContext({} as AuthContextData)

export function signOut() {
	TokenService.removeTokens()
	location.reload()
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>()
	const isAuthenticated = !!user
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (TokenService.getAccessToken()) {
					const res = await api.get('/users/current');
					if (res.status === 200) {
						console.log('Dados do usuário carregados com sucesso');
						setUser(res.data);
					}
				}
			} catch (error: any) {
				if (error.response && error.response.status === 401) {
					console.log('Primeira tentativa falhou, tentando novamente...');
					try {
						const res = await api.get('/users/current');
						if (res.status === 200) {
							console.log('Dados do usuário carregados com sucesso na segunda tentativa');
							setUser(res.data);
						}
					} catch (error) {
						toast.error('Erro ao carregar dados do usuário');
						signOut();
					}
				} else {
					toast.error('Erro ao carregar dados do usuário');
					signOut();
				}
			}
		};


		fetchData();
	}, [router]);

	async function signIn(formData: z.infer<typeof LoginSchema>) {
		try {

			const response = await authService.login(formData);

			const { token, refreshToken, user } = response.data;
			TokenService.saveAccessToken(token);
			TokenService.saveRefreshToken(refreshToken)
			setUser(user);

			router.push('/')

			toast.success('Logado com sucesso!')
		} catch (error) {
			if (error instanceof Error)
				toast.error(error.message)
		}
	}


	return (
		<AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)