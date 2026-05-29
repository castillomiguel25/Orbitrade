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
  variant?: 'default' | 'accent' | 'critical';
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = '4xl',
  hideCloseButton = false,
  variant = 'default',
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      document.body.style.overflow = '';
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const widthMap: Record<string, string> = {
    sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl', '2xl': 'sm:max-w-2xl', '4xl': 'sm:max-w-4xl',
    '6xl': 'sm:max-w-6xl', full: 'sm:max-w-full',
  };

  const accentColor = variant === 'critical' ? '#ef4444' : variant === 'accent' ? '#F5A524' : '#F5A524';
  const borderColor = variant === 'critical' ? 'rgba(239,68,68,0.25)' : 'rgba(245,165,36,0.2)';

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={[
          'relative w-full max-h-[90vh] flex flex-col',
          'rounded-xl border bg-[#161A21]',
          'transition-all duration-200',
          widthMap[maxWidth],
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2',
        ].join(' ')}
        style={{ borderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#7C8AA0]/15 flex-shrink-0">
            {title && (
              <h2 className="text-base font-semibold text-[#E6E8EC] tracking-wide">{title}</h2>
            )}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                type="button"
                className="ml-auto p-1.5 rounded-lg text-[#7C8AA0] hover:text-[#E6E8EC] hover:bg-white/8 transition-colors duration-150"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
