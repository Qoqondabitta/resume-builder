'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-200',
  secondary: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
  ghost:     'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger:    'bg-red-50 text-red-600 hover:bg-red-100',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  fullWidth = false,
  icon,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-semibold transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
