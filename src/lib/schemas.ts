import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email é obrigatório",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email é obrigatório",
  }),
  password: z.string().min(6, {
    message: "Mínimo de 6 caracteres requerido para a senha",
  }),
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
});

export const addressSchema = z.object({
  address: z.string().min(1, "Não pode estar vazio.").max(50, { message: "Máximo 50 caracteres." }),
  number: z.coerce.number(),
  complement: z.string().max(30, { message: "Deve ter no máximo 30 caracteres." }),
  zipcode: z.string().regex(/^\d{8}$/i, "Formato de CEP inválido."),
  city: z.string().min(3, "Mínimo de 3 caracteres.").max(30, { message: "Máximo 50 caracteres." }),
  neighborhood: z.string().min(3, "Mínimo de 3 caracteres.").max(20, { message: "Máximo 20 caracteres." }),
  state: z.string().min(2, "É obrigatório"),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema.extend({
  id: z.string(),
});

export const personSchema = z.object({
  name: z.string().min(4, { message: "O nome deve ter no mínimo 4 caracteres." }).max(40, { message: "Máximo 40 caracteres." }),
  sex: z.string().min(1, { message: "Selecione o sexo." }),
  dateOfBirth: z.string().min(1, { message: "Data de Nascimento Invalida" }),
  maritalStatus: z.string().min(1, { message: "Selecione o estado civil." }),
  addresses: addressSchema.optional(),
});


export const updatePersonSchema = personSchema.extend({
  id: z.string(),
});

export interface IPerson {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: Date;
  maritalStatus: string;
  addresses?: IAddresses[];
  defaultAddress?: IAddresses;

}

export interface IAddresses {
  id: string;
  personId: string;
  address: string;
  number: number;
  complement: string;
  zipcode: string;
  city: string;
  neighborhood: string;
  state: string;
  isDefault: boolean;
  created_at: Date | null;
}