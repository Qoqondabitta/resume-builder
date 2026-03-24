'use client';

import { Sparkles, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center shadow-md">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Resume<span className="text-primary-600">AI</span>
          </span>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary-50 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </motion.header>
  );
}
