'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { type ResumeData } from '@/types/resume';
import { type SectionType, type EditorSection } from '@/components/editor/SectionBlock';

// ── Defaults ──────────────────────────────────────────────────────────────────

/** Types that live in the sidebar by default (unless user overrides via position) */
const DEFAULT_SIDEBAR: Set<SectionType> = new Set<SectionType>(['skills', 'education', 'languages']);

const DEFAULT_SECTIONS: EditorSection[] = [
  { id: 'summary',        type: 'summary',        title: 'Summary'         },
  { id: 'experience',     type: 'experience',     title: 'Work Experience' },
  { id: 'education',      type: 'education',      title: 'Education'       },
  { id: 'skills',         type: 'skills',         title: 'Core Skills'     },
  { id: 'projects',       type: 'projects',       title: 'Projects'        },
  { id: 'achievements',   type: 'achievements',   title: 'Achievements'    },
  { id: 'certifications', type: 'certifications', title: 'Certifications'  },
  { id: 'languages',      type: 'languages',      title: 'Languages'       },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface ModernTemplateProps {
  data: ResumeData;
  sections?: EditorSection[];     // from editor — drives everything
  sectionOrder?: SectionType[];   // legacy fallback
}

export default function ModernTemplate({ data, sections, sectionOrder }: ModernTemplateProps) {
  // Build the ordered section list from whichever source is available
  const effectiveSections: EditorSection[] = sections
    ?? (sectionOrder
      ? sectionOrder.map(t => DEFAULT_SECTIONS.find(s => s.type === t) ?? { id: t, type: t, title: t })
      : DEFAULT_SECTIONS);

  // A section goes to the sidebar when:
  //  - it has explicit position 'left', OR
  //  - it has no explicit position AND it's in the default sidebar set
  const inSidebar = (s: EditorSection) =>
    s.position === 'left' || (!s.position && DEFAULT_SIDEBAR.has(s.type));

  const sidebarSections = effectiveSections.filter(inSidebar);
  const mainSections    = effectiveSections.filter(s => !inSidebar(s));

  const photoSize = data.photoWidth ?? 80;

  return (
    <div className="flex flex-col sm:flex-row min-h-full w-full font-sans text-gray-800 bg-white">

      {/* ── Sidebar ── */}
      <aside className="w-full sm:w-[200px] lg:w-[220px] shrink-0 bg-primary-600 text-white flex flex-col">

        {/* Name / title */}
        <div className="px-5 pt-6 pb-5 border-b border-white/20">
          {data.photoUrl && (
            <img
              src={data.photoUrl}
              alt={data.name}
              style={{ width: photoSize, height: photoSize }}
              className="rounded-2xl object-cover border-2 border-white/30 mb-3"
            />
          )}
          <h1 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight break-words">
            {data.name}
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm font-medium mt-1">{data.title}</p>
        </div>

        {/* Contact */}
        <div className="px-5 py-4 border-b border-white/20">
          <p className="text-[9px] font-bold uppercase tracking-widest text-blue-300 mb-2.5">Contact</p>
          <div className="flex flex-row flex-wrap sm:flex-col gap-x-4 gap-y-2">
            {[
              { icon: Mail,     val: data.email    },
              { icon: Phone,    val: data.phone    },
              { icon: MapPin,   val: data.location },
              ...(data.website  ? [{ icon: Globe,    val: data.website  }] : []),
              ...(data.linkedin ? [{ icon: Linkedin, val: data.linkedin }] : []),
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-start gap-1.5 min-w-0">
                <Icon size={11} className="mt-0.5 shrink-0 text-blue-300" />
                <span className="text-[10px] sm:text-[11px] leading-tight break-all">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic sidebar sections */}
        <div className="px-5 py-4 flex-1 space-y-5">
          {sidebarSections.map(section => {
            const node = renderSidebarSection(section, data);
            if (!node) return null;
            return (
              <section key={section.id} data-section={section.type}>
                {node}
              </section>
            );
          })}
        </div>
      </aside>

      {/* ── Main column ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5 sm:space-y-6 min-w-0">
        {mainSections.map(section => {
          const node = renderMainSection(section, data);
          if (!node) return null;
          return (
            <section key={section.id} data-section={section.type}>
              {node}
            </section>
          );
        })}
      </main>
    </div>
  );
}

// ── Sidebar section renderers ─────────────────────────────────────────────────

function renderSidebarSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'skills':
      return data.skills.length > 0 ? (
        <SidebarBlock label={section.title}>
          <div className="flex flex-row flex-wrap sm:flex-col gap-x-3 gap-y-0 section-content">
            {data.skills.map(s => (
              <div key={s} className="flex items-center gap-1.5 py-0.5 min-w-0">
                <div className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                <span className="text-[10px] sm:text-[11px] text-blue-100 leading-tight truncate">{s}</span>
              </div>
            ))}
          </div>
        </SidebarBlock>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <SidebarBlock label={section.title}>
          <div className="space-y-3 section-content">
            {data.education.map((e, i) => (
              <div key={i}>
                <p className="text-[11px] sm:text-xs font-semibold leading-tight break-words">{e.degree}</p>
                <p className="text-[10px] sm:text-[11px] text-blue-200 mt-0.5">{e.school}</p>
                <p className="text-[10px] sm:text-[11px] text-blue-300">{e.period}</p>
                {e.note && <p className="text-[10px] text-blue-300 italic mt-0.5">{e.note}</p>}
              </div>
            ))}
          </div>
        </SidebarBlock>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <SidebarBlock label={section.title}>
          <div className="flex flex-row flex-wrap sm:flex-col gap-x-3 gap-y-0.5 section-content">
            {data.languages!.map(l => (
              <p key={l} className="text-[10px] sm:text-[11px] text-blue-100">{l}</p>
            ))}
          </div>
        </SidebarBlock>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <SidebarBlock label={section.title}>
          <ul className="space-y-1 section-content">
            {data.certifications!.map((c, i) => (
              <li key={i} className="text-[10px] sm:text-[11px] text-blue-100 flex items-start gap-1.5">
                <span className="text-blue-300 shrink-0 mt-0.5 text-[8px]">◆</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </SidebarBlock>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <SidebarBlock label={section.title}>
          <ul className="space-y-1 section-content">
            {data.achievements.map((a, i) => (
              <li key={i} className="text-[10px] sm:text-[11px] text-blue-100 flex items-start gap-1.5">
                <span className="text-yellow-300 shrink-0 text-[8px] mt-0.5">★</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </SidebarBlock>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <SidebarBlock label={section.title}>
          <ul className="space-y-1 section-content">
            {section.customContent!.map((item, i) => (
              <li key={i} className="text-[10px] sm:text-[11px] text-blue-100 flex items-start gap-1.5">
                <span className="text-blue-300 shrink-0 mt-1">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SidebarBlock>
      ) : null;

    default:
      return null;
  }
}

// ── Main section renderers ────────────────────────────────────────────────────

function renderMainSection(section: EditorSection, data: ResumeData): React.ReactNode {
  switch (section.type) {
    case 'summary':
      return data.summary ? (
        <>
          <MainHeader label={section.title} />
          <p className="section-content text-xs sm:text-sm text-gray-600 leading-relaxed">{data.summary}</p>
        </>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <>
          <MainHeader label={section.title} />
          <div className="space-y-5 section-content">
            {data.experience.map((exp, i) => (
              <div key={i} className="group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide">{exp.role}</p>
                    <p className="text-[11px] sm:text-xs text-primary-500 font-semibold">
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </p>
                  </div>
                  <span className="self-start text-[11px] text-gray-400 border border-gray-200 px-2 py-0.5 rounded whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="text-[11px] sm:text-xs text-gray-600 flex items-start gap-2">
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-primary-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <>
          <MainHeader label={section.title} />
          <div className="space-y-3 section-content">
            {data.education.map((e, i) => (
              <div key={i}>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{e.degree}</p>
                <p className="text-[11px] sm:text-xs text-gray-500">{e.school}{e.location ? ` — ${e.location}` : ''}</p>
                <p className="text-[11px] text-primary-500">{e.period}</p>
                {e.note && <p className="text-[11px] text-gray-400 italic mt-0.5">{e.note}</p>}
              </div>
            ))}
          </div>
        </>
      ) : null;

    case 'skills':
      return data.skills.length > 0 ? (
        <>
          <MainHeader label={section.title} />
          <div className="flex flex-wrap gap-1.5 section-content">
            {data.skills.map(s => (
              <span key={s} className="text-[11px] bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </>
      ) : null;

    case 'projects':
      return data.projects.length > 0 ? (
        <>
          <MainHeader label={section.title} />
          <div className="space-y-4 section-content">
            {data.projects.map((p, i) => (
              <div key={i} className="border-l-2 border-primary-200 pl-3 hover:border-primary-400 transition-colors">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{p.name}</p>
                  {p.link && <span className="text-[11px] text-gray-400 break-all">{p.link}</span>}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.tech.map(t => (
                    <span key={t} className="text-[10px] bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded font-medium">{t}</span>
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
          <MainHeader label={section.title} />
          <ul className="space-y-1.5 section-content">
            {data.achievements.map((a, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-gray-600 flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-primary-500 font-bold">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </>
      ) : null;

    case 'certifications':
      return (data.certifications?.length ?? 0) > 0 ? (
        <>
          <MainHeader label={section.title} />
          <ul className="space-y-1.5 section-content">
            {data.certifications!.map((c, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-gray-600 flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-primary-500 font-bold">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </>
      ) : null;

    case 'languages':
      return (data.languages?.length ?? 0) > 0 ? (
        <>
          <MainHeader label={section.title} />
          <div className="flex flex-wrap gap-1.5 section-content">
            {data.languages!.map(l => (
              <span key={l} className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{l}</span>
            ))}
          </div>
        </>
      ) : null;

    case 'custom':
      return (section.customContent?.length ?? 0) > 0 ? (
        <>
          <MainHeader label={section.title} />
          <ul className="space-y-1.5 section-content">
            {section.customContent!.map((item, i) => (
              <li key={i} className="text-[11px] sm:text-xs text-gray-600 flex items-start gap-2">
                <span className="shrink-0 mt-0.5 w-1 h-1 rounded-full bg-primary-400 mt-1.5" />
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

function SidebarBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="section-title text-[9px] font-bold uppercase tracking-widest text-blue-300 mb-2">{label}</p>
      {children}
    </div>
  );
}

function MainHeader({ label }: { label: string }) {
  return (
    <div className="section-title mb-2.5 sm:mb-3">
      <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</h2>
      <div className="h-px bg-gray-100 mt-1.5" />
    </div>
  );
}
