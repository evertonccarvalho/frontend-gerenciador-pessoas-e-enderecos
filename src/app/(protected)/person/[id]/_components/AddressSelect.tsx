import { FormModal } from "@/components/formModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddressForm } from "./addressForm";
import { IAddresses } from "@/lib/schemas";
import addressesService from "@/services/addressesService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertModal } from "@/components/alert-modal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AddressCardProps {
  address: IAddresses;
  personId: string
}

const AddressSelect = ({ address, personId }: AddressCardProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openEditAddress, setOpenEditAddress] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const deletePersonMutation = useMutation({
    mutationFn: () => addressesService.delete(personId, address.id),
    onSuccess: async () => {
      toast.success("Endereço Deletado");
      setLoading(false);
      setOpenDelete(false);
      await queryClient.invalidateQueries({ queryKey: ['addresses',] });
      await queryClient.invalidateQueries({ queryKey: ['individualperson',] });
    },
    onError: (error) => {
      toast.error(`${error}`);
      setLoading(false);
      setOpenDelete(false);
    },
  });

  const handleToggleDefaultMutation = useMutation({
    mutationFn: () => addressesService.toggleDefault(personId, address.id, !address.isDefault),
    onSuccess: async () => {
      toast.success("Endereço Padrao Alterado");
      setLoading(false);
      setOpenDelete(false);
      await queryClient.invalidateQueries({ queryKey: ['addresses',] });
      await queryClient.invalidateQueries({ queryKey: ['individualperson',] });
    },
    onError: (error) => {
      toast.error(`${error}`);
      setLoading(false);
      setOpenDelete(false);
    },
  });

  return (
    <div className="py-1 w-full">
      <FormModal
        isOpen={openEditAddress}
        onClose={() => setOpenEditAddress(false)}
        onConfirm={() => setOpenEditAddress(false)}
        loading={loading}
      >
        <div className='p-2 rounded-md'>
          <AddressForm
            personId={personId}
            onClose={() => setOpenEditAddress(false)}
            initialData={address}
          />
        </div>
      </FormModal>
      <AlertModal
        variant="destructive"
        title="Tem certeza"
        description="Que deseja deletar? essa ação não pode ser desfeita."
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => deletePersonMutation.mutate()}
        loading={loading}
      />
      <div className='bg-card text-sm  p-4 rounded-md border-2 border-solid  border-primary'>
        <div className='flex flex-col p-4'>
          <div className="flex justify-between">
            <h1 className='font-bold uppercase'>{address.address}</h1>
            {address.isDefault && (
              <h1 className='font-bold text-primary uppercase'>(Padrão)</h1>

            )}
          </div>
          <p>{address.address}</p>
          <p>{address.zipcode} - {address.city}</p>
        </div>
        <div className='flex gap-2  justify-end'>
          <Button className='text-xs md:text-base' size='sm' variant='outline' onClick={() => setOpenEditAddress(true)}>Eitar</Button>
          <Button className='text-xs md:text-base' size='sm' variant='outline' onClick={() => setOpenDelete(true)}> Excluir</Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="airplane-mode">
              {address.isDefault ? "Remover Padrão" : "Definir Padrão"}
            </Label>
            <Switch
              id="airplane-mode"
              checked={address.isDefault}
              onCheckedChange={() => handleToggleDefaultMutation.mutate()}
              aria-readonly
            />


          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressSelect
