'use client';

import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldError, Merge } from 'react-hook-form';
import { Tooltip } from './Tooltip';

type VariantType = 'primary' | 'secondary';

const variantStyles: Record<VariantType, string> = {
  primary: 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
  secondary: 'border-gray-200 focus:border-green-500 focus:ring-green-500',
};

interface ListInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  errors?: Merge<FieldError | undefined, { message: string }>[] | undefined;
  label: string;
  variant?: VariantType;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const ListInput = forwardRef<HTMLInputElement, ListInputProps>(
  function ItemInput(
    {
      name,
      errors,
      label,
      required,
      className,
      value = [],
      onChange,
      variant = 'primary',
      ...props
    },
    ref,
  ) {
    const [inputValue, setInputValue] = useState('');
    const [localItems, setLocalItems] = useState<string[]>(value);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      setLocalItems(value);
    }, [value]);

    const updateItems = useCallback(
      (newItems: string[]) => {
        setLocalItems(newItems);
        if (onChange) {
          onChange(newItems);
        }
      },
      [onChange],
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        addItem();
      }
    };

    const addItem = () => {
      const trimmedInput = inputValue.trim().replace(/,+$/, '');
      if (trimmedInput && !localItems.includes(trimmedInput)) {
        updateItems([...localItems, trimmedInput]);
        setInputValue('');
      }
    };

    const removeItem = (indexToRemove: number) => {
      updateItems(localItems.filter((_, index) => index !== indexToRemove));
    };

    const truncateUrl = (url: string, maxLength: number) => {
      if (url.length <= maxLength) return url;
      return url.substr(0, maxLength) + '...';
    };

    const handleBlur = (event: React.FocusEvent<HTMLFieldSetElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        addItem();
      }
    };

    const handleRef = (
      node: HTMLInputElement | null,
      ref: React.Ref<HTMLInputElement>,
      inputRef: React.MutableRefObject<HTMLInputElement | null>,
    ) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
      inputRef.current = node;
    };

    return (
      <fieldset
        className={cn('flex flex-col space-y-2', className)}
        onBlur={handleBlur}>
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex flex-wrap gap-2 mb-2 w-full">
          {localItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1 max-w-full transition-colors duration-200 hover:bg-gray-200">
              <Tooltip text={item}>
                <span className="truncate">{truncateUrl(item, 30)}</span>
              </Tooltip>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 ml-1">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="relative">
          <input
            ref={node => handleRef(node, ref, inputRef)}
            id={name}
            name={name}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={cn(
              'w-full px-4 py-2 text-gray-700 bg-white border rounded-md transition-colors duration-200 ease-in-out',
              'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-50',
              variantStyles[variant],
              errors && errors.length > 0 ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "",
              "text-base"
            )}
            placeholder="Type an URL and press Enter"
            {...props}
          />
          {errors && errors.length > 0 && (
            <div className="absolute left-0 -bottom-6 text-sm text-red-500 mt-1">
              {errors.map((error, index) => (
                <p key={index}>{`Error in item ${index + 1}: ${error.message}`}</p>
              ))}
            </div>
          )}
        </div>
      </fieldset>
    );
  },
);