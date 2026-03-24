'use client';

import { motion } from 'framer-motion';
import { Plus, Zap, TrendingUp, FileText, LayoutTemplate, Linkedin } from 'lucide-react';
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
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNew(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-6 pb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-0.5">Create New Resume</h3>
              <p className="text-sm text-gray-500">Choose a starting point</p>
            </div>

            {/* Scrollable options */}
            <div className="overflow-y-auto flex-1 px-6 pb-6">
              {([
                { label: 'Blank Resume',     desc: 'Start from scratch',           icon: FileText,       bg: 'bg-blue-50',   color: 'text-primary-600'   },
                { label: 'From Template',    desc: 'Pick a professional design',    icon: LayoutTemplate, bg: 'bg-violet-50', color: 'text-violet-600'    },
                { label: 'Import LinkedIn',  desc: 'Auto-fill from your profile',   icon: Linkedin,       bg: 'bg-sky-50',    color: 'text-sky-600'       },
              ] as const).map(({ label, desc, icon: Icon, bg, color }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 active:scale-[0.98] transition-all mb-3 text-left"
                  onClick={() => setShowNew(false)}
                >
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
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
