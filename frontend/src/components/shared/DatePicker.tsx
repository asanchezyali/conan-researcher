'use client';

import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { cn } from '@/lib/utils';

type VariantType = 'primary' | 'secondary';

const variantStyles: Record<VariantType, string> = {
  primary: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  secondary: 'border-gray-200 focus:border-green-500 focus:ring-green-500',
};

interface DatePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  variant?: VariantType;
  className?: string;
}

export const DatePicker = forwardRef<ReactDatePicker, DatePickerProps>(function DatePicker(
  { label, selected, onChange, error, variant = 'primary', className, ...rest },
  ref
) {
  return (
    <div className={cn('flex flex-col', className)}>
      <label className="text-sm font-semibold mb-1 text-black">{label}</label>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        className={cn(
          "w-full pl-4 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1",
          variantStyles[variant],
          error && "border-red-500"
        )}
        {...rest}
      />
      {error && <span className="text-sm text-red-600 mt-1">{error}</span>}
    </div>
  );
});