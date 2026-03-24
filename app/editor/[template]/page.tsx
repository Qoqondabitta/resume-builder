'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Eye, Save, Camera, Plus, X, Check, ChevronDown, ChevronUp, Type,
} from 'lucide-react';
import { SAMPLE_RESUME, type ResumeData } from '@/types/resume';
import {
  DraggableSection, type EditorSection, type SectionType,
} from '@/components/editor/SectionBlock';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalistTemplate from '@/components/templates/MinimalistTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import CorporateTemplate from '@/components/templates/CorporateTemplate';
import ElegantTemplate from '@/components/templates/ElegantTemplate';

// ── Constants ─────────────────────────────────────────────────────────────────

const TEMPLATE_LABELS: Record<string, string> = {
  modern: 'Modern', minimalist: 'Minimalist', creative: 'Creative',
  corporate: 'Corporate', elegant: 'Elegant',
};

const DEFAULT_SECTIONS: EditorSection[] = [
  { id: 'summary',        type: 'summary',        title: 'Summary'        },
  { id: 'experience',     type: 'experience',     title: 'Experience'     },
  { id: 'education',      type: 'education',      title: 'Education'      },
  { id: 'skills',         type: 'skills',         title: 'Skills'         },
  { id: 'projects',       type: 'projects',       title: 'Projects'       },
  { id: 'achievements',   type: 'achievements',   title: 'Achievements'   },
  { id: 'certifications', type: 'certifications', title: 'Certifications' },
  { id: 'languages',      type: 'languages',      title: 'Languages'      },
];

const ADDABLE_SECTIONS: { type: SectionType; label: string }[] = [
  { type: 'summary',        label: 'Summary'        },
  { type: 'experience',     label: 'Experience'     },
  { type: 'education',      label: 'Education'      },
  { type: 'skills',         label: 'Skills'         },
  { type: 'projects',       label: 'Projects'       },
  { type: 'achievements',   label: 'Achievements'   },
  { type: 'certifications', label: 'Certifications' },
  { type: 'languages',      label: 'Languages'      },
  { type: 'custom',         label: 'Custom Section' },
];

const FONT_OPTIONS: { label: string; value: string; preview: string }[] = [
  { label: 'Default',    value: 'system-ui, sans-serif',                      preview: 'Aa' },
  { label: 'Serif',      value: 'Georgia, "Times New Roman", serif',          preview: 'Aa' },
  { label: 'Modern',     value: '"Trebuchet MS", Arial, sans-serif',          preview: 'Aa' },
  { label: 'Mono',       value: '"Courier New", Courier, monospace',          preview: 'Aa' },
  { label: 'Elegant',    value: '"Palatino Linotype", Palatino, serif',       preview: 'Aa' },
  { label: 'Clean',      value: '"Century Gothic", "Futura", sans-serif',     preview: 'Aa' },
];

const CONTENT_SIZE_MAP: Record<'xs' | 'sm' | 'base', string> = {
  xs: '10px', sm: '12px', base: '14px',
};

const LINE_HEIGHT_MAP: Record<'tight' | 'normal' | 'relaxed', string> = {
  tight: '1.3', normal: '1.5', relaxed: '1.8',
};

// ── Global formatting interface ───────────────────────────────────────────────

interface GlobalFormatting {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

const DEFAULT_GLOBAL_FMT: GlobalFormatting = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: 14,
  lineHeight: 1.5,
};

// ── Template renderer ─────────────────────────────────────────────────────────

