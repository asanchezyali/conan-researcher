import React from 'react';
import { cn } from '@/lib/utils';

type VariantType =
  | 'neutral'
  | 'primary'
  | 'custom'
  | 'outline'
  | 'warning'
  | 'error';

const defaultVariant = {
  variant: 'neutral' as VariantType,
};

const variantStyles = {
  neutral: {
    main: 'btn',
    active: 'btn-neutral',
  },
  primary: {
    main: 'btn btn-primary text-white btn-outline',
  },
  outline: {
    main: 'btn btn-outline btn-primary',
  },
  warning: {
    main: 'btn btn-warning',
  },
  error: {
    main: 'btn btn-outline btn-accent',
  },
};

interface ButtonVariant {
  main: string;
  active?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantType;
  isActive?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  customVariant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = defaultVariant.variant,
  isActive = false,
  leftIcon,
  rightIcon,
  customVariant,
  ...props
}) => {
  const getVariantStyles = (): ButtonVariant => {
    if (variant === 'custom' && customVariant) {
      return customVariant;
    }
    return variantStyles[variant as keyof typeof variantStyles];
  };

  const variantStyle = getVariantStyles();

  const buttonClasses = cn(
    variantStyle.main,
    isActive && variantStyle.active,
    className,
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
