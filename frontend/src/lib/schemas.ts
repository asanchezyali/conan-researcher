import { z } from 'zod';

export const scheduleSchema = z.object({
  repeat_every: z.number().min(1),
  repeat_unit: z.enum(['day', 'week', 'month']),
  weekdays: z.array(z.number().min(0).max(6)).optional(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format',
  }),
});

export const scraperFormSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, { message: 'Task name is required' }),
  urls: z
    .array(z.string().url({ message: 'Invalid URL' }))
    .min(1, { message: 'At least one URL is required' }),
  description: z.string().optional(),
  schedule: scheduleSchema.optional(),
});

export type ScraperFormSchemaInputType = z.input<typeof scraperFormSchema>;
export type ScraperFormSchemaOutputType = z.output<typeof scraperFormSchema>;

export interface Scraper extends ScraperFormSchemaInputType {
  uuid: string;
  status: 'running' | 'stopped' | 'ready' | 'failed';
  results?: any[];
}
