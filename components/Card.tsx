'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-card p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
