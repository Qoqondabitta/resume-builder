'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { type ResumeData } from '@/types/resume';
import { type SectionType, type EditorSection } from '@/components/editor/SectionBlock';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Section types that live in the sidebar by default */
const DEFAULT_SIDEBAR = new Set<SectionType>(['skills', 'education', 'languages']);

const DEFAULT_SECTIONS: EditorSection[] = [
  { id: 'summary',        type: 'summary',        title: 'Executive Summary'       },
  { id: 'experience',     type: 'experience',     title: 'Professional Experience' },
  { id: 'projects',       type: 'projects',       title: 'Key Projects'            },
  { id: 'achievements',   type: 'achievements',   title: 'Awards & Achievements'   },
  { id: 'certifications', type: 'certifications', title: 'Certifications'          },
  { id: 'skills',         type: 'skills',         title: 'Skills'                  },
  { id: 'education',      type: 'education',      title: 'Education'               },
  { id: 'languages',      type: 'languages',      title: 'Languages'               },
];

function isInSidebar(s: EditorSection): boolean {
  if (s.position === 'left')                     return true;
  if (s.position === 'right' || s.position === 'full') return false;
  return DEFAULT_SIDEBAR.has(s.type);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CorporateTemplateProps {
  data: ResumeData;
  sections?: EditorSection[];
  sectionOrder?: SectionType[];  // legacy fallback
}

export default function CorporateTemplate({ data, sections, sectionOrder }: CorporateTemplateProps) {
  const effectiveSections: EditorSection[] = sections
    ?? (sectionOrder
      ? sectionOrder.map(t => DEFAULT_SECTIONS.find(s => s.type === t) ?? { id: t, type: t, title: t })
      : DEFAULT_SECTIONS);

  const sidebarSections = effectiveSections.filter(isInSidebar);
  const mainSections    = effectiveSections.filter(s => !isInSidebar(s));

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800">

      {/* ── Dark navy header ── */}
      <header className="bg-slate-800 text-white px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
        <div className="flex items-center gap-4">
          {data.photoUrl && (
            <img
              src={data.photoUrl}
              alt={data.name}
              style={data.photoWidth ? { width: data.photoWidth, height: data.photoWidth } : undefined}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase break-words">
              {data.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium tracking-widest uppercase mt-1">
              {data.title}
            </p>
            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 mt-3 sm:mt-4">
              {[
                { icon: Mail,     val: data.email    },
                { icon: Phone,    val: data.phone    },
                { icon: MapPin,   val: data.location },
                ...(data.website  ? [{ icon: Globe,    val: data.website  }] : []),
                ...(data.linkedin ? [{ icon: Linkedin, val: data.linkedin }] : []),
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs">
                  <Icon size={11} className="shrink-0" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Accent bar */}
      <div className="h-1 bg-gradient-to-r from-slate-600 via-blue-500 to-slate-600" />

      {/* ── Body ── */}
      <div className="flex flex-col sm:flex-row">

        {/* ── Sidebar ── */}
        <aside className="w-full sm:w-[180px] lg:w-[200px] shrink-0 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100 px-4 sm:px-5 lg:px-6 py-5 sm:py-7">
          <div className="space-y-5 sm:space-y-6">
            {sidebarSections.map(section => {
              const node = renderSidebarSection(section, data);
              if (!node) return null;
              return (
                <section key={section.id} data-section={section.id}>
                  {node}
                </section>
              );
            })}
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5 sm:space-y-6 min-w-0">
          {mainSections.map(section => {
            const node = renderMainSection(section, data);
            if (!node) return null;
            return (
              <section key={section.id} data-section={section.id}>
                {node}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}

// ── Sidebar renderers ─────────────────────────────────────────────────────────

function renderSidebarSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'skills':
      return data.skills.length > 0 ? (
        <SideSection label={section.title}>
          <div className="flex flex-wrap sm:block gap-x-3 gap-y-0.5 section-content">
            {data.skills.map(s => (
              <div key={s} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700 mb-1 sm:mb-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </SideSection>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <SideSection label={section.title}>
          <div className="section-content">
            {data.education.map((e, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-800">{e.degree}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{e.school}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">{e.period}</p>
                {e.note && <p className="text-[10px] text-slate-400 mt-0.5 italic">{e.note}</p>}
              </div>
            ))}
          </div>
        </SideSection>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <SideSection label={section.title}>
          <div className="section-content">
            {data.languages!.map(l => (
              <p key={l} className="text-[11px] sm:text-xs text-slate-600 mb-1">{l}</p>
            ))}
          </div>
        </SideSection>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <SideSection label={section.title}>
          <ul className="section-content space-y-1">
            {data.certifications!.map((c, i) => (
              <li key={i} className="text-[10px] sm:text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-blue-400 shrink-0 mt-0.5 text-[8px]">◆</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </SideSection>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <SideSection label={section.title}>
          <ul className="section-content space-y-1">
            {data.achievements.map((a, i) => (
              <li key={i} className="text-[10px] sm:text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-blue-400 shrink-0 mt-0.5 font-bold text-[8px]">✓</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </SideSection>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <SideSection label={section.title}>
          <ul className="section-content space-y-1">
            {section.customContent!.map((item, i) => (
              <li key={i} className="text-[10px] sm:text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="text-slate-400 shrink-0 mt-0.5">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SideSection>
      ) : null;

    default:
      return null;
  }
}

// ── Main renderers ────────────────────────────────────────────────────────────

function renderMainSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'summary':
      return data.summary ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <p className="section-content text-xs sm:text-sm text-slate-600 leading-relaxed">{data.summary}</p>
        </>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content space-y-5">
            {data.experience.map((exp, i) => (
              <div key={i} className="group hover:bg-slate-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">{exp.role}</p>
                    <p className="text-[11px] sm:text-xs text-blue-600 font-semibold">{exp.company} | {exp.location}</p>
                  </div>
                  <span className="self-start text-[11px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="text-[11px] sm:text-xs text-slate-600 flex items-start gap-2">
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-blue-400 shrink-0" />
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
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content space-y-3">
            {data.projects.map((p, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-1 hover:border-blue-700 hover:bg-blue-50/30 transition-all rounded-r">
                <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{p.name}</p>
                  {p.link && <span className="text-[11px] text-slate-400 break-all">{p.link}</span>}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">{p.description}</p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1">
                  {p.tech.map(t => (
                    <span key={t} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.achievements.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-600">
                <span className="shrink-0 mt-0.5 text-blue-500 font-bold">✓</span>
                {a}
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.certifications!.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-600">
                <span className="shrink-0 mt-0.5 text-blue-500 font-bold">✓</span>
                {c}
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'skills':
      return data.skills.length > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content flex flex-wrap gap-1.5">
            {data.skills.map(s => (
              <span key={s} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{s}</span>
            ))}
          </div>
        </>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content space-y-3">
            {data.education.map((e, i) => (
              <div key={i}>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">{e.degree}</p>
                <p className="text-[11px] sm:text-xs text-slate-500">{e.school} — {e.location}</p>
                <p className="text-[11px] text-blue-600">{e.period}</p>
                {e.note && <p className="text-[11px] text-slate-400 italic mt-0.5">{e.note}</p>}
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <div className="section-content flex flex-wrap gap-1.5">
            {data.languages!.map(l => (
              <span key={l} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{l}</span>
            ))}
          </div>
        </>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <>
          <div className="section-title"><CorporateHeader label={section.title} /></div>
          <ul className="section-content space-y-1.5">
            {section.customContent!.map((item, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-slate-600 flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-blue-400 font-bold">›</span>
                {item}
              </li>
            ))}
          </ul>
        </>
      ) : null;

    default:
      return null;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CorporateHeader({ label }: { label: string }) {
  return (
    <div className="mb-2.5 sm:mb-3">
      <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</h2>
      <div className="h-px bg-slate-200 mt-1.5" />
    </div>
  );
}

function SideSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="section-title text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </h3>
      {children}
    </div>
  );
}
