"use client";

import React, { useState, forwardRef } from 'react';

type InputVariant = 'default' | 'miner' | 'plasma' | 'error';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  size?: InputSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const getVariantStyles = () => {
    if (error) {
      return {
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderColorFocus: 'rgba(239, 68, 68, 0.8)',
        glowColor: 'rgba(239, 68, 68, 0.3)',
        accentColor: '#ef4444',
      };
    }

    switch (variant) {
      case 'miner':
        return {
          borderColor: 'rgba(19, 241, 135, 0.3)',
          borderColorFocus: 'rgba(19, 241, 135, 0.6)',
          glowColor: 'rgba(19, 241, 135, 0.2)',
          accentColor: '#13f187',
        };
      case 'plasma':
        return {
          borderColor: 'rgba(220, 149, 230, 0.3)',
          borderColorFocus: 'rgba(220, 149, 230, 0.6)',
          glowColor: 'rgba(220, 149, 230, 0.2)',
          accentColor: '#dc95e6',
        };
      case 'error':
        return {
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderColorFocus: 'rgba(239, 68, 68, 0.8)',
          glowColor: 'rgba(239, 68, 68, 0.3)',
          accentColor: '#ef4444',
        };
      default:
        return {
          borderColor: 'rgba(120, 122, 133, 0.3)',
          borderColorFocus: 'rgba(19, 241, 135, 0.5)',
          glowColor: 'rgba(19, 241, 135, 0.15)',
          accentColor: '#13f187',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '10px 14px',
          fontSize: '13px',
          iconSize: '16px',
        };
      case 'lg':
        return {
          padding: '16px 20px',
          fontSize: '16px',
          iconSize: '22px',
        };
      default:
        return {
          padding: '14px 16px',
          fontSize: '14px',
          iconSize: '18px',
        };
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label
          className="block text-xs font-mono font-semibold text-cosmic-gray uppercase tracking-wider mb-2"
          style={{
            color: isFocused ? styles.accentColor : '#787a85',
            transition: 'color 0.3s ease',
          }}
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
            style={{
              color: isFocused ? styles.accentColor : '#787a85',
              fontSize: sizeStyles.iconSize,
            }}
          >
            {icon}
          </div>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          className={`
            w-full font-body rounded-lg
            transition-all duration-300 ease-out
            placeholder:text-cosmic-gray/50
            disabled:opacity-50 disabled:cursor-not-allowed
            outline-none
          `}
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            border: `1px solid ${isFocused ? styles.borderColorFocus : styles.borderColor}`,
            boxShadow: isFocused ? `0 0 20px ${styles.glowColor}` : 'none',
            color: '#e8e8e8',
            padding: sizeStyles.padding,
            paddingLeft: icon && iconPosition === 'left' ? '48px' : sizeStyles.padding,
            paddingRight: icon && iconPosition === 'right' ? '48px' : sizeStyles.padding,
            fontSize: sizeStyles.fontSize,
            backdropFilter: 'blur(10px)',
          }}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />

        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
            style={{
              color: isFocused ? styles.accentColor : '#787a85',
              fontSize: sizeStyles.iconSize,
            }}
          >
            {icon}
          </div>
        )}

        {/* Focus glow effect */}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
              opacity: 0.3,
            }}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-xs font-body text-red-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="mt-2 text-xs font-body text-cosmic-gray">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const getVariantStyles = () => {
    if (error) {
      return {
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderColorFocus: 'rgba(239, 68, 68, 0.8)',
        glowColor: 'rgba(239, 68, 68, 0.3)',
        accentColor: '#ef4444',
      };
    }

    switch (variant) {
      case 'miner':
        return {
          borderColor: 'rgba(19, 241, 135, 0.3)',
          borderColorFocus: 'rgba(19, 241, 135, 0.6)',
          glowColor: 'rgba(19, 241, 135, 0.2)',
          accentColor: '#13f187',
        };
      case 'plasma':
        return {
          borderColor: 'rgba(220, 149, 230, 0.3)',
          borderColorFocus: 'rgba(220, 149, 230, 0.6)',
          glowColor: 'rgba(220, 149, 230, 0.2)',
          accentColor: '#dc95e6',
        };
      default:
        return {
          borderColor: 'rgba(120, 122, 133, 0.3)',
          borderColorFocus: 'rgba(19, 241, 135, 0.5)',
          glowColor: 'rgba(19, 241, 135, 0.15)',
          accentColor: '#13f187',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label
          className="block text-xs font-mono font-semibold text-cosmic-gray uppercase tracking-wider mb-2"
          style={{
            color: isFocused ? styles.accentColor : '#787a85',
            transition: 'color 0.3s ease',
          }}
        >
          {label}
        </label>
      )}

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={ref}
          className={`
            w-full font-body rounded-lg resize-none
            transition-all duration-300 ease-out
            placeholder:text-cosmic-gray/50
            disabled:opacity-50 disabled:cursor-not-allowed
            outline-none
            miner-scrollbar
          `}
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            border: `1px solid ${isFocused ? styles.borderColorFocus : styles.borderColor}`,
            boxShadow: isFocused ? `0 0 20px ${styles.glowColor}` : 'none',
            color: '#e8e8e8',
            padding: '14px 16px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
            minHeight: '120px',
          }}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-xs font-body text-red-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="mt-2 text-xs font-body text-cosmic-gray">
          {hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  variant = 'default',
  fullWidth = false,
  options,
  className = '',
  disabled,
  ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const getVariantStyles = () => {
    if (error) {
      return {
        borderColor: 'rgba(239, 68, 68, 0.5)',
        borderColorFocus: 'rgba(239, 68, 68, 0.8)',
        glowColor: 'rgba(239, 68, 68, 0.3)',
        accentColor: '#ef4444',
      };
    }

    switch (variant) {
      case 'miner':
        return {
          borderColor: 'rgba(19, 241, 135, 0.3)',
          borderColorFocus: 'rgba(19, 241, 135, 0.6)',
          glowColor: 'rgba(19, 241, 135, 0.2)',
          accentColor: '#13f187',
        };
      case 'plasma':
        return {
          borderColor: 'rgba(220, 149, 230, 0.3)',
          borderColorFocus: 'rgba(220, 149, 230, 0.6)',
          glowColor: 'rgba(220, 149, 230, 0.2)',
          accentColor: '#dc95e6',
        };
      default:
        return {
          borderColor: 'rgba(120, 122, 133, 0.3)',
          borderColorFocus: 'rgba(19, 241, 135, 0.5)',
          glowColor: 'rgba(19, 241, 135, 0.15)',
          accentColor: '#13f187',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label
          className="block text-xs font-mono font-semibold text-cosmic-gray uppercase tracking-wider mb-2"
          style={{
            color: isFocused ? styles.accentColor : '#787a85',
            transition: 'color 0.3s ease',
          }}
        >
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full font-body rounded-lg appearance-none
            transition-all duration-300 ease-out
            disabled:opacity-50 disabled:cursor-not-allowed
            outline-none cursor-pointer
          `}
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            border: `1px solid ${isFocused ? styles.borderColorFocus : styles.borderColor}`,
            boxShadow: isFocused ? `0 0 20px ${styles.glowColor}` : 'none',
            color: '#e8e8e8',
            padding: '14px 48px 14px 16px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
          }}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{
                background: '#0a0a0f',
                color: '#e8e8e8',
              }}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
          style={{ color: isFocused ? styles.accentColor : '#787a85' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-xs font-body text-red-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="mt-2 text-xs font-body text-cosmic-gray">
          {hint}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Checkbox Component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  variant?: 'default' | 'miner' | 'plasma';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  variant = 'default',
  className = '',
  ...rest
}, ref) => {
  const getAccentColor = () => {
    switch (variant) {
      case 'miner':
        return '#13f187';
      case 'plasma':
        return '#dc95e6';
      default:
        return '#13f187';
    }
  };

  const accentColor = getAccentColor();

  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          {...rest}
        />
        <div
          className="w-5 h-5 rounded border-2 transition-all duration-300 peer-checked:border-transparent peer-disabled:opacity-50"
          style={{
            borderColor: 'rgba(120, 122, 133, 0.5)',
            background: 'rgba(10, 10, 15, 0.8)',
          }}
        />
        <div
          className="absolute inset-0 rounded opacity-0 peer-checked:opacity-100 transition-all duration-300 flex items-center justify-center"
          style={{
            background: accentColor,
            boxShadow: `0 0 10px ${accentColor}50`,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000201"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      {label && (
        <span className="text-sm font-body text-star-white group-hover:text-miner-green transition-colors duration-300">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
