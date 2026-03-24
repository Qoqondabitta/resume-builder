'use client';

import { motion } from 'framer-motion';
import { FileText, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ResumeCardProps {
  title: string;
  lastEdited: string;
  status: 'Draft' | 'Completed';
  color?: string;
  index?: number;
}

const statusStyles = {
  Draft:     'bg-amber-50 text-amber-600 border border-amber-200',
  Completed: 'bg-green-50 text-green-600 border border-green-200',
};

const cardAccents = [
  'from-blue-400 to-primary-600',
  'from-violet-400 to-purple-600',
  'from-teal-400 to-emerald-600',
];

export default function ResumeCard({ title, lastEdited, status, index = 0 }: ResumeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const accent = cardAccents[index % cardAccents.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(0,0,0,0.10)' }}
      className="bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer"
    >
      {/* Colored top strip */}
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shrink-0 shadow-md`}>
            <FileText size={20} className="text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400">{lastEdited}</span>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-9 bg-white rounded-xl shadow-card-lg border border-gray-100 z-10 w-36 overflow-hidden"
              >
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Edit2 size={14} className="text-primary-500" /> Edit
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[status]}`}>
            {status}
          </span>
          <span className="text-xs text-primary-600 font-medium hover:underline">Open →</span>
        </div>
      </div>
    </motion.div>
  );
}
