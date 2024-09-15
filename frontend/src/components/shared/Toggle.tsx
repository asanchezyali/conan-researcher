'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type VariantType = 'primary' | 'secondary';

const variantStyles: Record<VariantType, string> = {
  primary: 'bg-blue-700',
  secondary: 'bg-green-600',
};

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: VariantType;
  error?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, variant = 'primary', error, className, id, ...props },
  ref,
) {
  const toggleId = id || `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative">
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only"
          ref={ref}
          {...props}
        />
        <label
          htmlFor={toggleId}
          className="flex items-center cursor-pointer"
        >
          <div
            className={cn(
              'block w-12 h-6 rounded-full',
              props.checked ? variantStyles[variant] : 'bg-gray-300',
            )}
          />
          <div
            className={cn(
              'dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition',
              props.checked && 'transform translate-x-6',
            )}
          />
        </label>
      </div>
      <label
        htmlFor={toggleId}
        className="ml-3 text-sm text-gray-700 font-semibold cursor-pointer"
      >
        {label}
      </label>
      {error && <span className="text-sm text-red-600 ml-2">{error}</span>}
    </div>
  );
});