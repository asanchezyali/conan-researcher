'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FieldError, FormProvider } from 'react-hook-form';
import { TextInput } from '@/components/shared/TextInput';
import { TextArea } from '@/components/shared/TextArea';
import { ListInput } from '@/components/shared/ListInput';
import { Button } from '@/components/shared/Button';
import { Toggle } from '@/components/shared/Toggle';
import { ScheduleConfig } from './ScraperSchedule';
import {
  ScraperFormSchemaInputType,
  scraperFormSchema,
  Scraper,
} from '@/lib/schemas';
import { addScraper, updateScraper } from '@/api/api-client';
import {
  localTimeToUTC,
  utcToLocalTime,
} from '@/lib/utils';
import { defaultScraperFormValues } from '@/constant/form';

const scraperKindOptions = [
  { value: 'single_page', label: 'Single Page' },
  { value: 'list_page', label: 'List Page' },
];

interface ScraperFormProps {
  onSubmit: (data: ScraperFormSchemaInputType) => void;
  initialData?: ScraperFormSchemaInputType;
  isEditing?: boolean;
  closeHandler: () => void;
}

export function ScraperForm({
  onSubmit,
  initialData,
  isEditing,
  closeHandler,
}: ScraperFormProps) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const methods = useForm<ScraperFormSchemaInputType>({
    resolver: zodResolver(scraperFormSchema),
    defaultValues: defaultScraperFormValues as ScraperFormSchemaInputType,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (initialData) {
      const dataWithDefaultSchedule = {
        ...initialData,
        schedule: initialData.schedule
          ? {
              ...initialData.schedule,
              time: utcToLocalTime(initialData.schedule.time),
            }
          : {
              repeat_every: 1,
              repeat_unit: 'day' as const,
              weekdays: [],
              time: '00:00',
            },
      };
      reset(dataWithDefaultSchedule);
      setShowAdvancedOptions(!!initialData.schedule);
    } else {
      reset(defaultScraperFormValues as ScraperFormSchemaInputType);
    }
  }, [initialData, reset]);

  const handleUpdateScraper = async (data: ScraperFormSchemaInputType) => {
    const utcData = convertToUTC(data);
    const newScraper: Scraper = {
      ...utcData,
      uuid: initialData?.uuid as string,
      status: 'stopped',
    };
    try {
      const response = await updateScraper(newScraper);
      if (response.success) {
        onSubmit(response.data);
        closeHandler();
      } else {
        setErrorResponse(
          "Couldn't update scraper. This might be due to a duplicate name.",
        );
      }
    } catch (error) {
      console.error('Error updating scraper:', error);
    }
  };

  const handleAddScraper = async (data: ScraperFormSchemaInputType) => {
    const utcData = convertToUTC(data);
    try {
      const response = await addScraper(utcData);
      if (response.success) {
        onSubmit(response.data);
        closeHandler();
      } else {
        setErrorResponse(
          "Couldn't add scraper. This might be due to a duplicate name.",
        );
      }
    } catch (error) {
      console.error('Error adding scraper:', error);
    }
  };

  const handleFormSubmit = async (data: ScraperFormSchemaInputType) => {
    if (!showAdvancedOptions) {
      delete data.schedule;
    }
    if (isEditing) {
      handleUpdateScraper(data);
    } else {
      handleAddScraper(data);
    }
  };

  function convertToUTC(
    data: ScraperFormSchemaInputType,
  ): ScraperFormSchemaInputType {
    if (data.schedule) {
      return {
        ...data,
        schedule: {
          ...data.schedule,
          time: localTimeToUTC(data.schedule.time),
        },
      };
    }
    return data;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Mission Name"
              error={errors.name?.message}
              variant="primary"
              {...field}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextArea
              label="Mission Description"
              error={errors.description?.message}
              variant="primary"
              {...field}
            />
          )}
        />
        <Controller
          name="urls"
          control={control}
          render={({ field }) => (
            <ListInput
              label="Clue Locations (press Enter to add)"
              errors={errors.urls as FieldError[]}
              variant="primary"
              {...field}
            />
          )}
        />
        {errors.urls && (
          <p className="text-red-500 text-sm">{errors.urls.message}</p>
        )}

        <Toggle
          label="Secret Techniques"
          checked={showAdvancedOptions}
          onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
        />

        {showAdvancedOptions && (
          <>
            <h3 className="text-lg font-semibold text-gray-900">
              Discovery Frequency
            </h3>
            <ScheduleConfig />
          </>
        )}

        {errorResponse && (
          <p className="text-red-500 text-sm">{errorResponse}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
          {isEditing ? 'Update Mission' : 'Save Mission'}
        </Button>
      </form>
    </FormProvider>
  );
}
