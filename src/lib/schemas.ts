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
  address: z.string(),
  number: z.coerce.number(),
  complement: z.string(),
  zipcode: z.string().regex(/^\d{5}-\d{3}$/i, "Formato de CEP inválido"),
  city: z.string(),
  neighborhood: z.string(),
  state: z.string(),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = z.object({
  id: z.string(),
  address: z.string(),
  number: z.coerce.number(),
  complement: z.string(),
  zipcode: z.string().regex(/^\d{5}-\d{3}$/i, "Formato de CEP inválido"),
  city: z.string(),
  neighborhood: z.string(),
  state: z.string(),
  isDefault: z.boolean().default(false),
});


export const personCreateSchema = z.object({
  name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
  sex: z.string(),
  dateOfBirth: z.coerce.date(),
  maritalStatus: z.string(),
  addresses: addressSchema.optional(),
});

export const personSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(4, { message: "Mínimo de 4 caracteres" }),
  sex: z.string(),
  dateOfBirth: z.coerce.date(),
  maritalStatus: z.string(),
  addresses: addressSchema.optional(),
});


export interface IPerson {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: Date;
  maritalStatus: string;
  addresses?: IAddresses[];
  defaultAddress?: IAddresses; // Adicionando a propriedade defaultAddress

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