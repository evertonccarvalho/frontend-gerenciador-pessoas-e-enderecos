import api from "./api";
const addressesService = {

  create: async (personId: string, data: any) => {
    const res = await api
      .post(`/persons/${personId}/addresses`, data,)
      .catch((error) => {
        if (error.response.status === 400) {
          return error.response;
        }
        return error;
      });
    return res;
  },

  update: async (personId: string, id: string, data: any) => {
    console.log('update', id, data);
    const res = await api
      .put(`/persons/${personId}/addresses/${id}`, data,)
      .catch((error) => {
        if (error.response.status === 400) {
          return error.response;
        }
        return error;
      });
    return res;
  },

  fetchAll: async (personId: string) => {
    try {
      const response = await api.get(`/persons/${personId}/addresses`,);
      return response.data;
    } catch (error) {
      console.log('Erro ao buscar endereçes:', error);
      throw error;
    }
  },

  delete: async (personId: string, id: string) => {
    try {
      const res = await api.delete(`/persons/${personId}/addresses/${id}`);
      return res;
    } catch (error: any) {
      let errorMessage = "Erro ao excluir pessoa";
      if (error.response && error.response.status === 409) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },

  toggleDefault: async (personId: string, addressId: string, isDefault: boolean) => {
    try {
      const res = await api.put(`/persons/${personId}/addresses/${addressId}/default`, { setDefault: isDefault });
      return res.data;
    } catch (error: any) {
      let errorMessage = "Erro ao atualizar endereço padrão";
      if (error.response && error.response.status === 409) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  }


}

export default addressesService