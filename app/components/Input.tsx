"use client";

import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}, ref) => {
  const sizeStyles: Record<string, string> = {
    sm: 'px-3 py-2 text-xs min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[42px]',
    lg: 'px-4 py-3 text-base min-h-[50px]',
  };

  const borderClass = error
    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
    : 'border-[#7C8AA0]/25 focus:border-amber-500/70 focus:ring-amber-500/10';

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-xs font-medium text-[#7C8AA0] uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7C8AA0] pointer-events-none">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          className={[
            'w-full rounded-lg bg-[#0E1116] border text-[#E6E8EC] placeholder-[#7C8AA0]/50',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeStyles[size],
            borderClass,
            icon && iconPosition === 'left' ? 'pl-10' : '',
            icon && iconPosition === 'right' ? 'pr-10' : '',
            className,
          ].join(' ')}
          disabled={disabled}
          {...rest}
        />

        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8AA0] pointer-events-none">
            {icon}
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-[#7C8AA0]">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
