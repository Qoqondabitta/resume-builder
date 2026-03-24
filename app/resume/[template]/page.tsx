'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Printer, ChevronDown } from 'lucide-react';
import { SAMPLE_RESUME, TEMPLATE_IDS, type TemplateId } from '@/types/resume';
import ModernTemplate    from '@/components/templates/ModernTemplate';
import MinimalistTemplate from '@/components/templates/MinimalistTemplate';
import CreativeTemplate  from '@/components/templates/CreativeTemplate';
import CorporateTemplate from '@/components/templates/CorporateTemplate';
import ElegantTemplate   from '@/components/templates/ElegantTemplate';

const TEMPLATE_META: Record<TemplateId, { label: string; description: string }> = {
  modern:     { label: 'Modern',     description: 'Two-column layout with blue sidebar' },
  minimalist: { label: 'Minimalist', description: 'Clean single-column, maximum whitespace' },
  creative:   { label: 'Creative',   description: 'Bold gradient header with timeline' },
  corporate:  { label: 'Corporate',  description: 'Navy header, formal two-column style' },
  elegant:    { label: 'Elegant',    description: 'Serif-accented with gold decorative details' },
};

function renderTemplate(id: TemplateId) {
  switch (id) {
    case 'modern':     return <ModernTemplate     data={SAMPLE_RESUME} />;
    case 'minimalist': return <MinimalistTemplate data={SAMPLE_RESUME} />;
    case 'creative':   return <CreativeTemplate   data={SAMPLE_RESUME} />;
    case 'corporate':  return <CorporateTemplate  data={SAMPLE_RESUME} />;
    case 'elegant':    return <ElegantTemplate    data={SAMPLE_RESUME} />;
  }
}

export default function TemplatePreviewPage() {
  const router   = useRouter();
  const params   = useParams();
  const rawId    = typeof params.template === 'string' ? params.template : '';
  const id       = TEMPLATE_IDS.includes(rawId as TemplateId) ? (rawId as TemplateId) : 'modern';
  const meta     = TEMPLATE_META[id];

  const [showSwitcher, setShowSwitcher] = useState(false);

  // Lock body scroll while this page is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    /* Full-screen overlay — covers header + navbar */
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-100">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-200 print:hidden shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Template switcher */}
        <div className="relative">
          <button
            onClick={() => setShowSwitcher((s) => !s)}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {meta.label}
            <ChevronDown size={14} className={`transition-transform ${showSwitcher ? 'rotate-180' : ''}`} />
          </button>
          {showSwitcher && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-10">
              {TEMPLATE_IDS.map((t) => (
                <button
                  key={t}
                  onClick={() => { router.push(`/resume/${t}`); setShowSwitcher(false); }}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${t === id ? 'text-primary-600 font-bold' : 'text-gray-700'}`}
                >
                  <p className="text-sm font-semibold">{TEMPLATE_META[t].label}</p>
                  <p className="text-[11px] text-gray-400">{TEMPLATE_META[t].description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          <Printer size={15} />
          Print / PDF
        </button>
      </div>

      {/* ── Scrollable preview area ── */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        {/* Paper-like container */}
        <div className="min-h-full py-6 px-4 flex justify-center print:p-0 print:block">
          <div className="w-full max-w-[800px] bg-white shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none print:max-w-none">
            {renderTemplate(id)}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .fixed.inset-0 { display: block !important; position: static !important; overflow: visible !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:block { display: block !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:max-w-none { max-width: none !important; }
        }
      `}</style>
    </div>
  );
}
