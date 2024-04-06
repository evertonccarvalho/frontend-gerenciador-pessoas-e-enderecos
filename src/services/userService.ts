import api from "./api";
import { TokenService } from "./tokenService";


const userService = {

  fetchCurrent: async () => {
    const res = await api
      .get("/users/current",)
      .catch((error) => {
        return error.response;
      });

    return res.data;
  },

  loadCredentials: async () => {
    try {
      if (TokenService.getAccessToken()) {
        const res = await api.get('/users/current');
        if (res.status === 200) {
          return (res.data);
        }
        console.log('Dados do usuário carregados com sucesso');
        return res.data
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log('Primeira tentativa falhou, tentando novamente...');
        try {
          const res = await api.get('/users/current');
          if (res.status === 200) {
            console.log('Dados do usuário carregados com sucesso na segunda tentativa');
            return (res.data);
          }
        } catch (error) {
          return error
        }
      } else {
        return error
      }
    }
  },
};

export default userService;
