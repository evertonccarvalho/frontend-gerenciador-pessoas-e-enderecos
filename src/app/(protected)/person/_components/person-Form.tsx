'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {

	Loader2,

} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"


import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import personService from '@/services/personService';
import { personSchema, updatePersonSchema } from '@/lib/schemas';
import { Switch } from '@/components/ui/switch';
import { brasilApiCep } from '@/services/cepService';


type PersonFormValues = z.infer<typeof personSchema>;
export type PersonInitalData = z.infer<typeof updatePersonSchema>;


interface PersonFormProps {
	initialData: PersonInitalData | null;
	onClose: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({
	initialData,
	onClose,
}) => {
	const [loading, setLoading] = useState(false);
	const title = initialData ? 'Editar' : 'Criar';
	const description = initialData
		? 'Editar Pessoa'
		: 'Adicionar Pessoa';
	const toastMessage = initialData ? 'Persoa Atualizado.' : 'Persoa Criada.';
	const action = initialData ? 'Salvar Alterações' : 'Criar';
	const queryClient = useQueryClient();
	const [filledByCep, setFilledByCep] = useState(false);
	const [inputsDisabled, setInputsDisabled] = useState(false);

	const fetchAddressFromCep = async (cep: string) => {
		try {
			const addressData = await brasilApiCep().getAddress(cep);
			form.setValue('addresses.zipcode', addressData.cep);
			form.setValue('addresses.city', addressData.city);
			form.setValue('addresses.neighborhood', addressData.neighborhood);
			form.setValue('addresses.state', addressData.state);
			form.setValue('addresses.address', addressData.street);
			form.setValue('addresses.complement', addressData.complement);
			setFilledByCep(true)
			setInputsDisabled(true);
		} catch (error) {
			console.error('Erro ao buscar endereço:', error);
		}
	};

	const handleCepBlur = async () => {
		const cep = form.getValues('addresses.zipcode');
		if (cep) {
			await fetchAddressFromCep(cep);
		}
	};

	const defaultValues = initialData
		? initialData
		: {
			name: "",
			sex: "",
			dateOfBirth: '',
			maritalStatus: "",
			addresses: {
				address: "",
				number: 0,
				complement: "",
				neighborhood: "",
				zipcode: "",
				city: "",
				state: "",
				isDefault: true
			}
		}


	const form = useForm<PersonFormValues>({
		resolver: zodResolver(personSchema),
		defaultValues,
	});



	const onSubmit = async (data: z.infer<typeof personSchema>) => {
		const FORM_DATA = personSchema.parse(data);

		try {
			setLoading(true);
			if (initialData !== null) {
				console.log("initialdata", initialData);
				const res = await personService.update(
					initialData.id || '',
					FORM_DATA
				);
				toast.success(`${toastMessage}`);
			}
			else {
				const res = await personService.create(FORM_DATA);
				const birthdayMessage = res.data.birthdayMessage;
				toast.success(`Cadastro realizado com sucesso! ${birthdayMessage}`);
			}
			queryClient.invalidateQueries({ queryKey: ['person'] });
			// toast.success(`${toastMessage}`);
			onClose()
		} catch (error: any) {
			console.log(error);
			toast.error(
				'Ocorreu um erro ao enviar o formulário. Por favor, verifique os campos.'
			);
		} finally {
			setLoading(false);
		}
	};


	return (
		<>
			<div className="flex mb-2 items-center justify-between">
				<div className='flex flex-col text-center w-full'>
					<h2 className="text-3xl font-bold tracking-tight">{title}</h2>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8  mx-auto  items-center justify-center"
				>
					<div className="flex gap-2 flex-col ">

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Nome"

											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex gap-2'>

							<FormField
								control={form.control}
								name="sex"
								render={({ field }) => (
									<FormItem className='w-full'>

										<FormLabel>Sexo</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												placeholder="Sexo"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="maritalStatus"
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Estado civil</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												placeholder="Estado civil"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="dateOfBirth"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Data de Nascimento</FormLabel>
										<FormControl>
											<Input
												type="date"
												placeholder="Data de nascimento"
												{...field}
												value={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex gap-2 flex-col w-full  pt-4'>
							<h1 className='font-semibold text-center'>Endereço</h1>

							<FormField
								control={form.control}
								name="addresses.zipcode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>CEP</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												placeholder="CEP"
												{...field}
												onBlur={handleCepBlur}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex gap-2 w-full'>
								<FormField
									control={form.control}
									name="addresses.city"
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Cidade</FormLabel>
											<FormControl>
												<Input
													disabled={loading || (inputsDisabled && filledByCep)}
													placeholder="Cidade"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="addresses.neighborhood"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bairro</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Bairro"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="addresses.state"
									render={({ field }) => (
										<FormItem className='w-[20%] '>
											<FormLabel>Estado</FormLabel>
											<FormControl>
												<Input
													disabled={loading || (inputsDisabled && filledByCep)}
													placeholder="Estado"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex gap-2 w-full'>
								<FormField
									control={form.control}
									name="addresses.address"
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Rua</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Rua"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="addresses.complement"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Complemento</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Complemento"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="addresses.number"
									render={({ field }) => (
										<FormItem className='w-[20%] '>
											<FormLabel>Numero</FormLabel>
											<FormControl>
												<Input

													type="number"
													min="0"
													disabled={loading}
													placeholder="Numero"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="addresses.isDefault"
								render={({ field }) => (
									<FormItem className="flex bg-card flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Endereço Padrão</FormLabel>
											<FormDescription>
												Deseja definir este endereço como seu endereço padrão.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}

												aria-readonly
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>

					<Button disabled={loading} type="submit" className="w-full text-white">

						{loading ? (
							<>
								<span className="hidden">Submitting...</span>
								<Loader2 className="animate-spin w-5 h-5 mr-3" />{' '}
							</>
						) : (
							<>
								<span className="group-hover:-traslate-y-[120%] group-hover:opacity-0 transition-all duration-500 ">
									{action}
								</span>

							</>
						)}
					</Button>
				</form>
			</Form>
		</>
	);
};
