'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-heading text-lg font-bold text-pencil mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            font-body text-lg text-pencil
            bg-paper border-2 border-pencil
            wobbly-border hard-shadow-sm
            placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-pen focus:ring-offset-2 focus:ring-offset-paper
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-marker' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-sm font-body text-pencil/60">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm font-body text-marker">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-heading text-lg font-bold text-pencil mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-3
            font-body text-lg text-pencil
            bg-paper border-2 border-pencil
            wobbly-border hard-shadow-sm
            placeholder:text-muted
            focus:outline-none focus:ring-2 focus:ring-pen focus:ring-offset-2 focus:ring-offset-paper
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? 'border-marker' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1.5 text-sm font-body text-pencil/60">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm font-body text-marker">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
