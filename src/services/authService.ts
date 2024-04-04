import api from './api';
import { z } from 'zod';
import { TokenService } from './tokenService';


export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: 'mínimo 8 caracteres' }), // Mínimo 8 caracteres para a senha
});

const authService = {

	login: async (formData: z.infer<typeof LoginSchema>) => {
		const res = await api.post('/auth', formData).catch((error) => {
			if (error.response.status === 400 || error.response.status === 401) {
				return error.response;
			}
			return error;
		});
		if (res.status === 200) {
			const { accessToken, refreshToken } = res.data;
			TokenService.saveAccessToken(accessToken);
			TokenService.saveRefreshToken(refreshToken)
		}
		return res;
	},

};

export default authService;

