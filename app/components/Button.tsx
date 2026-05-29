"use client";

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-xs min-h-[36px]',
    md: 'px-5 py-2.5 text-sm min-h-[42px]',
    lg: 'px-7 py-3.5 text-base min-h-[50px]',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-950 font-semibold border-transparent focus-visible:ring-amber-500',
    secondary:
      'bg-transparent hover:bg-amber-500/10 active:bg-amber-500/20 text-amber-400 border border-amber-500/60 hover:border-amber-400 focus-visible:ring-amber-500',
    outline:
      'bg-transparent hover:bg-white/5 active:bg-white/10 text-[#E6E8EC] border border-[#7C8AA0]/40 hover:border-[#7C8AA0] focus-visible:ring-[#7C8AA0]',
    ghost:
      'bg-white/5 hover:bg-white/10 active:bg-white/15 text-[#E6E8EC] border border-white/10 focus-visible:ring-white/30',
    danger:
      'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border-transparent focus-visible:ring-red-500',
  };

  return (
    <button
      className={[
        'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-wide',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}

export function LinkButton({
  children,
  className = '',
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  return (
    <a
      className={`text-amber-400 hover:text-amber-300 font-medium transition-colors duration-150 hover:underline underline-offset-4 ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
