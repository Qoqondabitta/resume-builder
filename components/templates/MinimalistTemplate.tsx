'use client';

import { ResumeData } from '@/types/resume';

export default function MinimalistTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800 px-4 sm:px-8 lg:px-12 py-8 sm:py-10">

      {/* Header */}
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

      <Divider />

      <Section label="Summary">
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">{data.summary}</p>
      </Section>

      <Divider />

      <Section label="Experience">
        <div className="space-y-5 sm:space-y-6">
          {data.experience.map((exp) => (
            <div
              key={exp.role + exp.company}
              className="group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
            >
              {/* On mobile: date below title; on sm+: grid with date on right */}
              <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{exp.role}</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    {exp.company} &mdash; {exp.location}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative
                          before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300"
                      >
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

      <Divider />

      <Section label="Education">
        {data.education.map((e) => (
          <div key={e.degree} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] sm:gap-x-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{e.degree}</p>
              <p className="text-[11px] sm:text-xs text-gray-500">
                {e.school} &mdash; {e.location}
              </p>
              {e.note && (
                <p className="text-[11px] sm:text-xs text-gray-400 font-light mt-0.5">{e.note}</p>
              )}
            </div>
            <span className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5 sm:pt-0.5">
              {e.period}
            </span>
          </div>
        ))}
      </Section>

      <Divider />

      <Section label="Skills">
        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
          {data.skills.map((s, i) => (
            <span key={s} className="text-xs sm:text-sm text-gray-600 font-light">
              {s}{i < data.skills.length - 1 && <span className="text-gray-300 mx-1.5">·</span>}
            </span>
          ))}
        </div>
      </Section>

      <Divider />

      <Section label="Projects">
        <div className="space-y-4">
          {data.projects.map((p) => (
            <div
              key={p.name}
              className="hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
            >
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

      <Divider />

      <Section label="Achievements">
        <ul className="space-y-1.5">
          {data.achievements.map((a) => (
            <li
              key={a}
              className="text-[11px] sm:text-xs text-gray-600 font-light pl-3 relative
                before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-px before:bg-gray-300"
            >
              {a}
            </li>
          ))}
        </ul>
      </Section>

      {data.languages && (
        <>
          <Divider />
          <Section label="Languages">
            <p className="text-xs sm:text-sm text-gray-600 font-light">
              {data.languages.join('  ·  ')}
            </p>
          </Section>
        </>
      )}
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100 my-4 sm:my-5" />;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    /* On mobile: stacked (label above content); on sm+: two-column label/content */
    <div className="flex flex-col sm:grid sm:grid-cols-[100px_1fr] lg:grid-cols-[120px_1fr] sm:gap-x-6 lg:gap-x-8 py-1 gap-y-1.5">
      <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-gray-400 pt-0.5">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}
