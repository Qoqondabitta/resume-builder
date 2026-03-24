'use client';

import { motion } from 'framer-motion';
import { Plus, Zap, TrendingUp, FileText } from 'lucide-react';
import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ResumeCard from '@/components/ResumeCard';

const SAMPLE_RESUMES = [
  {
    title:      'Software Engineer Resume',
    lastEdited: 'Edited 2 hours ago',
    status:     'Completed' as const,
  },
  {
    title:      'Product Manager Resume',
    lastEdited: 'Edited yesterday',
    status:     'Draft' as const,
  },
  {
    title:      'UX Designer Portfolio',
    lastEdited: 'Edited 3 days ago',
    status:     'Draft' as const,
  },
];

const STATS = [
  { label: 'Resumes',  value: '3', icon: FileText,    color: 'bg-blue-50 text-primary-600'  },
  { label: 'Complete', value: '1', icon: TrendingUp,  color: 'bg-green-50 text-green-600'   },
  { label: 'AI Edits', value: '12', icon: Zap,        color: 'bg-violet-50 text-violet-600' },
];

export default function DashboardPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-5 py-4">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-3xl p-5 text-white shadow-lg shadow-primary-200 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -right-2 w-20 h-20 bg-white/10 rounded-full" />

        <p className="text-blue-100 text-sm font-medium">Welcome back, Alex 👋</p>
        <h1 className="text-2xl font-bold mt-1 leading-tight">
          Build Your Professional<br />Resume
        </h1>
        <p className="text-blue-200 text-xs mt-2">AI-powered • ATS-optimized • 30 templates</p>

        <Button
          variant="secondary"
          size="md"
          className="mt-4 !bg-white !text-primary-700 hover:!bg-blue-50"
          icon={<Plus size={16} />}
          onClick={() => setShowNew(true)}
        >
          Create New Resume
        </Button>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="!p-3 text-center" hover>
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
            </Card>
          );
        })}
      </motion.div>

      {/* Recent resumes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Recent Resumes</h2>
          <button className="text-xs text-primary-600 font-semibold hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {SAMPLE_RESUMES.map((resume, i) => (
            <ResumeCard key={resume.title} {...resume} index={i} />
          ))}
        </div>
      </div>

      {/* Quick tip card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <Card className="border border-primary-100 !bg-primary-50 !shadow-none">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-800">AI Tip of the Day</p>
              <p className="text-xs text-primary-600 mt-0.5 leading-relaxed">
                Quantify your achievements! Resumes with numbers are 40% more likely to land interviews.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* "New resume" modal overlay (UI only) */}
      {showNew && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-end"
          onClick={() => setShowNew(false)}
        >
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 shadow-2xl"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Create New Resume</h3>
            <p className="text-sm text-gray-500 mb-5">Choose a starting point</p>

            {['Blank Resume', 'From Template', 'Import LinkedIn'].map((opt, i) => (
              <button
                key={opt}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all mb-3 text-left"
                onClick={() => setShowNew(false)}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <FileText size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{opt}</p>
                  <p className="text-xs text-gray-400">
                    {['Start from scratch', 'Pick a professional design', 'Auto-fill from LinkedIn'][i]}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowNew(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-600 rounded-2xl shadow-lg shadow-primary-300 flex items-center justify-center z-40"
      >
        <Plus size={26} className="text-white" />
      </motion.button>
    </div>
  );
}
