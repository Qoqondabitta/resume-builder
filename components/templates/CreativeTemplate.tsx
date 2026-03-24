'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { type ResumeData } from '@/types/resume';
import { type SectionType, type EditorSection } from '@/components/editor/SectionBlock';

const ACCENT = 'from-violet-600 to-blue-600';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Types that go in the left column by default */
const DEFAULT_LEFT = new Set<SectionType>(['projects']);
/** Types that go in the right column by default */
const DEFAULT_RIGHT = new Set<SectionType>(['education', 'achievements', 'certifications', 'languages']);

const DEFAULT_SECTIONS: EditorSection[] = [
  { id: 'summary',        type: 'summary',        title: 'About Me'             },
  { id: 'skills',         type: 'skills',         title: 'Skills & Technologies' },
  { id: 'experience',     type: 'experience',     title: 'Work Experience'       },
  { id: 'projects',       type: 'projects',       title: 'Projects'              },
  { id: 'education',      type: 'education',      title: 'Education'             },
  { id: 'achievements',   type: 'achievements',   title: 'Achievements'          },
  { id: 'certifications', type: 'certifications', title: 'Certifications'        },
  { id: 'languages',      type: 'languages',      title: 'Languages'             },
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

interface CreativeTemplateProps {
  data: ResumeData;
  sections?: EditorSection[];
  sectionOrder?: SectionType[];  // legacy fallback
}

export default function CreativeTemplate({ data, sections, sectionOrder }: CreativeTemplateProps) {
  const effectiveSections: EditorSection[] = sections
    ?? (sectionOrder
      ? sectionOrder.map(t => DEFAULT_SECTIONS.find(s => s.type === t) ?? { id: t, type: t, title: t })
      : DEFAULT_SECTIONS);

  const fullSections  = effectiveSections.filter(s => resolvePos(s) === 'full');
  const leftSections  = effectiveSections.filter(s => resolvePos(s) === 'left');
  const rightSections = effectiveSections.filter(s => resolvePos(s) === 'right');

  const hasColumns = leftSections.length > 0 || rightSections.length > 0;

  const photoSize = data.photoWidth ?? 80;

  return (
    <div className="w-full min-h-full bg-gray-50 font-sans text-gray-800">

      {/* ── Gradient header ── */}
      <header className={`bg-gradient-to-r ${ACCENT} text-white px-4 sm:px-8 lg:px-10 py-7 sm:py-10`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {data.photoUrl && (
              <img
                src={data.photoUrl}
                alt={data.name}
                style={{ width: photoSize, height: photoSize }}
                className="rounded-2xl object-cover border-2 border-white/30 shrink-0"
              />
            )}
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none break-words">
                {data.name}
              </h1>
              <p className="text-violet-200 text-base sm:text-lg font-light mt-2">{data.title}</p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-1 sm:gap-1.5 shrink-0">
            {[
              { icon: Mail,     val: data.email    },
              { icon: Phone,    val: data.phone    },
              { icon: MapPin,   val: data.location },
              ...(data.website  ? [{ icon: Globe,    val: data.website  }] : []),
              ...(data.linkedin ? [{ icon: Linkedin, val: data.linkedin }] : []),
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-1.5 text-violet-100 text-[11px] sm:text-xs sm:flex-row-reverse">
                <Icon size={11} className="shrink-0" />
                <span className="break-all">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Full-width sections */}
        {fullSections.map(section => {
          const node = renderSection(section, data);
          if (!node) return null;
          return (
            <section key={section.id} data-section={section.id}>
              {node}
            </section>
          );
        })}

        {/* 2-column grid for left / right sections */}
        {hasColumns && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {leftSections.length > 0 && (
              <div className="space-y-5 sm:space-y-6">
                {leftSections.map(section => {
                  const node = renderSection(section, data);
                  if (!node) return null;
                  return (
                    <section key={section.id} data-section={section.id}>
                      {node}
                    </section>
                  );
                })}
              </div>
            )}
            {rightSections.length > 0 && (
              <div className="space-y-5 sm:space-y-6">
                {rightSections.map(section => {
                  const node = renderSection(section, data);
                  if (!node) return null;
                  return (
                    <section key={section.id} data-section={section.id}>
                      {node}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section renderer ──────────────────────────────────────────────────────────

function renderSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'summary':
      return data.summary ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <p className="section-content text-xs sm:text-sm text-gray-600 leading-relaxed">{data.summary}</p>
        </>
      ) : null;

    case 'skills':
      return data.skills.length > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content flex flex-wrap gap-1.5 sm:gap-2">
            {data.skills.map((s, i) => (
              <span
                key={s}
                className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full hover:opacity-80 transition-opacity ${
                  i % 4 === 0 ? 'bg-violet-100 text-violet-700' :
                  i % 4 === 1 ? 'bg-blue-100 text-blue-700' :
                  i % 4 === 2 ? 'bg-pink-100 text-pink-700' :
                                'bg-emerald-100 text-emerald-700'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content space-y-5">
            {data.experience.map((exp, i) => (
              <div key={i} className="relative pl-5 border-l-2 border-violet-200 hover:border-violet-400 transition-colors group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-violet-400 group-hover:border-violet-600 transition-colors flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{exp.role}</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-violet-600">{exp.company}</p>
                    <p className="text-[11px] text-gray-400">{exp.location}</p>
                  </div>
                  <span className="self-start text-[11px] bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="text-[11px] sm:text-xs text-gray-600 flex gap-2">
                      <span className="text-violet-400 shrink-0 font-bold">›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'projects':
      return data.projects.length > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content space-y-3 sm:space-y-4">
            {data.projects.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all">
                <p className="text-xs sm:text-sm font-bold text-gray-900">{p.name}</p>
                {p.link && <p className="text-[10px] text-violet-500 mt-0.5 break-all">{p.link}</p>}
                <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech.map(t => (
                    <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content space-y-3">
            {data.education.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <p className="text-xs sm:text-sm font-bold text-gray-900">{e.degree}</p>
                <p className="text-[11px] sm:text-xs text-violet-600 font-semibold mt-0.5">{e.school}</p>
                <p className="text-[11px] text-gray-400">{e.period}</p>
                {e.note && <p className="text-[11px] text-gray-500 mt-1 italic">{e.note}</p>}
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content space-y-2">
            {data.achievements.map((a, i) => (
              <div key={i} className="flex gap-2 items-start group">
                <span className="text-yellow-500 shrink-0 text-xs leading-none mt-0.5 group-hover:scale-110 transition-transform">★</span>
                <p className="text-[11px] sm:text-xs text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content space-y-2">
            {data.certifications!.map((c, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-violet-500 shrink-0 text-xs leading-none mt-0.5">✦</span>
                <p className="text-[11px] sm:text-xs text-gray-600">{c}</p>
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content flex flex-wrap gap-1.5">
            {data.languages!.map(l => (
              <span key={l} className="text-[11px] bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">{l}</span>
            ))}
          </div>
        </>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <>
          <div className="section-title"><CreativeSectionTitle label={section.title} /></div>
          <div className="section-content space-y-2">
            {section.customContent!.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-violet-400 shrink-0 text-xs leading-none mt-0.5">›</span>
                <p className="text-[11px] sm:text-xs text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </>
      ) : null;

    default:
      return null;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CreativeSectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 sm:mb-4">
      <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-900 whitespace-nowrap">
        {label}
      </h2>
      <div className={`flex-1 h-0.5 bg-gradient-to-r ${ACCENT} opacity-30 rounded-full`} />
    </div>
  );
}
