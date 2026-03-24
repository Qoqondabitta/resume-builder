'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Eye, Save, Camera, Plus, X, Check, Minus,
} from 'lucide-react';
import { SAMPLE_RESUME, type ResumeData } from '@/types/resume';
import {
  DraggableSection, FormattingBar,
  type EditorSection, type SectionType, type SectionFormatting,
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

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Default',  value: 'system-ui, sans-serif'                   },
  { label: 'Serif',    value: 'Georgia, "Times New Roman", serif'        },
  { label: 'Modern',   value: '"Trebuchet MS", Arial, sans-serif'        },
  { label: 'Mono',     value: '"Courier New", Courier, monospace'        },
  { label: 'Elegant',  value: '"Palatino Linotype", Palatino, serif'     },
  { label: 'Clean',    value: '"Century Gothic", "Futura", sans-serif'   },
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

function renderTemplate(templateId: string, data: ResumeData, sectionOrder: SectionType[]) {
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
  const params      = useParams();
  const router      = useRouter();
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

  const [activeTab,       setActiveTab]       = useState<'edit' | 'preview'>('edit');
  const [saveStatus,      setSaveStatus]      = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAddSection,  setShowAddSection]  = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Derived
  const sectionOrder   = useMemo(() => sections.map(s => s.type), [sections]);
  const activeSection  = useMemo(
    () => sections.find(s => s.id === activeSectionId) ?? null,
    [sections, activeSectionId],
  );

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

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (activeSectionId === id) setActiveSectionId(null);
  };

  const updateActiveFormatting = (patch: Partial<SectionFormatting>) => {
    if (!activeSectionId) return;
    setSections(prev => prev.map(s =>
      s.id === activeSectionId
        ? { ...s, formatting: { ...s.formatting, ...patch } }
        : s,
    ));
  };

  // ── CSS for preview ────────────────────────────────────────────────────────

  const previewCSS = useMemo(() => {
    const lines: string[] = [
      `#preview-root { font-family: ${globalFmt.fontFamily} !important; font-size: ${globalFmt.fontSize}px !important; line-height: ${globalFmt.lineHeight} !important; }`,
    ];
    sections.forEach(s => {
      const f = s.formatting;
      if (!f || Object.keys(f).length === 0) return;

      const titleRules: string[] = [];
      if (f.titleAlign)            titleRules.push(`text-align: ${f.titleAlign} !important`);
      if (f.titleBold !== undefined)
        titleRules.push(`font-weight: ${f.titleBold ? '700' : '400'} !important`);
      if (f.titleItalic !== undefined)
        titleRules.push(`font-style: ${f.titleItalic ? 'italic' : 'normal'} !important`);
      if (f.titleColor)            titleRules.push(`color: ${f.titleColor} !important`);

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
    <div
      className="fixed inset-0 z-[100] bg-gray-100 flex flex-col"
      onClick={() => setActiveSectionId(null)}
    >

      {/* ── Top bar ── */}
      <header className="shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm">
        <button
          onClick={(e) => { e.stopPropagation(); router.back(); }}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{templateLabel}</p>
          <p className="text-[10px] text-gray-400">Drag sections to reorder</p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleSave(); }}
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
          onClick={(e) => { e.stopPropagation(); router.push(`/resume/${templateId}`); }}
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
            onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
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
          onClick={e => e.stopPropagation()}
        >

          {/* ── Sticky style panel ── */}
          <StickyStylePanel
            globalFmt={globalFmt}
            onGlobalFmtChange={setGlobalFmt}
            activeSection={activeSection}
            onFormattingChange={updateActiveFormatting}
          />

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

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
                  isActive={section.id === activeSectionId}
                  onActivate={() => setActiveSectionId(section.id)}
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

// ── Sticky style panel ────────────────────────────────────────────────────────

function StickyStylePanel({
  globalFmt,
  onGlobalFmtChange,
  activeSection,
  onFormattingChange,
}: {
  globalFmt: GlobalFormatting;
  onGlobalFmtChange: (f: GlobalFormatting) => void;
  activeSection: EditorSection | null;
  onFormattingChange: (patch: Partial<SectionFormatting>) => void;
}) {
  const [showFonts, setShowFonts] = useState(false);
  const upd = (patch: Partial<GlobalFormatting>) => onGlobalFmtChange({ ...globalFmt, ...patch });

  const currentFontLabel = FONT_OPTIONS.find(f => f.value === globalFmt.fontFamily)?.label ?? 'Default';

  return (
    <div className="shrink-0 border-b border-gray-100 bg-white shadow-sm z-10">

      {/* ── Row 1: Global controls ── */}
      <div className="flex items-center gap-2 px-3 py-2 flex-wrap">

        {/* Font family picker */}
        <div className="relative">
          <button
            onClick={() => setShowFonts(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700 whitespace-nowrap"
          >
            <span style={{ fontFamily: globalFmt.fontFamily }} className="font-semibold">Aa</span>
            <span>{currentFontLabel}</span>
            <span className="text-gray-400 text-[10px]">▾</span>
          </button>
          <AnimatePresence>
            {showFonts && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-1.5 min-w-[140px]"
              >
                {FONT_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => { upd({ fontFamily: value }); setShowFonts(false); }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      globalFmt.fontFamily === value
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span style={{ fontFamily: value }} className="font-bold w-5 text-center">Aa</span>
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Font size numeric control */}
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => upd({ fontSize: Math.max(8, globalFmt.fontSize - 1) })}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Minus size={11} />
          </button>
          <span className="px-2 text-xs font-semibold text-gray-700 min-w-[36px] text-center">
            {globalFmt.fontSize}px
          </span>
          <button
            onClick={() => upd({ fontSize: Math.min(24, globalFmt.fontSize + 1) })}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Plus size={11} />
          </button>
        </div>

        {/* Line height */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
          {([
            { label: '≡',  value: 1.3, title: 'Tight'   },
            { label: '≡ ', value: 1.5, title: 'Normal'  },
            { label: '☰',  value: 1.8, title: 'Relaxed' },
          ] as { label: string; value: number; title: string }[]).map(({ label, value, title }) => (
            <button
              key={value}
              title={title}
              onClick={() => upd({ lineHeight: value })}
              className={`px-2 py-1.5 text-xs transition-colors ${
                globalFmt.lineHeight === value
                  ? 'bg-primary-100 text-primary-700 font-bold'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 2: Active section formatting ── */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden border-t border-primary-100 bg-primary-50/40"
          >
            <div className="px-3 py-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider whitespace-nowrap">
                {activeSection.title}
              </span>
              <div className="flex-1">
                <FormattingBar
                  compact
                  formatting={activeSection.formatting ?? {}}
                  onChange={onFormattingChange}
                />
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
