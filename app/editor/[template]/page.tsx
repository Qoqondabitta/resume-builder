'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Camera, Plus, X, Check } from 'lucide-react';
import { SAMPLE_RESUME, type ResumeData } from '@/types/resume';
import { DraggableSection, type EditorSection, type SectionType } from '@/components/editor/SectionBlock';

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

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EditorPage() {
  const params     = useParams();
  const router     = useRouter();
  const templateId = (params?.template as string) ?? 'modern';
  const storageKey = `resume-editor-${templateId}`;

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

  const [saveStatus,     setSaveStatus]     = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAddSection, setShowAddSection] = useState(false);

  // ── Auto-save (debounced) ──────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(data));
      localStorage.setItem(`${storageKey}-sections`, JSON.stringify(sections));
    }, 800);
    return () => clearTimeout(timer);
  }, [data, sections, storageKey]);

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
    setTimeout(() => setSaveStatus('saved'), 300);
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [storageKey, data, sections]);

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
    setSections(prev => [
      ...prev,
      {
        id: `${type}-${Date.now()}`,
        type,
        title: label,
        ...(type === 'custom' ? { customContent: [] } : {}),
      },
    ]);
    setShowAddSection(false);
  };

  const updateSection = (id: string, updated: EditorSection) =>
    setSections(prev => prev.map(s => s.id === id ? updated : s));

  const deleteSection = (id: string) =>
    setSections(prev => prev.filter(s => s.id !== id));

  // ── Render ─────────────────────────────────────────────────────────────────

  const templateLabel = TEMPLATE_LABELS[templateId] ?? 'Resume';
  const photoWidth    = data.photoWidth ?? 64;

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
          <p className="text-[10px] text-gray-400">Drag to reorder · Click to edit section</p>
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
      </header>

      {/* ── Scrollable editor ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile</p>

          <div className="flex items-start gap-3">
            {/* Photo upload */}
            <label className="relative cursor-pointer group shrink-0">
              <div
                className="rounded-2xl bg-gray-200 overflow-hidden flex items-center justify-center"
                style={{ width: photoWidth, height: photoWidth }}
              >
                {data.photoUrl
                  ? <img src={data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  : <Camera size={Math.round(photoWidth * 0.3)} className="text-gray-400" />
                }
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={14} className="text-white" />
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>

            <div className="flex-1 space-y-1.5 min-w-0">
              <ProfileInput value={data.name}  placeholder="Full Name" onChange={v => setData(d => ({ ...d, name: v }))}  className="font-semibold" />
              <ProfileInput value={data.title} placeholder="Job Title" onChange={v => setData(d => ({ ...d, title: v }))} />

              {/* Photo size slider */}
              {data.photoUrl && (
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] text-gray-400 shrink-0">Size</span>
                  <input
                    type="range" min={40} max={120} value={photoWidth}
                    onChange={e => setData(d => ({ ...d, photoWidth: Number(e.target.value) }))}
                    className="flex-1 h-1.5 accent-primary-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400 w-7 text-right shrink-0">{photoWidth}px</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact fields */}
          <div className="grid grid-cols-2 gap-1.5">
            <ProfileInput value={data.email}          placeholder="Email"    onChange={v => setData(d => ({ ...d, email: v }))} />
            <ProfileInput value={data.phone}          placeholder="Phone"    onChange={v => setData(d => ({ ...d, phone: v }))} />
            <ProfileInput value={data.location}       placeholder="Location" onChange={v => setData(d => ({ ...d, location: v }))} />
            <ProfileInput value={data.website ?? ''}  placeholder="Website"  onChange={v => setData(d => ({ ...d, website: v }))} />
            <ProfileInput
              value={data.linkedin ?? ''}
              placeholder="LinkedIn"
              onChange={v => setData(d => ({ ...d, linkedin: v }))}
              className="col-span-2"
            />
          </div>
        </div>

        {/* Draggable sections */}
        <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-2">
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
