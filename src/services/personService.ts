import api from './api';

const personService = {

	create: async (data: any) => {
		const res = await api
			.post(`/persons`, data,)
			.catch((error) => {
				if (error.response.status === 400) {
					return error.response;
				}
				return error;
			});
		return res;
	},

	index: async () => {
		try {
			const response = await api.get(`/persons`,);
			return response.data;
		} catch (error) {
			console.log('Erro ao buscar pessoas:', error);
			throw error;
		}
	},
	getById: async (id: string) => {
		try {
			const response = await api.get(`/persons/${id}`,);
			return response.data;
		} catch (error) {
			console.log('Erro ao buscar pessoas:', error);
			throw error;
		}
	},

	update: async (id: string, data: any) => {
		try {

			const res = await api.put(`/persons/${id}`, data,);
			return res.status;
		} catch (error) {
			console.error('Error ao atualizar pessoa:', error);
			throw error;
		}
	},

	delete: async (id: string) => {
		try {
			const res = await api.delete(`/persons/${id}`);
			return res;
		} catch (error: any) {
			let errorMessage = "Erro ao excluir pessoa";
			if (error.response && error.response.status === 409) {
				errorMessage = error.response.data.message;
			}
			throw new Error(errorMessage);
		}
	},


}

export default personService;
