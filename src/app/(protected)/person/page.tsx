'use client';
import { useQuery } from '@tanstack/react-query';
import { Heading } from '@/components/heading';
import { Plus } from 'lucide-react';
import { Button, } from '@/components/ui/button';
import { useState } from 'react';
import Loader from '@/components/loader';
import { FormModal } from '@/components/formModal';
import { PersonForm } from './_components/person-Form';
import { PersonTable } from './_components/person-table';
import { columnsPerson } from './_components/person-columns';
import { Separator } from '@/components/ui/separator';
import personService from '@/services/personService';

import { IPerson } from '@/lib/schemas';
import { formatDateString } from './_components/dateUtils';

type paramsProps = {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
};

const PersonPage = ({ searchParams }: paramsProps) => {
	const [open, setOpen] = useState(false);

	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['person'],
		queryFn: () => personService.index(),
	});


	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>Error fetching data</div>;
	}

	const pageLimit = Number(searchParams.limit) || 10;

	const total = data.length;
	const pageCount = Math.ceil(total / pageLimit);


	const formattedData = data.map((person: IPerson) => {
		const { id, name, sex, dateOfBirth, maritalStatus, addresses } = person;
		const formattedDateOfBirth = formatDateString(dateOfBirth);
		return { id, name, sex, maritalStatus, addresses, dateOfBirth: formattedDateOfBirth };
	});


	return (
		<>
			<div className="flex-1 space-y-4 bg-card/80  p-4 md:p-8 pt-6">
				<FormModal
					loading={isLoading}
					isOpen={open}
					onClose={() => setOpen(false)}>
					<PersonForm
						onClose={() => setOpen(false)}
						initialData={null} />
				</FormModal>
				<div className="flex items-start justify-between">
					<Heading
						title={`Pessoas (${total})`}
						description="Gerencie Pessoas"
					/>

					<Button onClick={() => setOpen(true)}>
						<Plus className="mr-2 h-4 w-4" /> Novo
					</Button>
				</div>
				<Separator />

				<PersonTable
					searchKey="name"
					columns={columnsPerson}
					data={formattedData}
					pageCount={pageCount}
				/>
			</div>
		</>
	);
};
export default PersonPage;
