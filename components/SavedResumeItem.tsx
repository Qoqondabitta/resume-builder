'use client';

import { motion } from 'framer-motion';
import { FileText, Edit2, Download, Trash2 } from 'lucide-react';

interface SavedResumeItemProps {
  title: string;
  subtitle: string;
  status: 'Draft' | 'Completed';
  date: string;
  index?: number;
}

const statusConfig = {
  Draft:     { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  Completed: { dot: 'bg-green-400', badge: 'bg-green-50 text-green-600 border-green-200'  },
};

export default function SavedResumeItem({ title, subtitle, status, date, index = 0 }: SavedResumeItemProps) {
  const cfg = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3"
    >
      {/* File icon */}
      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
        <FileText size={22} className="text-primary-600" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-900 text-sm truncate">{title}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge} flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {status}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
        <p className="text-xs text-gray-300 mt-0.5">{date}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors"
        >
          <Edit2 size={14} className="text-primary-600" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Download size={14} className="text-gray-500" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.88 }}
          className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
        >
          <Trash2 size={14} className="text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
}
