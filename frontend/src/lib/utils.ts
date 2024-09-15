import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function localTimeToUTC(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  const utcHours = date.getUTCHours().toString().padStart(2, '0');
  const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${utcHours}:${utcMinutes}`;
}

export function utcToLocalTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setUTCHours(Number(hours));
  date.setUTCMinutes(Number(minutes));
  const localHours = date.getHours().toString().padStart(2, '0');
  const localMinutes = date.getMinutes().toString().padStart(2, '0');

  return `${localHours}:${localMinutes}`;
}

export function localToUTC(dateTimeString: string | Date): string {
  const date = new Date(dateTimeString);
  return date.toISOString().split('Z')[0];
}

export function utcToLocal(dateTimeString: string | Date): string {
  const date = new Date(dateTimeString);
  return date.toLocaleString().split(',')[0];
}
