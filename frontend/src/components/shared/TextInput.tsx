'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type VariantType = 'primary' | 'secondary';

const variantStyles: Record<VariantType, string> = {
  primary: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
  secondary: 'border-gray-200 focus:border-green-500 focus:ring-green-500',
};

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
  variant?: VariantType;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function Input(
  { name, error, label, required, className, variant = 'primary', ...props },
  ref,
) {
  return (
    <fieldset className={cn('flex flex-col space-y-2', className)}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={name}
          name={name}
          {...props}
          className={cn(
            "w-full px-4 py-2 text-gray-700 bg-white border rounded-md transition-colors duration-200 ease-in-out",
            "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50",
            variantStyles[variant],
            error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
            "text-base"
          )}
          placeholder={props.placeholder || 'Type here...'}
        />
        {error && (
          <p className="absolute left-0 -bottom-6 text-sm text-red-500">{error}</p>
        )}
      </div>
    </fieldset>
  );
});