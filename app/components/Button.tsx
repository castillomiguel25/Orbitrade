"use client";

import React, { useState } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'plasma' | 'danger' | 'cosmic';
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
  glowing?: boolean;
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
  glowing = false,
  disabled,
  ...rest
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isDisabled = disabled || loading;

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[36px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]',
  };

  // Base styles for all buttons
  const baseClasses = `
    relative font-display font-bold uppercase tracking-wider
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void-black
    overflow-hidden rounded-lg
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
  `;

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: isPressed
            ? 'linear-gradient(135deg, #0a9f5a 0%, #13f187 100%)'
            : 'linear-gradient(135deg, #0a9f5a 0%, #13f187 100%)',
          color: '#000201',
          boxShadow: isHovered && !isDisabled
            ? '0 0 40px rgba(19, 241, 135, 0.6), 0 0 80px rgba(19, 241, 135, 0.3)'
            : '0 0 20px rgba(19, 241, 135, 0.4)',
          border: 'none',
          focusRing: 'focus:ring-[#13f187]',
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: '#13f187',
          boxShadow: isHovered && !isDisabled
            ? '0 0 20px rgba(19, 241, 135, 0.3)'
            : 'none',
          border: '2px solid #13f187',
          focusRing: 'focus:ring-[#13f187]',
        };
      case 'outline':
        return {
          background: isHovered && !isDisabled
            ? 'rgba(19, 241, 135, 0.1)'
            : 'transparent',
          color: '#13f187',
          boxShadow: isHovered && !isDisabled
            ? '0 0 15px rgba(19, 241, 135, 0.2)'
            : 'none',
          border: '1px solid rgba(19, 241, 135, 0.5)',
          focusRing: 'focus:ring-[#13f187]',
        };
      case 'ghost':
        return {
          background: isHovered && !isDisabled
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.05)',
          color: '#e8e8e8',
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          focusRing: 'focus:ring-white/30',
        };
      case 'plasma':
        return {
          background: 'linear-gradient(135deg, #dc95e6 0%, #a855f7 100%)',
          color: '#000201',
          boxShadow: isHovered && !isDisabled
            ? '0 0 40px rgba(220, 149, 230, 0.6)'
            : '0 0 20px rgba(220, 149, 230, 0.4)',
          border: 'none',
          focusRing: 'focus:ring-[#dc95e6]',
        };
      case 'danger':
        return {
          background: isPressed
            ? 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)'
            : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          color: '#ffffff',
          boxShadow: isHovered && !isDisabled
            ? '0 0 30px rgba(239, 68, 68, 0.5)'
            : '0 0 15px rgba(239, 68, 68, 0.3)',
          border: 'none',
          focusRing: 'focus:ring-red-500',
        };
      case 'cosmic':
        return {
          background: 'linear-gradient(135deg, #00f5ff 0%, #13f187 50%, #dc95e6 100%)',
          color: '#000201',
          boxShadow: isHovered && !isDisabled
            ? '0 0 50px rgba(0, 245, 255, 0.5), 0 0 80px rgba(19, 241, 135, 0.3)'
            : '0 0 25px rgba(0, 245, 255, 0.4)',
          border: 'none',
          focusRing: 'focus:ring-[#00f5ff]',
        };
      default:
        return {
          background: 'linear-gradient(135deg, #0a9f5a 0%, #13f187 100%)',
          color: '#000201',
          boxShadow: '0 0 20px rgba(19, 241, 135, 0.4)',
          border: 'none',
          focusRing: 'focus:ring-[#13f187]',
        };
    }
  };

  const styles = getVariantStyles();

  const transform = isPressed && !isDisabled
    ? 'translateY(1px) scale(0.98)'
    : isHovered && !isDisabled
      ? 'translateY(-2px)'
      : 'translateY(0)';

  return (
    <button
      className={`${baseClasses} ${styles.focusRing} ${className}`}
      style={{
        background: styles.background,
        color: styles.color,
        boxShadow: styles.boxShadow,
        border: styles.border,
        transform,
        backdropFilter: variant === 'ghost' ? 'blur(10px)' : undefined,
      }}
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...rest}
    >
      {/* Top glow line */}
      {(variant === 'primary' || variant === 'plasma' || variant === 'cosmic') && (
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            opacity: isHovered ? 1 : 0.5,
          }}
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg
            className="animate-spin h-5 w-5"
            style={{ color: styles.color }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Button content */}
      <div
        className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </div>

      {/* Hover shimmer effect */}
      {isHovered && !isDisabled && (variant === 'primary' || variant === 'plasma' || variant === 'cosmic') && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      )}
    </button>
  );
}

// Export a simple link-styled button for navigation
export function LinkButton({
  children,
  className = '',
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  return (
    <a
      className={`
        text-miner-green hover:text-miner-green-light
        font-body font-medium
        transition-all duration-300
        hover:underline underline-offset-4
        ${className}
      `}
      {...rest}
    >
      {children}
    </a>
  );
}
