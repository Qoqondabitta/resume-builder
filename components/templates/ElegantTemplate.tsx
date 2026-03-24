'use client';

import { type ResumeData } from '@/types/resume';
import { type SectionType, type EditorSection } from '@/components/editor/SectionBlock';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Types that appear in the left column by default */
const DEFAULT_LEFT = new Set<SectionType>(['education', 'languages']);
/** Types that appear in the right column by default */
const DEFAULT_RIGHT = new Set<SectionType>(['skills', 'achievements', 'certifications']);

const DEFAULT_SECTIONS: EditorSection[] = [
  { id: 'summary',        type: 'summary',        title: 'Profile'                  },
  { id: 'experience',     type: 'experience',     title: 'Professional Experience'  },
  { id: 'education',      type: 'education',      title: 'Education'                },
  { id: 'languages',      type: 'languages',      title: 'Languages'                },
  { id: 'skills',         type: 'skills',         title: 'Core Competencies'        },
  { id: 'achievements',   type: 'achievements',   title: 'Achievements'             },
  { id: 'certifications', type: 'certifications', title: 'Certifications'           },
  { id: 'projects',       type: 'projects',       title: 'Notable Projects'         },
];

function resolvePos(s: EditorSection): 'left' | 'right' | 'full' {
  if (s.position === 'left')  return 'left';
  if (s.position === 'right') return 'right';
  if (s.position === 'full')  return 'full';
  if (DEFAULT_LEFT.has(s.type))  return 'left';
  if (DEFAULT_RIGHT.has(s.type)) return 'right';
  return 'full';
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ElegantTemplateProps {
  data: ResumeData;
  sections?: EditorSection[];
  sectionOrder?: SectionType[];  // legacy fallback
}

export default function ElegantTemplate({ data, sections, sectionOrder }: ElegantTemplateProps) {
  const effectiveSections: EditorSection[] = sections
    ?? (sectionOrder
      ? sectionOrder.map(t => DEFAULT_SECTIONS.find(s => s.type === t) ?? { id: t, type: t, title: t })
      : DEFAULT_SECTIONS);

  // Split into full-width and column sections
  const fullSections  = effectiveSections.filter(s => resolvePos(s) === 'full');
  const leftSections  = effectiveSections.filter(s => resolvePos(s) === 'left');
  const rightSections = effectiveSections.filter(s => resolvePos(s) === 'right');

  const hasColumns = leftSections.length > 0 || rightSections.length > 0;

  return (
    <div className="w-full min-h-full bg-white font-serif text-gray-800 px-4 sm:px-8 lg:px-12 py-8 sm:py-10">

      {/* ── Centered header ── */}
      <header className="text-center mb-2">
        {data.photoUrl && (
          <div className="flex justify-center mb-3">
            <img
              src={data.photoUrl}
              alt={data.name}
              style={data.photoWidth ? { width: data.photoWidth, height: data.photoWidth } : undefined}
              className="w-20 h-20 rounded-full object-cover border-4 border-amber-100 shadow-sm"
            />
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase text-gray-900 break-words">
          {data.name}
        </h1>
        <p className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-amber-600 font-sans mt-2">
          {data.title}
        </p>

        <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4">
          <div className="h-px w-10 sm:w-16 bg-amber-400" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
          <div className="h-px w-10 sm:w-16 bg-amber-400" />
        </div>

        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-1 mt-3 sm:mt-4 text-[11px] sm:text-xs font-sans text-gray-500 tracking-wide">
          <span>{data.email}</span>
          <Dot />
          <span>{data.phone}</span>
          <Dot />
          <span>{data.location}</span>
          {data.website  && <><Dot /><span>{data.website}</span></>}
          {data.linkedin && <><Dot /><span className="break-all">{data.linkedin}</span></>}
        </div>
      </header>

      {/* Full-width sections */}
      {fullSections.map(section => {
        const node = renderFullSection(section, data);
        if (!node) return null;
        return (
          <div key={section.id}>
            <ElegantDivider />
            <section data-section={section.id}>
              {node}
            </section>
          </div>
        );
      })}

      {/* 2-column section */}
      {hasColumns && (
        <>
          <ElegantDivider />
          <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-5 sm:gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {leftSections.map(section => {
                const node = renderColumnSection(section, data);
                if (!node) return null;
                return (
                  <section key={section.id} data-section={section.id}>
                    {node}
                  </section>
                );
              })}
            </div>

            {/* Vertical divider */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="w-px flex-1 bg-amber-100" />
              <div className="w-1.5 h-1.5 rotate-45 bg-amber-300 my-1" />
              <div className="w-px flex-1 bg-amber-100" />
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {rightSections.map(section => {
                const node = renderColumnSection(section, data);
                if (!node) return null;
                return (
                  <section key={section.id} data-section={section.id}>
                    {node}
                  </section>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Full-width section renderer ────────────────────────────────────────────────

function renderFullSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'summary':
      return data.summary ? (
        <FullSection label={section.title}>
          <p className="section-content text-xs sm:text-sm leading-relaxed text-gray-600 text-center italic">
            {data.summary}
          </p>
        </FullSection>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <FullSection label={section.title}>
          <div className="section-content space-y-5 sm:space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="group hover:bg-amber-50/40 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 flex-wrap">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide">{exp.role}</span>
                    <span className="text-[11px] sm:text-xs text-gray-500 font-sans ml-0 sm:ml-2 block sm:inline">
                      — {exp.company}, {exp.location}
                    </span>
                  </div>
                  <span className="self-start text-[11px] font-sans text-amber-600 tracking-wide whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 sm:space-y-1.5">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="text-[11px] sm:text-xs text-gray-600 font-sans leading-relaxed flex items-start gap-2 sm:gap-2.5">
                      <span className="shrink-0 text-amber-500 mt-0.5 text-[10px]">◆</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FullSection>
      ) : null;

    case 'projects':
      return data.projects.length > 0 ? (
        <FullSection label={section.title}>
          <div className="section-content grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {data.projects.map((p, i) => (
              <div key={i} className="border border-amber-100 rounded-lg p-3 sm:p-4 hover:border-amber-300 hover:shadow-sm transition-all">
                <p className="text-xs sm:text-sm font-bold text-gray-900">{p.name}</p>
                {p.link && <p className="text-[11px] font-sans text-amber-600 mt-0.5 break-all">{p.link}</p>}
                <p className="text-[11px] sm:text-xs font-sans text-gray-600 mt-1 leading-relaxed">{p.description}</p>
                <p className="text-[11px] font-sans text-gray-400 mt-1.5 italic">{p.tech.join(', ')}</p>
              </div>
            ))}
          </div>
        </FullSection>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <FullSection label={section.title}>
          <div className="section-content space-y-1.5">
            {section.customContent!.map((item, i) => (
              <p key={i} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-start gap-1.5">
                <span className="text-amber-400 text-[8px] shrink-0 mt-0.5">◆</span>
                {item}
              </p>
            ))}
          </div>
        </FullSection>
      ) : null;

    default:
      // Fall back to column-style rendering for any type that ends up full-width
      return renderColumnSection(section, data);
  }
}

// ── Column section renderer ───────────────────────────────────────────────────

function renderColumnSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'education':
      return data.education.length > 0 ? (
        <>
          <ColumnHeader label={section.title} />
          <div className="section-content">
            {data.education.map((e, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900">{e.degree}</p>
                <p className="text-[11px] sm:text-xs font-sans text-gray-500 mt-0.5">{e.school}</p>
                <p className="text-[11px] font-sans text-amber-600">{e.period}</p>
                {e.note && <p className="text-[11px] font-sans text-gray-400 italic mt-0.5">{e.note}</p>}
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <>
          <ColumnHeader label={section.title} />
          <div className="section-content">
            {data.languages!.map(l => (
              <p key={l} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-center gap-2 mb-1">
                <span className="text-amber-400 text-[8px]">◆</span>{l}
              </p>
            ))}
          </div>
        </>
      ) : null;

    case 'skills':
      return data.skills.length > 0 ? (
        <>
          <ColumnHeader label={section.title} />
          <div className="section-content grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1">
            {data.skills.map(s => (
              <p key={s} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-center gap-1.5">
                <span className="text-amber-400 text-[8px] shrink-0">◆</span>
                <span className="truncate">{s}</span>
              </p>
            ))}
          </div>
        </>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <>
          <ColumnHeader label={section.title} />
          <div className="section-content space-y-1.5">
            {data.achievements.map((a, i) => (
              <p key={i} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-start gap-1.5 group">
                <span className="text-amber-400 text-[8px] shrink-0 mt-0.5 group-hover:text-amber-500 transition-colors">◆</span>
                {a}
              </p>
            ))}
          </div>
        </>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <>
          <ColumnHeader label={section.title} />
          <div className="section-content space-y-1.5">
            {data.certifications!.map((c, i) => (
              <p key={i} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-start gap-1.5">
                <span className="text-amber-400 text-[8px] shrink-0 mt-0.5">◆</span>
                {c}
              </p>
            ))}
          </div>
        </>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <>
          <ColumnHeader label={section.title} />
          <div className="section-content space-y-1.5">
            {section.customContent!.map((item, i) => (
              <p key={i} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-start gap-1.5">
                <span className="text-amber-400 text-[8px] shrink-0 mt-0.5">◆</span>
                {item}
              </p>
            ))}
          </div>
        </>
      ) : null;

    default:
      return null;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Dot() {
  return <span className="text-amber-300 hidden xs:inline">·</span>;
}

function ElegantDivider() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-5 sm:my-6">
      <div className="h-px flex-1 bg-amber-100" />
      <div className="w-1 h-1 rotate-45 bg-amber-300" />
      <div className="h-px w-5 sm:w-8 bg-amber-100" />
      <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
      <div className="h-px w-5 sm:w-8 bg-amber-100" />
      <div className="w-1 h-1 rotate-45 bg-amber-300" />
      <div className="h-px flex-1 bg-amber-100" />
    </div>
  );
}

function FullSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <h2 className="section-title text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-600 text-center mb-3 sm:mb-4">
        {label}
      </h2>
      {children}
    </div>
  );
}

function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="section-title flex items-center gap-2 mb-2">
      <h3 className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest text-amber-600 whitespace-nowrap">
        {label}
      </h3>
      <div className="h-px flex-1 bg-amber-100" />
    </div>
  );
}
