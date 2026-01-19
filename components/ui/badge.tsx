'use client';

import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted text-pencil border-pencil',
  success: 'bg-green-100 text-green-800 border-green-800',
  warning: 'bg-postit text-yellow-800 border-yellow-800',
  error: 'bg-red-100 text-marker border-marker',
  info: 'bg-blue-100 text-pen border-pen',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center px-3 py-1 text-sm font-heading font-bold border-2 wobbly-border';

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
