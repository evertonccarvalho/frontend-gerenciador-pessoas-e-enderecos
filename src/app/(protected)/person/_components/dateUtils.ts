import { format } from 'date-fns';

export const formatDateString = (dateString: string | undefined | null): string | null => {
  if (!dateString) return null;

  try {
    const dateOfBirthDate = new Date(dateString);
    if (isNaN(dateOfBirthDate.getTime())) {
      throw new Error('Invalid date');
    }
    return format(dateOfBirthDate, 'dd-MM-yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

export const convertDateFormat = (dateString: string): string => {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};
