"use client";

import React from 'react';

type CardVariant = 'default' | 'accent' | 'critical' | 'info';

interface CardProps {
  title: string;
  value: React.ReactNode;
  subTitle?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: CardVariant;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export function Card({
  title,
  value,
  subTitle,
  className = '',
  children,
  variant = 'default',
  icon,
  isActive = false,
  onClick,
}: CardProps) {
  const variantStyles: Record<CardVariant, { border: string; accent: string }> = {
    default: {
      border: isActive ? 'border-amber-500/50' : 'border-[#7C8AA0]/20 hover:border-[#7C8AA0]/40',
      accent: '#E6E8EC',
    },
    accent: {
      border: isActive ? 'border-amber-500/70' : 'border-amber-500/30 hover:border-amber-500/60',
      accent: '#F5A524',
    },
    critical: {
      border: 'border-red-500/30 hover:border-red-500/60',
      accent: '#ef4444',
    },
    info: {
      border: 'border-[#7C8AA0]/30 hover:border-[#7C8AA0]/60',
      accent: '#7C8AA0',
    },
  };

  const { border, accent } = variantStyles[variant];

  return (
    <div
      className={[
        'rounded-xl border bg-[#161A21] p-5 transition-all duration-200',
        border,
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-[#7C8AA0] uppercase tracking-wider">{title}</span>
        {icon && <span className="text-[#7C8AA0]">{icon}</span>}
      </div>

      <div className="text-2xl font-semibold" style={{ color: accent }}>
        {value}
      </div>

      {subTitle && (
        <div className="mt-1 text-xs text-[#7C8AA0]">{subTitle}</div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
