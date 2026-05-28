"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
  hideCloseButton?: boolean;
  variant?: 'default' | 'plasma' | 'critical';
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = '4xl',
  hideCloseButton = false,
  variant = 'default'
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getMaxWidthClass = () => {
    const widthMap = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
      '4xl': 'sm:max-w-4xl',
      '6xl': 'sm:max-w-6xl',
      full: 'sm:max-w-full'
    };
    return widthMap[maxWidth];
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'plasma':
        return {
          accentColor: '#dc95e6',
          glowColor: 'rgba(220, 149, 230, 0.4)',
          borderColor: 'rgba(220, 149, 230, 0.3)',
          gradientFrom: '#dc95e6',
          gradientTo: '#a855f7',
        };
      case 'critical':
        return {
          accentColor: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.4)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          gradientFrom: '#ef4444',
          gradientTo: '#dc2626',
        };
      default:
        return {
          accentColor: '#13f187',
          glowColor: 'rgba(19, 241, 135, 0.4)',
          borderColor: 'rgba(19, 241, 135, 0.3)',
          gradientFrom: '#13f187',
          gradientTo: '#00f5ff',
        };
    }
  };

  const styles = getVariantStyles();

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* ORBITRADE Void Background */}
      <div
        className="fixed inset-0 transition-all duration-700 ease-out"
        onClick={handleBackdropClick}
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(19, 241, 135, 0.08), transparent 50%),
            radial-gradient(ellipse at bottom, rgba(220, 149, 230, 0.06), transparent 50%),
            radial-gradient(ellipse at left, rgba(0, 245, 255, 0.04), transparent 50%),
            radial-gradient(ellipse at right, rgba(168, 85, 247, 0.04), transparent 50%),
            linear-gradient(180deg, #000201 0%, #0a0a0f 50%, #0a2419 100%)
          `
        }}
      >
        {/* Miner Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(19, 241, 135, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(19, 241, 135, 0.2) 1px, transparent 1px),
              linear-gradient(rgba(220, 149, 230, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 149, 230, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px'
          }}
        />

        {/* Floating Miner Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `radial-gradient(circle, ${['#13f187', '#dc95e6', '#00f5ff', '#c8ff00'][i % 4]
                  }, transparent)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                boxShadow: `0 0 ${6 + Math.random() * 10}px ${['#13f187', '#dc95e6', '#00f5ff', '#c8ff00'][i % 4]
                  }`
              }}
            />
          ))}
        </div>

        {/* Orbital Bio-Rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] border rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(19, 241, 135, 0.15)',
              animation: 'spin 25s linear infinite'
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(220, 149, 230, 0.1)',
              animation: 'spin 20s linear infinite reverse'
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] border rounded-full"
            style={{
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(0, 245, 255, 0.08)',
              animation: 'spin 15s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
        <div
          className={`
            relative w-full ${getMaxWidthClass()}
            max-h-[90vh] flex flex-col
            transform transition-all duration-500 ease-out
            ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
          `}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Outer Glow */}
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl animate-pulse"
            style={{
              background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
              opacity: 0.5
            }}
          />

          {/* Main Modal Shell */}
          <div
            className="relative overflow-hidden rounded-2xl backdrop-blur-xl flex flex-col h-full"
            style={{
              background: `
                linear-gradient(180deg,
                  rgba(10, 10, 15, 0.95) 0%,
                  rgba(10, 36, 25, 0.9) 100%
                )
              `,
              border: `1px solid ${styles.borderColor}`,
              boxShadow: `
                0 0 60px ${styles.glowColor},
                inset 0 0 60px rgba(19, 241, 135, 0.02),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
              `
            }}
          >

            {/* Top Accent Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${styles.accentColor}, transparent)`
              }}
            />

            {/* Holographic Corner Brackets */}
            <div
              className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg"
              style={{ borderColor: styles.accentColor, opacity: 0.8 }}
            />
            <div
              className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg"
              style={{ borderColor: styles.accentColor, opacity: 0.8 }}
            />
            <div
              className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg"
              style={{ borderColor: styles.accentColor, opacity: 0.8 }}
            />
            <div
              className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg"
              style={{ borderColor: styles.accentColor, opacity: 0.8 }}
            />

            {/* Bio-Scan Effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: `linear-gradient(90deg, transparent, ${styles.accentColor}15, transparent)`,
                animation: 'minerScan 5s ease-in-out infinite'
              }}
            />

            {/* Header */}
            {(title || !hideCloseButton) && (
              <div
                className="relative flex items-center justify-between p-5 pb-4 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(19, 241, 135, 0.1)' }}
              >
                {title && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: styles.accentColor,
                        boxShadow: `0 0 8px ${styles.accentColor}`
                      }}
                    />
                    <h2
                      className="text-lg font-display font-bold uppercase tracking-wider"
                      style={{
                        background: `linear-gradient(135deg, ${styles.gradientFrom}, ${styles.gradientTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: `0 0 30px ${styles.glowColor}`
                      }}
                    >
                      {title}
                    </h2>
                  </div>
                )}

                {!hideCloseButton && (
                  <button
                    onClick={handleClose}
                    className="relative group p-2 rounded-lg transition-all duration-300"
                    style={{
                      background: 'rgba(10, 10, 15, 0.5)',
                      border: '1px solid rgba(120, 122, 133, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(120, 122, 133, 0.3)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    type="button"
                  >
                    <svg
                      className="w-5 h-5 text-cosmic-gray group-hover:text-red-400 transition-colors duration-300"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Modal Content - Scrollable */}
            <div className="relative flex-1 overflow-y-auto miner-scrollbar">
              {children}
            </div>

            {/* Bottom Status Bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${styles.gradientFrom}, ${styles.gradientTo}, transparent)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes minerScan {
          0% {
            transform: translateX(-100%) skewX(-15deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .miner-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(19, 241, 135, 0.4) rgba(10, 10, 15, 0.3);
        }

        .miner-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .miner-scrollbar::-webkit-scrollbar-track {
          background: rgba(10, 10, 15, 0.3);
          border-radius: 3px;
        }

        .miner-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(19, 241, 135, 0.4);
          border-radius: 3px;
        }

        .miner-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(19, 241, 135, 0.6);
        }
      `}</style>
    </div>,
    document.body
  );
};

export default Modal;
