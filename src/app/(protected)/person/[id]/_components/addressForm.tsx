'use client';
import * as z from 'zod';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import addressesService from '@/services/addressesService';
import { Heading } from '@/components/heading';
import { Switch } from '@/components/ui/switch';
import { addressSchema, IAddresses, updateAddressSchema } from '@/lib/schemas';
import { brasilApiCep } from '@/services/cepService';

type AddressFormValues = z.infer<typeof addressSchema>;
export type AddressInitalData = z.infer<typeof updateAddressSchema>;

interface FormProps {
	initialData: IAddresses | null;
	onClose: () => void;
	personId: string;
}

export const AddressForm: React.FC<FormProps> = ({
	initialData,
	personId,
	onClose,
}) => {
	const [loading, setLoading] = useState(false);
	const title = initialData ? 'Editar Endereço' : 'Novo Endereço';
	const description = initialData
		? 'Editar o endereço.'
		: 'Adicionar novo endereço';
	const toastMessage = initialData ? 'Endereço Atualizado.' : 'Endereço Criado.';
	const action = initialData ? 'Salvar Alterações' : 'Criar';
	const queryClient = useQueryClient();
	const [filledByCep, setFilledByCep] = useState(false);
	const [inputsDisabled, setInputsDisabled] = useState(false);

	const fetchAddressFromCep = async (cep: string) => {
		try {
			const addressData = await brasilApiCep().getAddress(cep);
			form.setValue('zipcode', addressData.cep);
			form.setValue('city', addressData.city);
			form.setValue('neighborhood', addressData.neighborhood);
			form.setValue('state', addressData.state);
			form.setValue('address', addressData.street);
			form.setValue('complement', addressData.complement);
			setFilledByCep(true)
			setInputsDisabled(true);
		} catch (error) {
			console.error('Erro ao buscar endereço:', error);
		}
	};

	const handleCepBlur = async () => {
		const cep = form.getValues('zipcode');
		if (cep) {
			await fetchAddressFromCep(cep);
		}
	};
	const defaultValues = initialData
		? initialData
		: {
			address: "",
			number: 0,
			complement: "",
			neighborhood: "",
			zipcode: "",
			city: "",
			state: "",
			isDefault: true
		};

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues,
	});



	const onSubmit = async (data: z.infer<typeof addressSchema>) => {
		try {
			setLoading(true);
			if (initialData) {
				const res = await addressesService.update(
					personId,
					initialData.id!,
					data,
				);
				console.log('resupdate', res)
			} else {
				const res = await addressesService.create(personId, data);
			}
			queryClient.invalidateQueries({ queryKey: ['addresses'] });
			queryClient.invalidateQueries({ queryKey: ['individualperson'] });
			toast.success(`${toastMessage}`);
			onClose();
			form.reset();
		} catch (error: any) {
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
				<Heading title={title} description={description} />
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className=" gap-2 mx-auto flex flex-col items-center justify-center"
				>
					<div className='flex gap-2 flex-col w-full pt-4'>
						<FormField
							control={form.control}
							name="zipcode"
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
						<div className='flex gap-2'>
							<FormField
								control={form.control}
								name="city"
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
								name="neighborhood"
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
								name="state"
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
						<div className='flex gap-2'>

							<FormField
								control={form.control}
								name="address"
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
								name="complement"
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
								name="number"
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
							name="isDefault"
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
