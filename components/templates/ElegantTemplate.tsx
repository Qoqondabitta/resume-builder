'use client';

import { type ResumeData } from '@/types/resume';
import { type SectionType } from '@/components/editor/SectionBlock';

export default function ElegantTemplate({ data }: { data: ResumeData; sectionOrder?: SectionType[] }) {
  return (
    <div className="w-full min-h-full bg-white font-serif text-gray-800 px-4 sm:px-8 lg:px-12 py-8 sm:py-10">

      {/* ── Centered header ── */}
      <header className="text-center mb-2">
        {data.photoUrl && (
          <div className="flex justify-center mb-3">
            <img
              src={data.photoUrl}
              alt={data.name}
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

      <ElegantDivider />

      {/* Summary */}
      <section data-section="summary">
        <Section label="Profile">
          <p className="section-content text-xs sm:text-sm leading-relaxed text-gray-600 text-center italic">
            {data.summary}
          </p>
        </Section>
      </section>

      <ElegantDivider />

      {/* Experience */}
      <section data-section="experience">
        <Section label="Professional Experience">
          <div className="section-content space-y-5 sm:space-y-6">
            {data.experience.map((exp) => (
              <div
                key={exp.role + exp.company}
                className="group hover:bg-amber-50/40 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 flex-wrap">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide">
                      {exp.role}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500 font-sans ml-0 sm:ml-2 block sm:inline">
                      — {exp.company}, {exp.location}
                    </span>
                  </div>
                  <span className="self-start text-[11px] font-sans text-amber-600 tracking-wide whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 sm:space-y-1.5">
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-[11px] sm:text-xs text-gray-600 font-sans leading-relaxed flex items-start gap-2 sm:gap-2.5"
                    >
                      <span className="shrink-0 text-amber-500 mt-0.5 text-[10px]">◆</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </section>

      <ElegantDivider />

      {/* Lower section — stack on mobile, three-col on sm */}
      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] gap-5 sm:gap-6">

        {/* Left: Education + Languages */}
        <div className="space-y-5">
          <section data-section="education">
            <ElegantSubHeader label="Education" />
            {data.education.map((e) => (
              <div key={e.degree} className="mb-2 last:mb-0">
                <p className="text-xs sm:text-sm font-bold text-gray-900">{e.degree}</p>
                <p className="text-[11px] sm:text-xs font-sans text-gray-500 mt-0.5">{e.school}</p>
                <p className="text-[11px] font-sans text-amber-600">{e.period}</p>
                {e.note && (
                  <p className="text-[11px] font-sans text-gray-400 italic mt-0.5">{e.note}</p>
                )}
              </div>
            ))}
          </section>

          {data.languages && data.languages.length > 0 && (
            <section data-section="languages">
              <ElegantSubHeader label="Languages" />
              <div className="section-content">
                {data.languages.map((l) => (
                  <p key={l} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-center gap-2 mb-1">
                    <span className="text-amber-400 text-[8px]">◆</span>{l}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Vertical divider — hidden on mobile */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="w-px flex-1 bg-amber-100" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-300 my-1" />
          <div className="w-px flex-1 bg-amber-100" />
        </div>

        {/* Right: Skills + Achievements + Certifications */}
        <div className="space-y-5">
          <section data-section="skills">
            <ElegantSubHeader label="Core Competencies" />
            <div className="section-content grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1">
              {data.skills.map((s) => (
                <p key={s} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-center gap-1.5">
                  <span className="text-amber-400 text-[8px] shrink-0">◆</span>
                  <span className="truncate">{s}</span>
                </p>
              ))}
            </div>
          </section>

          <section data-section="achievements">
            <ElegantSubHeader label="Achievements" />
            <div className="section-content space-y-1.5">
              {data.achievements.slice(0, 3).map((a) => (
                <p key={a} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-start gap-1.5 group">
                  <span className="text-amber-400 text-[8px] shrink-0 mt-0.5 group-hover:text-amber-500 transition-colors">◆</span>
                  {a}
                </p>
              ))}
            </div>
          </section>

          {data.certifications && data.certifications.length > 0 && (
            <section data-section="certifications">
              <ElegantSubHeader label="Certifications" />
              <div className="section-content space-y-1.5">
                {data.certifications.map((c) => (
                  <p key={c} className="text-[11px] sm:text-xs font-sans text-gray-600 flex items-start gap-1.5">
                    <span className="text-amber-400 text-[8px] shrink-0 mt-0.5">◆</span>
                    {c}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ElegantDivider />

      {/* Projects */}
      <section data-section="projects">
        <Section label="Notable Projects">
          <div className="section-content grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {data.projects.map((p) => (
              <div
                key={p.name}
                className="border border-amber-100 rounded-lg p-3 sm:p-4 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <p className="text-xs sm:text-sm font-bold text-gray-900">{p.name}</p>
                {p.link && (
                  <p className="text-[11px] font-sans text-amber-600 mt-0.5 break-all">{p.link}</p>
                )}
                <p className="text-[11px] sm:text-xs font-sans text-gray-600 mt-1 leading-relaxed">
                  {p.description}
                </p>
                <p className="text-[11px] font-sans text-gray-400 mt-1.5 italic">{p.tech.join(', ')}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

    </div>
  );
}

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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <h2 className="section-title text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-600 text-center mb-3 sm:mb-4">
        {label}
      </h2>
      {children}
    </div>
  );
}

function ElegantSubHeader({ label }: { label: string }) {
  return (
    <div className="section-title flex items-center gap-2 mb-2">
      <h3 className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-widest text-amber-600 whitespace-nowrap">
        {label}
      </h3>
      <div className="h-px flex-1 bg-amber-100" />
    </div>
  );
}
