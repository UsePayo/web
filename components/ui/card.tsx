'use client';

import { HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'postit' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hasTape?: boolean;
  rotate?: 'left' | 'right' | 'none';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-paper border-2 border-pencil',
  postit: 'bg-postit border-2 border-pencil',
  outlined: 'bg-transparent border-2 border-dashed border-pencil',
};

const rotateStyles = {
  left: 'rotate-[-1deg]',
  right: 'rotate-[1deg]',
  none: '',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hasTape = false,
      rotate = 'none',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'p-6 wobbly-border hard-shadow';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${rotateStyles[rotate]} ${hasTape ? 'tape-strip mt-4' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`mb-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`font-heading text-xl font-bold text-pencil ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`font-body ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';
