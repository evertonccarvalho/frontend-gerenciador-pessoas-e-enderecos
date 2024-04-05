'use client';
import { FormModal } from '@/components/formModal';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import personService from '@/services/personService';
import { ArrowUpRight, Edit, MoreHorizontal, MoreVertical, Trash, View, ViewIcon } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PersonForm } from './person-Form';
import { IPerson } from '@/lib/schemas';
import { AlertModal } from '@/components/alert-modal';
import { useRouter } from 'next/navigation';

interface CellActionProps {
	data: IPerson;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openUpdate, setOpenUpdate] = useState(false);

	const router = useRouter()
	const deletePersonMutation = useMutation({
		mutationFn: () => personService.delete(data.id || ''),
		onSuccess: async () => {
			toast.success("Pessoa Deletada");
			setLoading(false);
			setOpenDelete(false);
			await queryClient.invalidateQueries({ queryKey: ['person'] });
		},
		onError: (error) => {
			toast.error(`${error}`);
			setLoading(false);
			setOpenDelete(false);
		},
	});

	const handleDetails = () => {
		router.push(`/person/${data.id}`)
	}

	return (
		<>
			<div className="justify-end flex">
				<AlertModal
					variant="destructive"
					title="Tem certeza"
					description="Que deseja deletar? essa ação não pode ser desfeita."
					isOpen={openDelete}
					onClose={() => setOpenDelete(false)}
					onConfirm={() => deletePersonMutation.mutate()}
					loading={loading}
				/>
				{/* <FormModal
					isOpen={openUpdate}
					onClose={() => setOpenUpdate(false)}
				>
					<PersonForm
						onClose={() => setOpenUpdate(false)}
						initialData={data} />
				</FormModal> */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => handleDetails()}>
							<ArrowUpRight className="mr-2 h-4 w-4" /> Detalhes
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setOpenUpdate(true)}>
							<Edit className="mr-2 h-4 w-4" /> Atualizar
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setOpenDelete(true)}>
							<Trash className="mr-2 h-4 w-4" /> Deletar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};
