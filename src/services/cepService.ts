import axios from "axios";

export const brasilApiCep = () => {
  const getAddress = async (cep: string) => {
    try {
      const res = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return { getAddress };
};
