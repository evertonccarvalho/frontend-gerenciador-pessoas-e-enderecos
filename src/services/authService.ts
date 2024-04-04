import api from './api';
import { z } from 'zod';
import { TokenService } from './tokenService';
import { LoginSchema, RegisterSchema } from '@/lib/schemas';
import { handleErrorResponse } from '@/lib/utils';



const authService = {
	login: async (formData: z.infer<typeof LoginSchema>) => {
		try {
			const res = await api.post('/auth/login', formData);
			if (res.status === 200) {
				const { accessToken, refreshToken } = res.data;
				TokenService.saveAccessToken(accessToken);
				TokenService.saveRefreshToken(refreshToken);
			}
			return res;
		} catch (error) {
			return handleErrorResponse(error);
		}
	},

	register: async (formData: z.infer<typeof RegisterSchema>) => {
		try {
			const res = await api.post('/auth/register', formData);
			return res;
		} catch (error) {
			return handleErrorResponse(error);
		}
	},

};

export default authService;
