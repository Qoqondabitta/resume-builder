'use client';

import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  GripVertical, ChevronDown, ChevronUp, Trash2, Pencil, Check, X, Plus, Building2,
  AlignLeft, AlignCenter, AlignRight, Minus,
} from 'lucide-react';
import { type ResumeData, type Experience, type Education, type Project } from '@/types/resume';

// ── Types ────────────────────────────────────────────────────────────────────

export type SectionType =
  | 'summary' | 'experience' | 'education' | 'skills'
  | 'projects' | 'achievements' | 'certifications' | 'languages' | 'custom';

export type SectionPosition = 'left' | 'right' | 'full';

export interface SectionFormatting {
  // Title formatting
  titleAlign?: 'left' | 'center' | 'right';
  titleBold?: boolean;
  titleItalic?: boolean;
  titleUnderline?: boolean;
  titleColor?: string;
  // Content formatting
  contentSizePx?: number;        // 8–20px
  contentBold?: boolean;
  contentItalic?: boolean;
  lineHeight?: 'tight' | 'normal' | 'relaxed';
}

export interface EditorSection {
  id: string;
  type: SectionType;
  title: string;
  customContent?: string[];
  formatting?: SectionFormatting;
  position?: SectionPosition;
}

interface SectionBlockProps {
  section: EditorSection;
  data: ResumeData;
  onDataChange: React.Dispatch<React.SetStateAction<ResumeData>>;
  onRename: (title: string) => void;
  onDelete: () => void;
  onSectionChange: (section: EditorSection) => void;
  dragControls: ReturnType<typeof useDragControls>;
  isActive?: boolean;
  onActivate?: () => void;
}

// ── Draggable wrapper ────────────────────────────────────────────────────────

export function DraggableSection(props: Omit<SectionBlockProps, 'dragControls'>) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={props.section}
      dragListener={false}
      dragControls={dragControls}
      className="list-none"
      style={{ position: 'relative' }}
    >
      <SectionBlock {...props} dragControls={dragControls} />
    </Reorder.Item>
  );
}

// ── SectionBlock ─────────────────────────────────────────────────────────────

export default function SectionBlock({
  section, data, onDataChange, onRename, onDelete, onSectionChange,
  dragControls, isActive, onActivate,
}: SectionBlockProps) {
  const [collapsed, setCollapsed]       = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft]     = useState(section.title);

  const commitTitle = () => {
    if (titleDraft.trim()) onRename(titleDraft.trim());
    else setTitleDraft(section.title);
    setEditingTitle(false);
  };

  const currentPos = section.position ?? 'full';

  const POSITION_LABELS: Record<SectionPosition, string> = {
    full:  'Full Width',
    left:  'Left Column',
    right: 'Right Column',
  };

  return (
    <div
      onClick={onActivate}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-150 ${
        isActive
          ? 'border-2 border-primary-400 shadow-md shadow-primary-100'
          : 'border border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* ── Header bar ── */}
      <div className={`flex items-center gap-1.5 px-3 py-2.5 ${isActive ? 'bg-primary-50' : 'bg-gray-50'} border-b border-gray-100 transition-colors`}>

        {/* Drag handle */}
        <button
          onPointerDown={(e) => { e.stopPropagation(); dragControls.start(e); }}
          className="touch-none cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors p-0.5 shrink-0"
          title="Drag to reorder"
        >
          <GripVertical size={15} />
        </button>

        {/* Editable title */}
        {editingTitle ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitTitle();
                if (e.key === 'Escape') { setTitleDraft(section.title); setEditingTitle(false); }
              }}
              onBlur={commitTitle}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 text-xs font-bold text-gray-900 bg-white border border-primary-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary-200"
            />
            <button onClick={(e) => { e.stopPropagation(); commitTitle(); }} className="shrink-0 text-green-500 hover:text-green-600">
              <Check size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onActivate?.(); setEditingTitle(true); }}
            className={`flex-1 text-left text-xs font-bold truncate group flex items-center gap-1.5 min-w-0 ${isActive ? 'text-primary-700' : 'text-gray-800 hover:text-primary-600'} transition-colors`}
            title="Click to rename"
          >
            <span className="truncate">{section.title}</span>
            <Pencil size={9} className="opacity-0 group-hover:opacity-50 shrink-0 transition-opacity" />
          </button>
        )}

        {/* Position selector */}
        <select
          value={currentPos}
          onChange={(e) => { e.stopPropagation(); onSectionChange({ ...section, position: e.target.value as SectionPosition }); }}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] border border-gray-200 rounded-lg px-1.5 py-1 text-gray-500 bg-white focus:border-primary-300 outline-none cursor-pointer shrink-0"
          title="Layout position"
        >
          {(Object.keys(POSITION_LABELS) as SectionPosition[]).map((pos) => (
            <option key={pos} value={pos}>{POSITION_LABELS[pos]}</option>
          ))}
        </select>

        {/* Collapse + Delete */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setCollapsed((c) => !c); }}
            className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
            title="Remove section"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      {!collapsed && (
        <div className="p-3 sm:p-4 select-text" onClick={(e) => e.stopPropagation()}>
          <SectionContent
            section={section}
            data={data}
            onDataChange={onDataChange}
            onSectionChange={onSectionChange}
          />
        </div>
      )}
    </div>
  );
}

