'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Plus, Trash2, Eye, EyeOff, GripVertical,
  Check, Camera, PanelLeft, Minus,
} from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  CanvasResumeData, ResumeSection, SectionPosition, DEFAULT_RESUME,
} from '@/types/canvas-resume';
import ModernCanvas from '@/components/canvas/ModernCanvas';
import ClassicCanvas from '@/components/canvas/ClassicCanvas';
import MinimalCanvas from '@/components/canvas/MinimalCanvas';

const STORAGE_KEY = 'canvas-resume-data';

const FONT_FAMILIES = [
  { label: 'Inter',     value: "'Inter', sans-serif" },
  { label: 'Georgia',   value: "'Georgia', serif" },
  { label: 'Helvetica', value: "'Helvetica Neue', Arial, sans-serif" },
  { label: 'Times',     value: "'Times New Roman', serif" },
];

export default function EditorPage() {
  const params     = useParams();
  const router     = useRouter();
  const templateId = (params?.template as string) ?? 'modern';

  const [data,           setData]           = useState<CanvasResumeData>(DEFAULT_RESUME);
  const [saveStatus,     setSaveStatus]     = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showSidebar,    setShowSidebar]    = useState(true);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ── Load from localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // ── Lock body scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = useCallback(() => {
    setSaveStatus('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTimeout(() => setSaveStatus('saved'),  500);
    setTimeout(() => setSaveStatus('idle'),  2200);
  }, [data]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  // ── Style helpers ─────────────────────────────────────────────────────────
  const updateStyles = (patch: Partial<CanvasResumeData['styles']>) =>
    setData(d => ({ ...d, styles: { ...d.styles, ...patch } }));

  // B/I/U apply to the currently-selected text via execCommand
  const execFormat = (cmd: string) => document.execCommand(cmd);

  // ── Section helpers ───────────────────────────────────────────────────────
  const addSection = () => {
    const title = newSectionTitle.trim() || 'New Section';
    const newSection: ResumeSection = {
      id: `section-${Date.now()}`,
      title,
      content: 'Click here to start editing this section.',
      position: 'full',
      visible: true,
    };
    setData(d => ({ ...d, sections: [...d.sections, newSection] }));
    setNewSectionTitle('');
    setShowAddSection(false);
  };

  const deleteSection    = (id: string) =>
    setData(d => ({ ...d, sections: d.sections.filter(s => s.id !== id) }));

  const toggleVisible    = (id: string) =>
    setData(d => ({
      ...d,
      sections: d.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s),
    }));

  const setPosition = (id: string, position: SectionPosition) =>
    setData(d => ({
      ...d,
      sections: d.sections.map(s => s.id === id ? { ...s, position } : s),
    }));

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev =>
      setData(d => ({
        ...d,
        personalInfo: { ...d.personalInfo, photoUrl: ev.target?.result as string },
      }));
    reader.readAsDataURL(file);
  };

  // ── Canvas renderer ───────────────────────────────────────────────────────
  const renderCanvas = () => {
    const props = { data, onDataChange: setData };
    switch (templateId) {
      case 'classic': return <ClassicCanvas {...props} />;
      case 'minimal': return <MinimalCanvas {...props} />;
      default:        return <ModernCanvas  {...props} />;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-100">

      {/* ══════════════════════════════════════════════════════════════════
          TOP TOOLBAR
      ══════════════════════════════════════════════════════════════════ */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center gap-1 px-2 shrink-0 overflow-x-auto">

        {/* Back */}
        <button
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 shrink-0"
          title="Back to home"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Sidebar toggle */}
        <button
          onClick={() => setShowSidebar(v => !v)}
          className={`p-2 rounded-lg shrink-0 transition-colors ${showSidebar ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}
          title="Toggle sidebar"
        >
          <PanelLeft size={16} />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Template switcher */}
        {(['modern', 'classic', 'minimal'] as const).map(t => (
          <button
            key={t}
            onClick={() => router.push(`/editor/${t}`)}
            className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize shrink-0 transition-colors ${
              templateId === t
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Font family */}
        <select
          value={data.styles.fontFamily}
          onChange={e => updateStyles({ fontFamily: e.target.value })}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700 shrink-0 cursor-pointer"
        >
          {FONT_FAMILIES.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Font size */}
        <div className="flex items-center border border-gray-200 rounded overflow-hidden shrink-0">
          <button
            onMouseDown={e => { e.preventDefault(); updateStyles({ fontSize: Math.max(8, data.styles.fontSize - 1) }); }}
            className="px-1.5 py-1 hover:bg-gray-100 text-gray-600"
          >
            <Minus size={12} />
          </button>
          <span className="text-xs px-1.5 min-w-[28px] text-center text-gray-700 tabular-nums">
            {data.styles.fontSize}
          </span>
          <button
            onMouseDown={e => { e.preventDefault(); updateStyles({ fontSize: Math.min(20, data.styles.fontSize + 1) }); }}
            className="px-1.5 py-1 hover:bg-gray-100 text-gray-600"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* B / I / U — use onMouseDown+preventDefault to keep canvas selection */}
        {([
          { icon: <Bold      size={13} />, cmd: 'bold' },
          { icon: <Italic    size={13} />, cmd: 'italic' },
          { icon: <Underline size={13} />, cmd: 'underline' },
        ] as const).map(({ icon, cmd }) => (
          <button
            key={cmd}
            onMouseDown={e => { e.preventDefault(); execFormat(cmd); }}
            className="p-2 hover:bg-gray-100 rounded text-gray-600 shrink-0"
            title={cmd}
          >
            {icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Alignment */}
        {([
          { icon: <AlignLeft   size={13} />, cmd: 'justifyLeft'   },
          { icon: <AlignCenter size={13} />, cmd: 'justifyCenter' },
          { icon: <AlignRight  size={13} />, cmd: 'justifyRight'  },
        ] as const).map(({ icon, cmd }) => (
          <button
            key={cmd}
            onMouseDown={e => { e.preventDefault(); execFormat(cmd); }}
            className="p-2 hover:bg-gray-100 rounded text-gray-600 shrink-0"
          >
            {icon}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Font color */}
        <label className="flex items-center gap-1 shrink-0 cursor-pointer" title="Text color">
          <span className="text-xs font-bold text-gray-500">A</span>
          <input
            type="color"
            value={data.styles.textColor}
            onChange={e => updateStyles({ textColor: e.target.value })}
            className="w-5 h-5 cursor-pointer border-0 rounded"
          />
        </label>

        {/* Accent color */}
        <label className="flex items-center gap-1 shrink-0 cursor-pointer" title="Accent color">
          <span className="text-xs text-gray-500">●</span>
          <input
            type="color"
            value={data.styles.accentColor}
            onChange={e => updateStyles({ accentColor: e.target.value })}
            className="w-5 h-5 cursor-pointer border-0 rounded"
          />
        </label>

        <div className="flex-1 min-w-[8px]" />

        {/* Save */}
        <button
          onClick={save}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            saveStatus === 'saved'
              ? 'bg-green-500 text-white'
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
        >
          {saveStatus === 'saved' ? <Check size={13} /> : <Save size={13} />}
          <span className="hidden sm:inline">
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save'}
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <aside
          className={`bg-white border-r border-gray-200 flex flex-col transition-[width] duration-200 shrink-0 overflow-hidden ${
            showSidebar ? 'w-56' : 'w-0'
          }`}
        >
          {/* Photo upload */}
          <div className="p-3 border-b border-gray-100 shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Profile Photo
            </p>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              onClick={() => photoInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-600 border border-gray-200 transition-colors"
            >
              <Camera size={13} />
              {data.personalInfo.photoUrl ? 'Change Photo' : 'Upload Photo'}
            </button>
            {data.personalInfo.photoUrl && (
              <button
                onClick={() =>
                  setData(d => ({ ...d, personalInfo: { ...d.personalInfo, photoUrl: '' } }))
                }
                className="w-full mt-1 text-[11px] text-red-400 hover:text-red-600 text-center transition-colors"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Sections list */}
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
              Sections
            </p>
            <Reorder.Group
              axis="y"
              values={data.sections}
              onReorder={sections => setData(d => ({ ...d, sections }))}
              className="space-y-1.5"
            >
              {data.sections.map(section => (
                <SidebarItem
                  key={section.id}
                  section={section}
                  onToggleVisible={() => toggleVisible(section.id)}
                  onDelete={() => deleteSection(section.id)}
                  onSetPosition={pos => setPosition(section.id, pos)}
                />
              ))}
            </Reorder.Group>
          </div>

          {/* Add section */}
          <div className="p-3 border-t border-gray-100 shrink-0">
            {showAddSection ? (
              <div className="space-y-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Section title…"
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addSection();
                    if (e.key === 'Escape') setShowAddSection(false);
                  }}
                  className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-400"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={addSection}
                    className="flex-1 bg-primary-500 text-white text-xs rounded-lg px-2 py-1.5 hover:bg-primary-600 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowAddSection(false); setNewSectionTitle(''); }}
                    className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddSection(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-primary-400 hover:text-primary-500 transition-colors"
              >
                <Plus size={13} />
                Add Section
              </button>
            )}
          </div>
        </aside>

        {/* ── CANVAS ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
          <div
            className="w-full max-w-[794px] bg-white shadow-xl overflow-hidden"
            style={{ minHeight: 'min(1123px, 88vh)' }}
          >
            {renderCanvas()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar draggable section item ──────────────────────────────────────────

function SidebarItem({
  section,
  onToggleVisible,
  onDelete,
  onSetPosition,
}: {
  section: ResumeSection;
  onToggleVisible: () => void;
  onDelete: () => void;
  onSetPosition: (p: SectionPosition) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item value={section} dragListener={false} dragControls={controls}>
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 select-none">
        {/* Title row */}
        <div className="flex items-center gap-1">
          <button
            onPointerDown={e => controls.start(e)}
            className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
          >
            <GripVertical size={13} />
          </button>
          <span className={`flex-1 text-xs truncate ${section.visible ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
            {section.title || 'Untitled'}
          </span>
          <button
            onClick={onToggleVisible}
            className="text-gray-300 hover:text-gray-600 shrink-0 transition-colors"
          >
            {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button
            onClick={onDelete}
            className="text-gray-300 hover:text-red-400 shrink-0 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Position L / F / R */}
        <div className="flex gap-1 mt-1.5 ml-4">
          {(['left', 'full', 'right'] as SectionPosition[]).map(pos => (
            <button
              key={pos}
              onClick={() => onSetPosition(pos)}
              className={`flex-1 text-[9px] py-0.5 rounded font-semibold transition-colors ${
                section.position === pos
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
            >
              {pos === 'left' ? 'L' : pos === 'right' ? 'R' : 'F'}
            </button>
          ))}
        </div>
      </div>
    </Reorder.Item>
  );
}
