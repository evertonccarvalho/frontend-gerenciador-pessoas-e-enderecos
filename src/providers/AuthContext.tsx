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
import { useRouter } from 'next/navigation';

type User = {
	id: string
	email: string
	name: string,
}

type AuthContextData = {
	signOut: () => void
	user?: User
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
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (TokenService.getAccessToken()) {
					const res = await api.get('/auth/current');
					if (res.status === 200) {
						console.log('Dados do usuário carregados com sucesso');
						setUser(res.data);
					}
				}
			} catch (error: any) {
				if (error.response && error.response.status === 401) {
					console.log('Primeira tentativa falhou, tentando novamente...');
					try {
						const res = await api.get('/auth/current');
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


	return (
		<AuthContext.Provider value={{ user, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)