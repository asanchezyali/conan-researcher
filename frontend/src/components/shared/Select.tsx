'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type VariantType = 'primary' | 'secondary';

const variantStyles: Record<VariantType, string> = {
  primary: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
  secondary: 'border-gray-200 focus:border-green-500 focus:ring-green-500',
};

export interface SelectOption {
  value: string | number;
  label: string;
}

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  error?: string;
  label: string;
  options: SelectOption[];
  variant?: VariantType;
  onChange: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { name, error, label, required, className, options, variant = 'primary', onChange, value, ...rest },
  ref,
) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <fieldset className={cn('flex flex-col space-y-2', className)}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          {...rest}
          className={cn(
            "w-full px-4 py-2 text-gray-700 bg-white border rounded-md appearance-none transition-colors duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-opacity-50",
            variantStyles[variant],
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
            "text-base pr-10"
          )}>
          <option value="">Choose an option...</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        {error && (
          <p className="absolute left-0 -bottom-6 text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    </fieldset>
  );
});