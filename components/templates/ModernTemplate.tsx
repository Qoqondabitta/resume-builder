'use client';

import {
  Mail, Phone, MapPin, Globe, Linkedin,
  Briefcase, Star, FolderGit2, Trophy, Award,
  type LucideProps,
} from 'lucide-react';
import { type ComponentType } from 'react';
import { type ResumeData } from '@/types/resume';
import { type SectionType } from '@/components/editor/SectionBlock';

// Sections that live in the main column (can be reordered)
const MAIN_SECTION_TYPES: SectionType[] = [
  'summary', 'experience', 'projects', 'achievements', 'certifications', 'custom',
];

interface ModernTemplateProps {
  data: ResumeData;
  sectionOrder?: SectionType[];
}

export default function ModernTemplate({ data, sectionOrder }: ModernTemplateProps) {
  // Determine order of main content sections
  const orderedMain = sectionOrder
    ? sectionOrder.filter(t => MAIN_SECTION_TYPES.includes(t))
    : MAIN_SECTION_TYPES;

  return (
    <div className="flex flex-col sm:flex-row min-h-full w-full font-sans text-gray-800 bg-white">

      {/* ── Sidebar (fixed) ── */}
      <aside className="w-full sm:w-[200px] lg:w-[220px] shrink-0 bg-primary-600 text-white flex flex-col">

        <div className="px-5 pt-6 pb-5 border-b border-white/20">
          {data.photoUrl && (
            <img
              src={data.photoUrl}
              alt={data.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 mb-3"
            />
          )}
          <h1 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight">
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

        {/* Skills */}
        <div className="px-5 py-4 border-b border-white/20">
          <p className="text-[9px] font-bold uppercase tracking-widest text-blue-300 mb-2.5">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s} className="bg-white/15 hover:bg-white/25 transition-colors text-white text-[10px] px-2 py-0.5 rounded-full font-medium cursor-default">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="px-5 py-4 border-b border-white/20">
          <p className="text-[9px] font-bold uppercase tracking-widest text-blue-300 mb-2.5">Education</p>
          {data.education.map((e) => (
            <div key={e.degree} className="mb-3 last:mb-0">
              <p className="text-[11px] font-semibold leading-snug">{e.degree}</p>
              <p className="text-blue-200 text-[10px] mt-0.5">{e.school}</p>
              <p className="text-blue-300 text-[10px]">{e.period}</p>
              {e.note && <p className="text-blue-200 text-[10px] mt-0.5 italic">{e.note}</p>}
            </div>
          ))}
        </div>

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div className="px-5 py-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-blue-300 mb-2.5">Languages</p>
            {data.languages.map((l) => (
              <p key={l} className="text-[10px] sm:text-[11px] mb-1">{l}</p>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6 min-w-0">
        {orderedMain.map(type => renderMainSection(type, data))}
      </main>
    </div>
  );
}

function renderMainSection(type: SectionType, data: ResumeData): React.ReactNode {
  switch (type) {
    case 'summary':
      return data.summary ? (
        <section key="summary" data-section="summary">
          <div className="section-title">
            <SectionHeader icon={Star} label="Professional Summary" />
          </div>
          <div className="section-content">
            <p className="text-xs sm:text-sm leading-relaxed text-gray-600">{data.summary}</p>
          </div>
        </section>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <section key="experience" data-section="experience">
          <div className="section-title">
            <SectionHeader icon={Briefcase} label="Experience" />
          </div>
          <div className="section-content space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.role + exp.company} className="group rounded-lg p-2 -mx-2 hover:bg-primary-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{exp.role}</p>
                    <p className="text-[11px] text-primary-600 font-semibold">{exp.company} · {exp.location}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-600">
                      <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null;

    case 'projects':
      return data.projects.length > 0 ? (
        <section key="projects" data-section="projects">
          <div className="section-title">
            <SectionHeader icon={FolderGit2} label="Projects" />
          </div>
          <div className="section-content space-y-3">
            {data.projects.map((p) => (
              <div key={p.name} className="border-l-2 border-primary-200 pl-3 hover:border-primary-400 transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{p.name}</p>
                  {p.link && <span className="text-[10px] text-primary-500">{p.link}</span>}
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <section key="achievements" data-section="achievements">
          <div className="section-title">
            <SectionHeader icon={Trophy} label="Achievements" />
          </div>
          <ul className="section-content space-y-1.5">
            {data.achievements.map((a) => (
              <li key={a} className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-600">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </section>
      ) : null;

    case 'certifications':
      return data.certifications && data.certifications.length > 0 ? (
        <section key="certifications" data-section="certifications">
          <div className="section-title">
            <SectionHeader icon={Award} label="Certifications" />
          </div>
          <ul className="section-content space-y-1.5">
            {data.certifications.map((c) => (
              <li key={c} className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-600">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </section>
      ) : null;

    default:
      return null;
  }
}

interface SectionHeaderProps {
  icon: ComponentType<LucideProps>;
  label: string;
}

function SectionHeader({ icon, label }: SectionHeaderProps) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={14} className="text-primary-600 shrink-0" />}
      <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary-600 whitespace-nowrap">
        {label}
      </h2>
      <div className="flex-1 h-px bg-primary-100" />
    </div>
  );
}
