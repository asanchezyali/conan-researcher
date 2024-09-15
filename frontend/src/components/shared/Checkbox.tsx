'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type VariantType = 'primary' | 'secondary';

const variantStyles: Record<VariantType, string> = {
  primary: 'bg-blue-700 border-blue-600',
  secondary: 'bg-green-600 border-green-600',
};

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  variant?: VariantType;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { name, label, error, className, variant = 'primary', ...rest },
  ref,
) {
  return (
    <div className={cn('inline-flex flex-col', className)}>
      <label className="inline-flex items-center cursor-pointer">
        <input
          id={name}
          name={name}
          type="checkbox"
          ref={ref}
          className="sr-only"
          {...rest}
        />
        <div
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ease-in-out',
            rest.checked
              ? variantStyles[variant]
              : 'border-gray-300 bg-white hover:border-gray-400',
            error && 'border-red-500',
          )}>
          {rest.checked && <Check size={14} className="text-white" />}
        </div>
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';