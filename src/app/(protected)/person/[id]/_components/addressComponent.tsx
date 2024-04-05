"use client"
import { FormModal } from "@/components/formModal";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { AddressForm } from "./addressForm";
import { Button } from "@/components/ui/button";
import AddressSelect from "./AddressSelect";
import { IAddresses } from "@/lib/schemas";
import addressesService from "@/services/addressesService";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface AddressComponentProps {
  personId: string
}

const AddressComponent = ({ personId }: AddressComponentProps) => {

  const [openNewAddress, setOpenNewAddresss] = useState(false);
  const { data: addressesData, isLoading } = useQuery<IAddresses[]>({
    queryKey: ['addresses'],
    queryFn: () => addressesService.fetchAll(personId),
  });

  return (
    <>
      <div className="flex w-full flex-col md:flex-row gap-2">
        <section className="flex  flex-1 p-4 gap-4 flex-col bg-card rounded-md">
          <div className=" flex itemc justify-between pr-4">
            <div className="flex gap-2 ">
              <MapPin className="text-primary" />
              <h3 className="text-lg font-bold">Endereços</h3>
            </div>
            <Button className=' text-xs max-w-2xl md:text-base' size='sm' variant='default' onClick={() => setOpenNewAddresss(true)}>Novo Endereço</Button>
          </div>

          <FormModal
            isOpen={openNewAddress}
            onClose={() => setOpenNewAddresss(false)}
            onConfirm={() => setOpenNewAddresss(false)}
          >
            <div className='p-4  rounded-md'>
              <AddressForm
                personId={personId}
                onClose={() => setOpenNewAddresss(false)}
                initialData={null}
              />
            </div>
          </FormModal>
          {isLoading ? (
            <p>Carregando endereços...</p>
          ) : (
            <ScrollArea id="Items" className="flex  gap-2 max-h-[450px] pr-4 rounded-md'">
              {addressesData?.map(address => (
                <AddressSelect
                  personId={personId}
                  key={address.id}
                  address={address}
                />
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          )}
        </section>

      </div>
    </>
  );
}

export default AddressComponent;