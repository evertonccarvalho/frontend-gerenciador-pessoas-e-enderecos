'use client';
import { useQuery } from '@tanstack/react-query';
import BreadCrumb from '@/components/breadcrumb';
import { useState } from 'react';
import Loader from '@/components/loader';
import personService from '@/services/personService';
import { MailIcon, MapPin, MapPinnedIcon, Settings, User } from 'lucide-react';
import { FormModal } from '@/components/formModal';
import { IPerson } from '@/lib/schemas';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { AddressForm } from './_components/addressForm';
import { Button } from '@/components/ui/button';
import AddressSelect from './_components/AddressSelect';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddressComponent from './_components/addressComponent';


type paramsProps = {
  params: {
    id: string
  };
};

const PersonSetailsPage = ({ params }: paramsProps) => {
  const breadcrumbItems = [{ title: 'Detalhes', link: `/person/${params.id}` }];

  const { data, isLoading, isError, refetch } = useQuery<IPerson>({
    queryKey: ['individualperson'],
    queryFn: () => personService.getById(params.id),
  });


  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }


  return (
    <>
      <div className="flex-1 space-y-4 bg-card/80  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex w-full flex-col md:flex-row gap-2">
          <section className="flex flex-1 p-4 gap-2 flex-col bg-card rounded-md">
            <div className="flex gap-2 ">
              <User className="text-primary" />
              <h3 className="text-base font-bold capitalize">Nome: {data?.name}</h3>
            </div>
            <div className='ml-8'>
              <p className='text-sm'> Sexo: {data?.sex}</p>
              <p className='text-sm'> Estado Civil: {data?.maritalStatus}</p>
              <p className='text-sm'> Data de nascimento: {data?.dateOfBirth ? format(data.dateOfBirth, 'dd/MM/yyyy', { locale: ptBR }) : 'Data de nascimento não disponível'}</p>
            </div>
            {data?.defaultAddress && ( // Verifica se data.defaultAddress está definido
              <div>
                <div className="flex gap-2">
                  <MapPinnedIcon className="text-primary" />
                  <h3 className="text-base font-bold">Endereço padrão</h3>
                </div>
                <div className='ml-8'>
                  <p className='text-sm'> {data.defaultAddress.address}, {data.defaultAddress.number}, </p>
                  <p className='text-sm'>{data.defaultAddress.zipcode}, {data.defaultAddress.city} {data.defaultAddress.state}</p>
                </div>
              </div>
            )}


          </section>
        </div>


        <AddressComponent personId={params.id} />



      </div>
    </>
  );
};
export default PersonSetailsPage;
