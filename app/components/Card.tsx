"use client";

import React, { useState } from 'react';

type CardVariant = 'default' | 'miner' | 'plasma' | 'critical' | 'info';

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
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'miner':
        return {
          background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.9) 0%, rgba(10, 36, 25, 0.8) 100%)',
          borderColor: 'rgba(19, 241, 135, 0.3)',
          borderColorHover: 'rgba(19, 241, 135, 0.6)',
          glowColor: 'rgba(19, 241, 135, 0.4)',
          accentColor: '#13f187',
          valueColor: '#13f187',
        };
      case 'plasma':
        return {
          background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.9) 0%, rgba(168, 85, 247, 0.1) 100%)',
          borderColor: 'rgba(220, 149, 230, 0.3)',
          borderColorHover: 'rgba(220, 149, 230, 0.6)',
          glowColor: 'rgba(220, 149, 230, 0.4)',
          accentColor: '#dc95e6',
          valueColor: '#dc95e6',
        };
      case 'critical':
        return {
          background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.9) 0%, rgba(239, 68, 68, 0.1) 100%)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          borderColorHover: 'rgba(239, 68, 68, 0.6)',
          glowColor: 'rgba(239, 68, 68, 0.4)',
          accentColor: '#ef4444',
          valueColor: '#ef4444',
        };
      case 'info':
        return {
          background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.9) 0%, rgba(0, 245, 255, 0.1) 100%)',
          borderColor: 'rgba(0, 245, 255, 0.3)',
          borderColorHover: 'rgba(0, 245, 255, 0.6)',
          glowColor: 'rgba(0, 245, 255, 0.4)',
          accentColor: '#00f5ff',
          valueColor: '#00f5ff',
        };
      default:
        return {
          background: 'rgba(10, 10, 15, 0.8)',
          borderColor: 'rgba(120, 122, 133, 0.2)',
          borderColorHover: 'rgba(19, 241, 135, 0.3)',
          glowColor: 'rgba(19, 241, 135, 0.2)',
          accentColor: '#787a85',
          valueColor: '#e8e8e8',
        };
    }
  };

  const styles = getVariantStyles();
  const isClickable = !!onClick;

  return (
    <div
      className={`
        relative p-5 rounded-xl
        transition-all duration-300 ease-out
        backdrop-blur-xl
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: styles.background,
        border: `1px solid ${isHovered ? styles.borderColorHover : styles.borderColor}`,
        boxShadow: isHovered
          ? `0 0 30px ${styles.glowColor}, inset 0 0 30px rgba(19, 241, 135, 0.02)`
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        transform: isHovered && isClickable ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl overflow-hidden"
        style={{
          background: `linear-gradient(90deg, transparent, ${styles.accentColor}, transparent)`,
          opacity: isHovered ? 0.8 : 0.4,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono font-semibold text-cosmic-gray uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {isActive && (
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: styles.accentColor,
                boxShadow: `0 0 8px ${styles.accentColor}`,
              }}
            />
          )}
          {icon && (
            <div
              className="text-lg transition-colors duration-300"
              style={{ color: isHovered ? styles.accentColor : '#787a85' }}
            >
              {icon}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="mb-1">
        <p
          className="text-2xl font-mono font-bold tracking-tight"
          style={{
            color: styles.valueColor,
            textShadow: isHovered ? `0 0 20px ${styles.glowColor}` : 'none',
            transition: 'text-shadow 0.3s ease',
          }}
        >
          {value}
        </p>
        {subTitle && (
          <p className="text-xs text-cosmic-gray mt-1 font-body">
            {subTitle}
          </p>
        )}
      </div>

      {/* Children content */}
      {children && (
        <div className="mt-4 pt-4 border-t border-white/5">
          {children}
        </div>
      )}

      {/* Hover glow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${styles.glowColor}15 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

// Stats Card - simpler version for dashboards
interface StatsCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  trendValue,
  className = '',
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#13f187';
      case 'down':
        return '#ef4444';
      default:
        return '#787a85';
    }
  };

  return (
    <div
      className={`
        stats-card p-4 rounded-xl
        bg-deep-space/80 border border-cosmic-gray/20
        backdrop-blur-lg
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-cosmic-gray uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-miner-green text-lg">{icon}</span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="stats-value text-2xl font-mono font-bold text-miner-green">
          {value}
        </span>
        {trend && trendValue && (
          <span
            className="text-xs font-mono flex items-center gap-1"
            style={{ color: getTrendColor() }}
          >
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

// Creature Card - for displaying miner creatures/NFTs
interface CreatureCardProps {
  name: string;
  image: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: {
    plasma: number;
    duration: number;
    price: number;
  };
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export function CreatureCard({
  name,
  image,
  rarity = 'common',
  stats,
  onClick,
  className = '',
  selected = false,
}: CreatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getRarityStyles = () => {
    switch (rarity) {
      case 'legendary':
        return {
          borderColor: '#c8ff00',
          glowColor: 'rgba(200, 255, 0, 0.4)',
          badgeClass: 'badge-rare',
        };
      case 'epic':
        return {
          borderColor: '#a855f7',
          glowColor: 'rgba(168, 85, 247, 0.4)',
          badgeClass: 'badge-plasma',
        };
      case 'rare':
        return {
          borderColor: '#00f5ff',
          glowColor: 'rgba(0, 245, 255, 0.4)',
          badgeClass: 'badge-miner',
        };
      default:
        return {
          borderColor: 'rgba(19, 241, 135, 0.3)',
          glowColor: 'rgba(19, 241, 135, 0.2)',
          badgeClass: 'badge-miner',
        };
    }
  };

  const rarityStyles = getRarityStyles();

  return (
    <div
      className={`
        creature-card relative overflow-hidden rounded-xl cursor-pointer
        transition-all duration-300 ease-out
        ${selected ? 'ring-2 ring-miner-green' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 36, 25, 0.9) 100%)',
        border: `1px solid ${isHovered || selected ? rarityStyles.borderColor : 'rgba(19, 241, 135, 0.2)'}`,
        boxShadow: isHovered || selected
          ? `0 0 40px ${rarityStyles.glowColor}`
          : '0 4px 20px rgba(0, 0, 0, 0.4)',
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${rarityStyles.borderColor}, transparent)`,
          opacity: isHovered || selected ? 1 : 0.5,
        }}
      />

      {/* Rarity badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={rarityStyles.badgeClass}>
          {rarity.toUpperCase()}
        </span>
      </div>

      {/* Image container */}
      <div className="relative aspect-square p-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain rounded-lg"
          style={{
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
            transition: 'filter 0.3s ease',
          }}
        />
      </div>

      {/* Info section */}
      <div className="p-4 pt-0">
        <h3 className="font-display font-bold text-star-white text-lg mb-2 truncate">
          {name}
        </h3>

        {stats && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-cosmic-gray font-mono">Plasma</div>
              <div className="text-miner-green font-bold">{stats.plasma}%</div>
            </div>
            <div className="text-center">
              <div className="text-cosmic-gray font-mono">Days</div>
              <div className="text-plasma-pink font-bold">{stats.duration}</div>
            </div>
            <div className="text-center">
              <div className="text-cosmic-gray font-mono">Price</div>
              <div className="text-star-white font-bold">${stats.price}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${rarityStyles.glowColor}20 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
