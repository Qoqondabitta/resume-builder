'use client';

import { type ResumeData } from '@/types/resume';
import { type SectionType, type EditorSection } from '@/components/editor/SectionBlock';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_SECTIONS: EditorSection[] = [
  { id: 'summary',        type: 'summary',        title: 'Summary'         },
  { id: 'experience',     type: 'experience',     title: 'Experience'      },
  { id: 'education',      type: 'education',      title: 'Education'       },
  { id: 'skills',         type: 'skills',         title: 'Skills'          },
  { id: 'projects',       type: 'projects',       title: 'Projects'        },
  { id: 'achievements',   type: 'achievements',   title: 'Achievements'    },
  { id: 'certifications', type: 'certifications', title: 'Certifications'  },
  { id: 'languages',      type: 'languages',      title: 'Languages'       },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface MinimalistTemplateProps {
  data: ResumeData;
  sections?: EditorSection[];
  sectionOrder?: SectionType[];   // legacy / fallback
}

export default function MinimalistTemplate({ data, sections, sectionOrder }: MinimalistTemplateProps) {
  const effectiveSections: EditorSection[] = sections
    ?? (sectionOrder
      ? sectionOrder.map(t => DEFAULT_SECTIONS.find(s => s.type === t) ?? { id: t, type: t, title: t })
      : DEFAULT_SECTIONS);

  // Enable 2-col grid when any section has an explicit left / right position
  const hasColumnLayout = effectiveSections.some(s => s.position === 'left' || s.position === 'right');

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800 px-4 sm:px-8 lg:px-12 py-8 sm:py-10">

      {/* ── Header ── */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          {data.photoUrl && (
            <img
              src={data.photoUrl}
              alt={data.name}
              style={data.photoWidth ? { width: data.photoWidth, height: data.photoWidth } : undefined}
              className="w-16 h-16 rounded-full object-cover border border-gray-200 shrink-0"
            />
          )}
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-gray-900 break-words">
              {data.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 font-light">{data.title}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-1 mt-3 text-[11px] sm:text-xs text-gray-400">
          <span>{data.email}</span>
          <span className="hidden sm:inline">·</span>
          <span>{data.phone}</span>
          <span className="hidden sm:inline">·</span>
          <span>{data.location}</span>
          {data.website  && <><span className="hidden sm:inline">·</span><span>{data.website}</span></>}
          {data.linkedin && <><span className="hidden sm:inline">·</span><span>{data.linkedin}</span></>}
        </div>
      </header>

      {/* ── Body ── */}
      {hasColumnLayout ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {effectiveSections.map((section) => {
            const node = renderSection(section, data);
            if (!node) return null;
            const pos = section.position ?? 'full';
            return (
              <div
                key={section.id}
                data-section={section.id}
                className={`border-t border-gray-100 pt-4 mt-4 ${
                  pos === 'full'  ? 'sm:col-span-2' :
                  pos === 'left'  ? 'sm:col-start-1' :
                                    'sm:col-start-2'
                }`}
              >
                {node}
              </div>
            );
          })}
        </div>
      ) : (
        effectiveSections.map((section, i) => {
          const node = renderSection(section, data);
          if (!node) return null;
          return (
            <div key={section.id} data-section={section.id}>
              {i > 0 && <Divider />}
              {node}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Section renderer ──────────────────────────────────────────────────────────

function renderSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'summary':
      return data.summary ? (
        <Section label={section.title}>
          <p className="section-content text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{data.summary}</p>
        </Section>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <Section label={section.title}>
          <div className="section-content space-y-5 sm:space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{exp.role}</p>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{exp.company} &mdash; {exp.location}</p>
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap mt-1 sm:mt-0 sm:pt-0.5 sm:text-right">
                    {exp.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <Section label={section.title}>
          <div className="section-content">
            {data.education.map((e, i) => (
              <div key={i} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4 mb-3 last:mb-0">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{e.degree}</p>
                  <p className="text-[11px] sm:text-xs text-gray-500">{e.school} &mdash; {e.location}</p>
                  {e.note && <p className="text-[11px] sm:text-xs text-gray-400 font-light mt-0.5">{e.note}</p>}
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5 sm:pt-0.5">{e.period}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null;

    case 'skills':
      return data.skills.length > 0 ? (
        <Section label={section.title}>
          <div className="section-content flex flex-wrap gap-x-1 gap-y-0.5">
            {data.skills.map((s, i) => (
              <span key={s} className="text-xs sm:text-sm text-gray-600 font-light">
                {s}{i < data.skills.length - 1 && <span className="text-gray-300 mx-1.5">·</span>}
              </span>
            ))}
          </div>
        </Section>
      ) : null;

    case 'projects':
      return data.projects.length > 0 ? (
        <Section label={section.title}>
          <div className="section-content space-y-4">
            {data.projects.map((p, i) => (
              <div key={i} className="hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{p.name}</p>
                  {p.link && <span className="text-[11px] sm:text-xs text-gray-400">{p.link}</span>}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600 font-light mt-0.5">{p.description}</p>
                <p className="text-[11px] text-gray-400 mt-1">{p.tech.join(', ')}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <Section label={section.title}>
          <ul className="section-content space-y-1.5">
            {data.achievements.map((a, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
                {a}
              </li>
            ))}
          </ul>
        </Section>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <Section label={section.title}>
          <ul className="section-content space-y-1.5">
            {data.certifications!.map((c, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
                {c}
              </li>
            ))}
          </ul>
        </Section>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <Section label={section.title}>
          <p className="section-content text-xs sm:text-sm text-gray-600 font-light">
            {data.languages!.join('  ·  ')}
          </p>
        </Section>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <Section label={section.title}>
          <ul className="section-content space-y-1.5">
            {section.customContent!.map((item, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
                {item}
              </li>
            ))}
          </ul>
        </Section>
      ) : null;

    default:
      return null;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return <hr className="border-gray-100 my-4 sm:my-5" />;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] lg:grid-cols-[120px_1fr] sm:gap-x-6 lg:gap-x-8 py-1 gap-y-1.5">
      <p className="section-title text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-gray-400 pt-0.5">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}
