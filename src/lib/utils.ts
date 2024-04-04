import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorResponse = (error: any) => {
  if (error.response && (error.response.status === 400 || error.response.status === 401)) {
    return error.response;
  }
  return error;
};