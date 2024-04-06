import axios from 'axios';
import { TokenService } from './tokenService';
import { getCookie } from 'cookies-next'; // Importa a função getCookie da biblioteca 'cookies-next'

const defaultOptions = {
	baseURL: process.env.NEXT_PUBLIC_BASEURL,
};

const api = axios.create(defaultOptions);

// Add a request interceptor
api.interceptors.request.use(
	(config) => {
		const accessToken = TokenService.getAccessToken();
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If the error status is 401 and there is no originalRequest._retry flag,
		// it means the token has expired and we need to refresh it
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshToken = getCookie('refreshToken'); // Obtém o refreshToken usando a função getCookie de 'cookies-next'
			if (!refreshToken) {
				TokenService.removeTokens();
				return Promise.reject(error);
			}
			try {
				const response = await axios.post(`${process.env.NEXT_PUBLIC_BASEURL}/refresh`, { refreshToken });
				const { token: accessToken, refreshToken: newRefreshToken } = response.data;
				TokenService.saveAccessToken(accessToken); // Salva o novo accessToken usando TokenService
				TokenService.saveRefreshToken(newRefreshToken); // Salva o novo refreshToken usando TokenService
				// Retry the original request with the new token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return axios(originalRequest);
			} catch (error) {
				// Handle refresh token error or redirect to login
				console.log('Erro ao atualizar token de acesso', error);
				// Redirecionar para a página de login
				window.location.href = '/auth/login';
			}
		}

		return Promise.reject(error);
	}
);

export default api;
