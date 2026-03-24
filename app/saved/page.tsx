'use client';

import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, FileCheck2 } from 'lucide-react';
import { useState } from 'react';
import SavedResumeItem from '@/components/SavedResumeItem';

const SAVED_RESUMES = [
  {
    title:    'Software Engineer Resume',
    subtitle: 'Full-Stack • React • Node.js',
    status:   'Completed' as const,
    date:     'Mar 22, 2026',
  },
  {
    title:    'Product Manager Resume',
    subtitle: 'B2B SaaS • Agile • Roadmapping',
    status:   'Draft' as const,
    date:     'Mar 20, 2026',
  },
  {
    title:    'UX Designer Portfolio',
    subtitle: 'Figma • User Research • Prototyping',
    status:   'Draft' as const,
    date:     'Mar 18, 2026',
  },
  {
    title:    'Data Scientist Resume',
    subtitle: 'Python • ML • TensorFlow',
    status:   'Completed' as const,
    date:     'Mar 10, 2026',
  },
  {
    title:    'Marketing Manager Resume',
    subtitle: 'Growth • SEO • Paid Media',
    status:   'Draft' as const,
    date:     'Mar 5, 2026',
  },
];

type Filter = 'All' | 'Completed' | 'Draft';

export default function SavedPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery]   = useState('');

  const filtered = SAVED_RESUMES.filter((r) => {
    const matchesFilter = filter === 'All' || r.status === filter;
    const matchesQuery  = r.title.toLowerCase().includes(query.toLowerCase()) ||
                          r.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-4 py-4">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Saved Resumes</h1>
        <p className="text-sm text-gray-400 mt-0.5">{SAVED_RESUMES.length} resumes saved</p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex gap-2"
      >
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-card text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <button className="w-11 h-11 bg-white rounded-2xl shadow-card flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
          <SlidersHorizontal size={18} className="text-gray-500" />
        </button>
      </motion.div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-2"
      >
        {(['All', 'Completed', 'Draft'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary-200'
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FileCheck2 size={28} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 font-medium">No resumes found</p>
          </motion.div>
        ) : (
          filtered.map((resume, i) => (
            <SavedResumeItem key={resume.title} {...resume} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