// ── FormattingBar (Word-like toolbar) ────────────────────────────────────────
// Exported and used by the sticky style panel in the editor page.

export function FormattingBar({
  formatting = {},
  onChange,
}: {
  formatting?: SectionFormatting;
  onChange: (patch: Partial<SectionFormatting>) => void;
}) {
  const upd = (patch: Partial<SectionFormatting>) => onChange(patch);
  const contentSize = formatting.contentSizePx ?? 12;

  return (
    <div className="flex flex-wrap items-center gap-1.5">

      {/* Title alignment */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
        {([
          { a: 'left'   as const, Icon: AlignLeft   },
          { a: 'center' as const, Icon: AlignCenter },
          { a: 'right'  as const, Icon: AlignRight  },
        ]).map(({ a, Icon }) => (
          <button
            key={a}
            onClick={() => upd({ titleAlign: a })}
            title={`Align title ${a}`}
            className={`p-1.5 transition-colors ${
              formatting.titleAlign === a ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={11} />
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 shrink-0" />

      {/* Title B / I / U */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
        <button
          onClick={() => upd({ titleBold: !formatting.titleBold })}
          title="Bold title"
          className={`w-7 h-7 text-xs font-black flex items-center justify-center transition-colors ${
            formatting.titleBold ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-700'
          }`}
        >B</button>
        <button
          onClick={() => upd({ titleItalic: !formatting.titleItalic })}
          title="Italic title"
          className={`w-7 h-7 text-xs italic font-semibold flex items-center justify-center transition-colors ${
            formatting.titleItalic ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-700'
          }`}
        >I</button>
        <button
          onClick={() => upd({ titleUnderline: !formatting.titleUnderline })}
          title="Underline title"
          className={`w-7 h-7 text-xs underline flex items-center justify-center transition-colors ${
            formatting.titleUnderline ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-700'
          }`}
        >U</button>
      </div>

      {/* Title color */}
      <label className="cursor-pointer shrink-0" title="Title color">
        <div
          className="w-6 h-6 rounded border border-gray-200 overflow-hidden relative shadow-sm"
          style={{ backgroundColor: formatting.titleColor ?? '#374151' }}
        >
          <input
            type="color"
            value={formatting.titleColor ?? '#374151'}
            onChange={(e) => upd({ titleColor: e.target.value })}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      </label>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-200 shrink-0" />

      {/* Content font size numeric */}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
        <button
          onClick={() => upd({ contentSizePx: Math.max(8, contentSize - 1) })}
          className="px-1.5 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
          title="Decrease content font size"
        >
          <Minus size={10} />
        </button>
        <span className="px-1 text-[10px] font-semibold text-gray-700 min-w-[30px] text-center select-none">
          {contentSize}px
        </span>
        <button
          onClick={() => upd({ contentSizePx: Math.min(20, contentSize + 1) })}
          className="px-1.5 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
          title="Increase content font size"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Content B / I */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
        <button
          onClick={() => upd({ contentBold: !formatting.contentBold })}
          title="Bold content text"
          className={`w-6 h-6 text-[10px] font-black flex items-center justify-center transition-colors ${
            formatting.contentBold ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-700'
          }`}
        >B</button>
        <button
          onClick={() => upd({ contentItalic: !formatting.contentItalic })}
          title="Italic content text"
          className={`w-6 h-6 text-[10px] italic font-semibold flex items-center justify-center transition-colors ${
            formatting.contentItalic ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-700'
          }`}
        >I</button>
      </div>

      {/* Line height */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
        {(['tight', 'normal', 'relaxed'] as const).map((lh, i) => (
          <button
            key={lh}
            onClick={() => upd({ lineHeight: lh })}
            title={['Tight spacing', 'Normal spacing', 'Relaxed spacing'][i]}
            className={`w-6 h-6 text-[9px] font-bold flex items-center justify-center transition-colors ${
              formatting.lineHeight === lh ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {['≡', '≣', '☰'][i]}
          </button>
        ))}
      </div>

      {/* Reset */}
      {Object.keys(formatting).length > 0 && (
        <button
          onClick={() => onChange({})}
          className="text-[9px] text-gray-300 hover:text-red-400 transition-colors font-medium px-1"
          title="Reset all section formatting"
        >
          ↺
        </button>
      )}
    </div>
  );
}

// ── Content router ────────────────────────────────────────────────────────────

function SectionContent({
  section, data, onDataChange, onSectionChange,
}: {
  section: EditorSection;
  data: ResumeData;
  onDataChange: React.Dispatch<React.SetStateAction<ResumeData>>;
  onSectionChange: (s: EditorSection) => void;
}) {
  switch (section.type) {
    case 'summary':
      return (
        <textarea
          value={data.summary}
          onChange={(e) => onDataChange((d) => ({ ...d, summary: e.target.value }))}
          rows={4}
          placeholder="Write a compelling professional summary…"
          className="w-full text-xs sm:text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-all leading-relaxed"
        />
      );
    case 'experience':
      return <ExperienceEditor items={data.experience} onChange={(items) => onDataChange((d) => ({ ...d, experience: items }))} />;
    case 'education':
      return <EducationEditor items={data.education} onChange={(items) => onDataChange((d) => ({ ...d, education: items }))} />;
    case 'skills':
      return <SkillsEditor skills={data.skills} onChange={(skills) => onDataChange((d) => ({ ...d, skills }))} />;
    case 'projects':
      return <ProjectsEditor items={data.projects} onChange={(items) => onDataChange((d) => ({ ...d, projects: items }))} />;
    case 'achievements':
      return <ListEditor items={data.achievements} onChange={(items) => onDataChange((d) => ({ ...d, achievements: items }))} placeholder="Describe an achievement…" />;
    case 'languages':
      return <ListEditor items={data.languages ?? []} onChange={(items) => onDataChange((d) => ({ ...d, languages: items }))} placeholder="e.g. Spanish (Conversational)" />;
    case 'certifications':
      return <ListEditor items={data.certifications ?? []} onChange={(items) => onDataChange((d) => ({ ...d, certifications: items }))} placeholder="e.g. AWS Certified Solutions Architect" />;
    case 'custom':
      return <ListEditor items={section.customContent ?? []} onChange={(items) => onSectionChange({ ...section, customContent: items })} placeholder="Add item…" />;
    default:
      return null;
  }
}

// ── Experience editor ─────────────────────────────────────────────────────────

function ExperienceEditor({ items, onChange }: { items: Experience[]; onChange: (items: Experience[]) => void }) {
  const blank = (): Experience => ({ role: '', company: '', location: '', period: '', bullets: [''] });
  const update = (i: number, patch: Partial<Experience>) => onChange(items.map((x, idx) => idx === i ? { ...x, ...patch } : x));
  const addBullet  = (i: number) => update(i, { bullets: [...items[i].bullets, ''] });
  const editBullet = (i: number, bi: number, val: string) => update(i, { bullets: items[i].bullets.map((b, j) => j === bi ? val : b) });
  const dropBullet = (i: number, bi: number) => update(i, { bullets: items[i].bullets.filter((_, j) => j !== bi) });

  return (
    <div className="space-y-4">
      {items.map((exp, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2.5 bg-gray-50/40 hover:border-gray-200 transition-colors">
          <EntryHeader label={`Position ${i + 1}`} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {([{ k: 'role', ph: 'Job Title' }, { k: 'company', ph: 'Company' }, { k: 'location', ph: 'Location' }, { k: 'period', ph: 'Period e.g. Jan 2022–Present' }] as const).map(({ k, ph }) => (
              <FieldInput key={k} value={exp[k]} placeholder={ph} onChange={(v) => update(i, { [k]: v })} />
            ))}
          </div>
          <LogoUpload label="company logo" url={exp.logoUrl} onUrl={(url) => update(i, { logoUrl: url })} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Bullet Points</p>
            <div className="space-y-1.5">
              {exp.bullets.map((b, bi) => (
                <div key={bi} className="flex items-center gap-1.5">
                  <span className="text-gray-300 text-xs shrink-0">•</span>
                  <input value={b} onChange={(e) => editBullet(i, bi, e.target.value)} placeholder="Describe your impact…" className={inputCls} />
                  <button onClick={() => dropBullet(i, bi)} className={iconBtn('red')}><X size={11} /></button>
                </div>
              ))}
            </div>
            <AddRowBtn label="Add bullet" onClick={() => addBullet(i)} />
          </div>
        </div>
      ))}
      <AddSectionBtn label="Add Position" onClick={() => onChange([...items, blank()])} />
    </div>
  );
}

// ── Education editor ──────────────────────────────────────────────────────────

function EducationEditor({ items, onChange }: { items: Education[]; onChange: (items: Education[]) => void }) {
  const blank = (): Education => ({ degree: '', school: '', location: '', period: '', note: '' });
  const update = (i: number, patch: Partial<Education>) => onChange(items.map((x, idx) => idx === i ? { ...x, ...patch } : x));

  return (
    <div className="space-y-3">
      {items.map((edu, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/40">
          <EntryHeader label={`Entry ${i + 1}`} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {([{ k: 'degree', ph: 'Degree / Certification' }, { k: 'school', ph: 'School / Institution' }, { k: 'location', ph: 'Location' }, { k: 'period', ph: 'Period e.g. 2014–2018' }] as const).map(({ k, ph }) => (
              <FieldInput key={k} value={edu[k] ?? ''} placeholder={ph} onChange={(v) => update(i, { [k]: v })} />
            ))}
            <FieldInput value={edu.note ?? ''} placeholder="Notes (GPA, honors…)" onChange={(v) => update(i, { note: v })} className="sm:col-span-2" />
          </div>
        </div>
      ))}
      <AddSectionBtn label="Add Education" onClick={() => onChange([...items, blank()])} />
    </div>
  );
}

// ── Skills editor ─────────────────────────────────────────────────────────────

function SkillsEditor({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !skills.includes(t)) { onChange([...skills, t]); setDraft(''); }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {skills.map((s) => (
          <button key={s} onClick={() => onChange(skills.filter((x) => x !== s))} title="Click to remove"
            className="inline-flex items-center gap-1 text-[11px] bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group">
            {s}<X size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
        {skills.length === 0 && <p className="text-xs text-gray-300 italic">No skills yet</p>}
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Type skill and press Enter…" className={`${inputCls} flex-1`} />
        <button onClick={add} className="px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 active:scale-95 transition-all">Add</button>
      </div>
    </div>
  );
}

// ── Projects editor ───────────────────────────────────────────────────────────

function ProjectsEditor({ items, onChange }: { items: Project[]; onChange: (items: Project[]) => void }) {
  const blank = (): Project => ({ name: '', description: '', tech: [], link: '' });
  const update = (i: number, patch: Partial<Project>) => onChange(items.map((x, idx) => idx === i ? { ...x, ...patch } : x));

  return (
    <div className="space-y-3">
      {items.map((proj, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2.5 bg-gray-50/40">
          <EntryHeader label={`Project ${i + 1}`} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FieldInput value={proj.name} placeholder="Project Name" onChange={(v) => update(i, { name: v })} />
            <FieldInput value={proj.link ?? ''} placeholder="Link (github.com/…)" onChange={(v) => update(i, { link: v })} />
          </div>
          <textarea value={proj.description} onChange={(e) => update(i, { description: e.target.value })}
            placeholder="Brief description…" rows={2}
            className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 resize-none focus:border-primary-300 focus:ring-1 focus:ring-primary-100 outline-none bg-white transition-all" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Tech Stack</p>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {proj.tech.map((t) => (
                <button key={t} onClick={() => update(i, { tech: proj.tech.filter((x) => x !== t) })} title="Click to remove"
                  className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all group">
                  {t}<X size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            <input placeholder="Type technology and press Enter…" className={`${inputCls} w-full`}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                const v = (e.target as HTMLInputElement).value.trim();
                if (v && !proj.tech.includes(v)) {
                  update(i, { tech: [...proj.tech, v] });
                  (e.target as HTMLInputElement).value = '';
                }
              }} />
          </div>
          <LogoUpload label="project logo" url={proj.logoUrl} onUrl={(url) => update(i, { logoUrl: url })} />
        </div>
      ))}
      <AddSectionBtn label="Add Project" onClick={() => onChange([...items, blank()])} />
    </div>
  );
}

// ── List editor ───────────────────────────────────────────────────────────────

function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-gray-300 text-xs shrink-0">•</span>
          <input value={item} onChange={(e) => onChange(items.map((x, j) => j === i ? e.target.value : x))}
            placeholder={placeholder} className={`${inputCls} flex-1`} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className={iconBtn('red')}><X size={11} /></button>
        </div>
      ))}
      <AddRowBtn label="Add item" onClick={() => onChange([...items, ''])} />
    </div>
  );
}

