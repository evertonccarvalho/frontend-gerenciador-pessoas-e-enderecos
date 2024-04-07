import { PersonInitalData } from './person-Form';
import { convertDateFormat } from './dateUtils';

export const getDefaultValues = (initialData: PersonInitalData | null) => {
  if (!initialData) {
    return getDefaultEmptyValues();
  }

  const formattedDateOfBirth = isDateOfBirthValidFormat(initialData.dateOfBirth)
    ? initialData.dateOfBirth
    : convertDateFormat(initialData.dateOfBirth);

  return {
    ...initialData,
    dateOfBirth: formattedDateOfBirth ?? ''
  };
};

const getDefaultEmptyValues = () => ({
  name: '',
  sex: '',
  dateOfBirth: '',
  maritalStatus: '',
  addresses: {
    address: '',
    number: 0,
    complement: '',
    neighborhood: '',
    zipcode: '',
    city: '',
    state: '',
    isDefault: true
  }
});

const isDateOfBirthValidFormat = (dateString: string) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);
