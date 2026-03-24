'use client';

import { type ResumeData } from '@/types/resume';
import { type SectionType } from '@/components/editor/SectionBlock';

const ALL_SECTION_TYPES: SectionType[] = [
  'summary', 'experience', 'education', 'skills', 'projects',
  'achievements', 'certifications', 'languages',
];

interface MinimalistTemplateProps {
  data: ResumeData;
  sectionOrder?: SectionType[];
}

export default function MinimalistTemplate({ data, sectionOrder }: MinimalistTemplateProps) {
  const ordered = sectionOrder
    ? sectionOrder.filter(t => ALL_SECTION_TYPES.includes(t))
    : ALL_SECTION_TYPES;

  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800 px-4 sm:px-8 lg:px-12 py-8 sm:py-10">

      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-gray-900 break-words">
          {data.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 font-light">{data.title}</p>
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

      {ordered.map((type, i) => {
        const node = renderSection(type, data);
        if (!node) return null;
        return (
          <div key={type}>
            {i > 0 && <Divider />}
            {node}
          </div>
        );
      })}
    </div>
  );
}

function renderSection(type: SectionType, data: ResumeData): React.ReactNode {
  switch (type) {
    case 'summary':
      return data.summary ? (
        <section data-section="summary">
          <Section label="Summary">
            <div className="section-title hidden" />
            <div className="section-content">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{data.summary}</p>
            </div>
          </Section>
        </section>
      ) : null;

    case 'experience':
      return data.experience.length > 0 ? (
        <section data-section="experience">
          <Section label="Experience">
            <div className="section-content space-y-5 sm:space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.role + exp.company} className="group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                  <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">{exp.role}</p>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{exp.company} &mdash; {exp.location}</p>
                      <ul className="mt-2 space-y-1">
                        {exp.bullets.map((b) => (
                          <li key={b} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
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
        </section>
      ) : null;

    case 'education':
      return data.education.length > 0 ? (
        <section data-section="education">
          <Section label="Education">
            <div className="section-content">
              {data.education.map((e) => (
                <div key={e.degree} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4 mb-3 last:mb-0">
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
        </section>
      ) : null;

    case 'skills':
      return data.skills.length > 0 ? (
        <section data-section="skills">
          <Section label="Skills">
            <div className="section-content flex flex-wrap gap-x-1 gap-y-0.5">
              {data.skills.map((s, i) => (
                <span key={s} className="text-xs sm:text-sm text-gray-600 font-light">
                  {s}{i < data.skills.length - 1 && <span className="text-gray-300 mx-1.5">·</span>}
                </span>
              ))}
            </div>
          </Section>
        </section>
      ) : null;

    case 'projects':
      return data.projects.length > 0 ? (
        <section data-section="projects">
          <Section label="Projects">
            <div className="section-content space-y-4">
              {data.projects.map((p) => (
                <div key={p.name} className="hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
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
        </section>
      ) : null;

    case 'achievements':
      return data.achievements.length > 0 ? (
        <section data-section="achievements">
          <Section label="Achievements">
            <ul className="section-content space-y-1.5">
              {data.achievements.map((a) => (
                <li key={a} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
                  {a}
                </li>
              ))}
            </ul>
          </Section>
        </section>
      ) : null;

    case 'certifications':
      return data.certifications && data.certifications.length > 0 ? (
        <section data-section="certifications">
          <Section label="Certifications">
            <ul className="section-content space-y-1.5">
              {data.certifications.map((c) => (
                <li key={c} className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300">
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        </section>
      ) : null;

    case 'languages':
      return data.languages && data.languages.length > 0 ? (
        <section data-section="languages">
          <Section label="Languages">
            <p className="section-content text-xs sm:text-sm text-gray-600 font-light">
              {data.languages.join('  ·  ')}
            </p>
          </Section>
        </section>
      ) : null;

    default:
      return null;
  }
}

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
