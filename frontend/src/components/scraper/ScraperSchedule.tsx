import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/TextInput';
import { Select } from '@/components/shared/Select';
import { Checkbox } from '@/components/shared/Checkbox';

interface Day {
  value: number;
  label: string;
}

const weekdays: Day[] = [
  { value: 0, label: 'S' },
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
];

export const ScheduleConfig: React.FC = () => {
  const { control, watch } = useFormContext();
  const repeatUnit = watch('schedule.repeat_unit');

  const handleRepeatEveryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    onChange(parseInt(event.target.value));
  };

  const handleWeekdaysChange = (
    checked: boolean,
    dayValue: number,
    currentValues: number[],
    onChange: (value: number[]) => void,
  ) => {
    const updatedWeekdays = checked
      ? [...currentValues, dayValue]
      : currentValues.filter(value => value !== dayValue);
    onChange(updatedWeekdays);
  };
  return (
    <div className="rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          name="schedule.repeat_every"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Explore every"
              type="number"
              min={1}
              {...field}
              onChange={event => handleRepeatEveryChange(event, field.onChange)}
            />
          )}
        />
        <Controller
          name="schedule.repeat_unit"
          control={control}
          render={({ field }) => (
            <Select
              label="Unit"
              options={[
                { value: 'day', label: 'Day(s)' },
                { value: 'week', label: 'Week(s)' },
              ]}
              {...field}
            />
          )}
        />
        <Controller
          name="schedule.time"
          control={control}
          defaultValue="00:00"
          render={({ field }) => (
            <TextInput label="Time" type="time" {...field} />
          )}
        />
      </div>

      {repeatUnit === 'week' && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekdays
          </label>
          <Controller
            name="schedule.weekdays"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-4 justify-start">
                {weekdays.map(day => (
                  <Checkbox
                    key={day.value}
                    label={day.label}
                    checked={field.value?.includes(day.value)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleWeekdaysChange(
                        event.target.checked,
                        day.value,
                        field.value || [],
                        field.onChange,
                      );
                    }}
                  />
                ))}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};