function renderTemplate(
  templateId: string,
  data: ResumeData,
  sectionOrder: SectionType[],
) {
  const props = { data, sectionOrder };
  switch (templateId) {
    case 'minimalist': return <MinimalistTemplate {...props} />;
    case 'creative':   return <CreativeTemplate   {...props} />;
    case 'corporate':  return <CorporateTemplate  {...props} />;
    case 'elegant':    return <ElegantTemplate    {...props} />;
    default:           return <ModernTemplate     {...props} />;
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EditorPage() {
  const params  = useParams();
  const router  = useRouter();
  const templateId  = (params?.template as string) ?? 'modern';
  const storageKey  = `resume-editor-${templateId}`;

  // ── State ──────────────────────────────────────────────────────────────────

  const [data, setData] = useState<ResumeData>(() => {
    if (typeof window === 'undefined') return SAMPLE_RESUME;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored) as ResumeData;
    } catch { /* ignore */ }
    return { ...SAMPLE_RESUME };
  });

  const [sections, setSections] = useState<EditorSection[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_SECTIONS;
    try {
      const stored = localStorage.getItem(`${storageKey}-sections`);
      if (stored) return JSON.parse(stored) as EditorSection[];
    } catch { /* ignore */ }
    return [...DEFAULT_SECTIONS];
  });

  const [globalFmt, setGlobalFmt] = useState<GlobalFormatting>(() => {
    if (typeof window === 'undefined') return DEFAULT_GLOBAL_FMT;
    try {
      const stored = localStorage.getItem(`${storageKey}-fmt`);
      if (stored) return JSON.parse(stored) as GlobalFormatting;
    } catch { /* ignore */ }
    return DEFAULT_GLOBAL_FMT;
  });

  const [activeTab,      setActiveTab]      = useState<'edit' | 'preview'>('edit');
  const [saveStatus,     setSaveStatus]     = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAddSection, setShowAddSection] = useState(false);

  // Derived section order (types only, for templates)
  const sectionOrder = useMemo(() => sections.map(s => s.type), [sections]);

  // ── Auto-save (debounced) ──────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(data));
      localStorage.setItem(`${storageKey}-sections`, JSON.stringify(sections));
      localStorage.setItem(`${storageKey}-fmt`, JSON.stringify(globalFmt));
    }, 800);
    return () => clearTimeout(timer);
  }, [data, sections, globalFmt, storageKey]);

  // ── Scroll lock ────────────────────────────────────────────────────────────

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Explicit save ──────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    setSaveStatus('saving');
    localStorage.setItem(storageKey, JSON.stringify(data));
    localStorage.setItem(`${storageKey}-sections`, JSON.stringify(sections));
    localStorage.setItem(`${storageKey}-fmt`, JSON.stringify(globalFmt));
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [storageKey, data, sections, globalFmt]);

  // ── Photo upload ───────────────────────────────────────────────────────────

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setData(d => ({ ...d, photoUrl: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }, []);

  // ── Section management ─────────────────────────────────────────────────────

  const addSection = (type: SectionType) => {
    const label = ADDABLE_SECTIONS.find(s => s.type === type)?.label ?? 'Section';
    const newSection: EditorSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: label,
      ...(type === 'custom' ? { customContent: [] } : {}),
    };
    setSections(prev => [...prev, newSection]);
    setShowAddSection(false);
  };

  const updateSection = (id: string, updated: EditorSection) =>
    setSections(prev => prev.map(s => s.id === id ? updated : s));

  const deleteSection = (id: string) =>
    setSections(prev => prev.filter(s => s.id !== id));

  // ── CSS for preview ────────────────────────────────────────────────────────

  const previewCSS = useMemo(() => {
    const lines: string[] = [
      `#preview-root { font-family: ${globalFmt.fontFamily} !important; font-size: ${globalFmt.fontSize}px !important; line-height: ${globalFmt.lineHeight} !important; }`,
    ];
    sections.forEach(s => {
      const f = s.formatting;
      if (!f || Object.keys(f).length === 0) return;

      const titleRules: string[] = [];
      if (f.titleAlign)   titleRules.push(`text-align: ${f.titleAlign} !important`);
      if (f.titleBold !== undefined)
        titleRules.push(`font-weight: ${f.titleBold ? '700' : '400'} !important`);
      if (f.titleItalic !== undefined)
        titleRules.push(`font-style: ${f.titleItalic ? 'italic' : 'normal'} !important`);
      if (f.titleColor)   titleRules.push(`color: ${f.titleColor} !important`);

      if (titleRules.length) {
        lines.push(
          `#preview-root [data-section="${s.type}"] .section-title { ${titleRules.join('; ')} }`,
          `#preview-root [data-section="${s.type}"] .section-title * { ${titleRules.join('; ')} }`,
        );
      }

      const contentRules: string[] = [];
      if (f.contentSize)
        contentRules.push(`font-size: ${CONTENT_SIZE_MAP[f.contentSize]} !important`);
      if (f.lineHeight)
        contentRules.push(`line-height: ${LINE_HEIGHT_MAP[f.lineHeight]} !important`);

      if (contentRules.length) {
        lines.push(
          `#preview-root [data-section="${s.type}"] .section-content { ${contentRules.join('; ')} }`,
          `#preview-root [data-section="${s.type}"] .section-content * { ${contentRules.join('; ')} }`,
        );
      }
    });
    return lines.join('\n');
  }, [globalFmt, sections]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const templateLabel = TEMPLATE_LABELS[templateId] ?? 'Resume';

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col">

      {/* ── Top bar ── */}
      <header className="shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{templateLabel}</p>
          <p className="text-[10px] text-gray-400">Drag sections to reorder</p>
        </div>

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
            saveStatus === 'saved'
              ? 'border-green-300 bg-green-50 text-green-600'
              : 'border-primary-200 text-primary-600 hover:bg-primary-50'
          }`}
        >
          {saveStatus === 'saved' ? <Check size={13} /> : <Save size={13} />}
          <span className="hidden sm:inline">
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : 'Save'}
          </span>
        </button>

        <button
          onClick={() => router.push(`/resume/${templateId}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Eye size={13} />
          <span className="hidden sm:inline">Preview</span>
        </button>
      </header>

      {/* ── Mobile tab bar ── */}
      <div className="shrink-0 md:hidden flex border-b border-gray-200 bg-white">
        {(['edit', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
              activeTab === tab
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Split pane ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Editor panel ── */}
        <div
          className={`
            w-full md:w-[420px] shrink-0 flex flex-col overflow-hidden bg-white border-r border-gray-200
            ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}
          `}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {/* Global formatting panel */}
            <GlobalFormattingPanel formatting={globalFmt} onChange={setGlobalFmt} />

            {/* Profile card */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile</p>

              {/* Photo upload */}
              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer group shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 overflow-hidden flex items-center justify-center">
                    {data.photoUrl
                      ? <img src={data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                      : <Camera size={20} className="text-gray-400" />
                    }
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={14} className="text-white" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
                <div className="flex-1 space-y-1.5">
                  <ProfileInput value={data.name}  placeholder="Full Name"  onChange={v => setData(d => ({ ...d, name: v }))}  className="font-semibold" />
                  <ProfileInput value={data.title} placeholder="Job Title"  onChange={v => setData(d => ({ ...d, title: v }))} />
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-2 gap-1.5">
                <ProfileInput value={data.email}    placeholder="Email"    onChange={v => setData(d => ({ ...d, email: v }))} />
                <ProfileInput value={data.phone}    placeholder="Phone"    onChange={v => setData(d => ({ ...d, phone: v }))} />
                <ProfileInput value={data.location} placeholder="Location" onChange={v => setData(d => ({ ...d, location: v }))} />
                <ProfileInput value={data.website ?? ''} placeholder="Website" onChange={v => setData(d => ({ ...d, website: v }))} />
                <ProfileInput
                  value={data.linkedin ?? ''}
                  placeholder="LinkedIn"
                  onChange={v => setData(d => ({ ...d, linkedin: v }))}
                  className="col-span-2"
                />
              </div>
            </div>

            {/* Draggable sections */}
            <Reorder.Group
              axis="y"
              values={sections}
              onReorder={setSections}
              className="space-y-2"
            >
              {sections.map(section => (
                <DraggableSection
                  key={section.id}
                  section={section}
                  data={data}
                  onDataChange={setData}
                  onRename={title => updateSection(section.id, { ...section, title })}
                  onDelete={() => deleteSection(section.id)}
                  onSectionChange={updated => updateSection(section.id, updated)}
                />
              ))}
            </Reorder.Group>

            {/* Add section */}
            <div className="relative">
              <button
                onClick={() => setShowAddSection(v => !v)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-xs font-semibold text-gray-400 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/50 transition-all"
              >
                <Plus size={14} />
                Add Section
              </button>

              <AnimatePresence>
                {showAddSection && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-10"
                  >
                    <div className="flex items-center justify-between px-2 py-1 mb-1">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Add Section</p>
                      <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {ADDABLE_SECTIONS.map(({ type, label }) => (
                        <button
                          key={type}
                          onClick={() => addSection(type)}
                          className="text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save button (bottom) */}
            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] ${
                saveStatus === 'saved'
                  ? 'bg-green-500 text-white shadow-green-200 shadow-md'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200 shadow-md'
              }`}
            >
              {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Changes Saved!' : 'Save Resume'}
            </button>

            <div className="h-6" />
          </div>
        </div>

        {/* ── Preview panel ── */}
        <div
          className={`
            flex-1 overflow-y-auto bg-gray-100
            ${activeTab === 'edit' ? 'hidden md:block' : 'block'}
          `}
        >
          {/* Injected formatting CSS */}
          <style dangerouslySetInnerHTML={{ __html: previewCSS }} />

          <div className="min-h-full p-4 sm:p-6 lg:p-8 flex justify-center">
            <div className="w-full max-w-[800px] bg-white shadow-xl rounded-lg overflow-hidden">
              <div id="preview-root">
                {renderTemplate(templateId, data, sectionOrder)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Global formatting panel ───────────────────────────────────────────────────

function GlobalFormattingPanel({
  formatting,
  onChange,
}: {
  formatting: GlobalFormatting;
  onChange: (f: GlobalFormatting) => void;
}) {
  const [open, setOpen] = useState(false);
  const upd = (patch: Partial<GlobalFormatting>) => onChange({ ...formatting, ...patch });

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Type size={14} className="text-gray-500" />
          <span className="text-xs font-bold text-gray-700">Typography & Style</span>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-100">

              {/* Font family */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Font Family</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {FONT_OPTIONS.map(({ label, value, preview }) => (
                    <button
                      key={value}
                      onClick={() => upd({ fontFamily: value })}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        formatting.fontFamily === value
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div
                        className="text-sm font-semibold leading-none mb-0.5"
                        style={{ fontFamily: value }}
                      >
                        {preview}
                      </div>
                      <div className="text-[9px] font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Base Size</p>
                <div className="flex gap-2">
                  {([12, 14, 16] as const).map((sz, i) => (
                    <button
                      key={sz}
                      onClick={() => upd({ fontSize: sz })}
                      className={`flex-1 py-2 text-xs rounded-xl border transition-all ${
                        formatting.fontSize === sz
                          ? 'border-primary-300 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {['Small', 'Medium', 'Large'][i]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line height */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Line Spacing</p>
                <div className="flex gap-2">
                  {([
                    { label: 'Tight',   value: 1.3 },
                    { label: 'Normal',  value: 1.5 },
                    { label: 'Relaxed', value: 1.8 },
                  ]).map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => upd({ lineHeight: value })}
                      className={`flex-1 py-2 text-xs rounded-xl border transition-all ${
                        formatting.lineHeight === value
                          ? 'border-primary-300 bg-primary-50 text-primary-700 font-semibold'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Profile input ─────────────────────────────────────────────────────────────

function ProfileInput({
  value, placeholder, onChange, className = '',
}: {
  value: string; placeholder: string;
  onChange: (v: string) => void; className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={`
        w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent
        placeholder:text-gray-300 transition-all
        ${className}
      `}
    />
  );
}