// ── Shared micro-components ───────────────────────────────────────────────────

function EntryHeader({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <button onClick={onRemove} className={iconBtn('red')} title="Remove"><X size={13} /></button>
    </div>
  );
}

function FieldInput({ value, placeholder, onChange, className = '' }: { value: string; placeholder: string; onChange: (v: string) => void; className?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className={`text-xs text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-primary-300 focus:ring-1 focus:ring-primary-100 outline-none bg-white transition-all ${className}`} />
  );
}

function LogoUpload({ label, url, onUrl }: { label: string; url?: string; onUrl: (url: string) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group w-fit">
      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => onUrl(ev.target?.result as string);
        reader.readAsDataURL(file);
      }} />
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 group-hover:text-primary-500 transition-colors border border-dashed border-gray-200 group-hover:border-primary-300 rounded-lg px-2.5 py-1.5">
        <Building2 size={11} />
        {url ? `Change ${label}` : `Add ${label}`}
      </div>
      {url && <img src={url} alt="logo" className="w-6 h-6 object-contain rounded border border-gray-100" />}
    </label>
  );
}

function AddRowBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-[11px] text-primary-500 hover:text-primary-700 font-semibold transition-colors mt-1.5">
      <Plus size={11} /> {label}
    </button>
  );
}

function AddSectionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400 font-semibold hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50/50 active:scale-[0.98] transition-all">
      <Plus size={13} /> {label}
    </button>
  );
}

// ── Shared style constants ────────────────────────────────────────────────────

const inputCls = 'text-xs text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:border-primary-300 focus:ring-1 focus:ring-primary-100 outline-none bg-white transition-all';
const iconBtn  = (color: 'red' | 'gray') =>
  color === 'red' ? 'p-0.5 text-gray-300 hover:text-red-400 transition-colors shrink-0' : 'p-0.5 text-gray-300 hover:text-gray-600 transition-colors shrink-0';
