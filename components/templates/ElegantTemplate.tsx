'use client';

import { ResumeData } from '@/types/resume';

export default function ElegantTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-full min-h-full bg-white font-serif text-gray-800 px-12 py-10">

      {/* ── Centered header ── */}
      <header className="text-center mb-2">
        <h1 className="text-4xl font-bold tracking-[0.15em] uppercase text-gray-900">{data.name}</h1>
        <p className="text-sm tracking-[0.3em] uppercase text-amber-600 font-sans mt-2">{data.title}</p>

        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-amber-400" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
          <div className="h-px w-16 bg-amber-400" />
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-4 text-xs font-sans text-gray-500 tracking-wide">
          <span>{data.email}</span>
          <Dot />
          <span>{data.phone}</span>
          <Dot />
          <span>{data.location}</span>
          {data.website  && <><Dot /><span>{data.website}</span></>}
          {data.linkedin && <><Dot /><span>{data.linkedin}</span></>}
        </div>
      </header>

      <ElegantDivider />

      {/* Summary */}
      <Section label="Profile">
        <p className="text-sm leading-relaxed text-gray-600 text-center italic">{data.summary}</p>
      </Section>

      <ElegantDivider />

      {/* Experience */}
      <Section label="Professional Experience">
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.role + exp.company}>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-sm font-bold text-gray-900 tracking-wide">{exp.role}</span>
                  <span className="text-xs text-gray-500 font-sans ml-2">— {exp.company}, {exp.location}</span>
                </div>
                <span className="text-[11px] font-sans text-amber-600 tracking-wide">{exp.period}</span>
              </div>
              <ul className="mt-2 space-y-1.5">
                {exp.bullets.map((b) => (
                  <li key={b} className="text-xs text-gray-600 font-sans leading-relaxed flex items-start gap-2.5">
                    <span className="shrink-0 text-amber-500 mt-0.5 text-[10px]">◆</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <ElegantDivider />

      {/* Two-column lower section */}
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-6">

        {/* Left: Education + Languages */}
        <div className="space-y-5">
          <div>
            <ElegantSubHeader label="Education" />
            {data.education.map((e) => (
              <div key={e.degree}>
                <p className="text-sm font-bold text-gray-900">{e.degree}</p>
                <p className="text-xs font-sans text-gray-500 mt-0.5">{e.school}</p>
                <p className="text-[11px] font-sans text-amber-600">{e.period}</p>
                {e.note && <p className="text-[11px] font-sans text-gray-400 italic mt-1">{e.note}</p>}
              </div>
            ))}
          </div>

          {data.languages && (
            <div>
              <ElegantSubHeader label="Languages" />
              {data.languages.map((l) => (
                <p key={l} className="text-xs font-sans text-gray-600 flex items-center gap-2">
                  <span className="text-amber-400 text-[8px]">◆</span>{l}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:flex flex-col items-center">
          <div className="w-px flex-1 bg-amber-100" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-300 my-1" />
          <div className="w-px flex-1 bg-amber-100" />
        </div>

        {/* Right: Skills */}
        <div className="space-y-5">
          <div>
            <ElegantSubHeader label="Core Competencies" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {data.skills.map((s) => (
                <p key={s} className="text-xs font-sans text-gray-600 flex items-center gap-1.5">
                  <span className="text-amber-400 text-[8px]">◆</span>{s}
                </p>
              ))}
            </div>
          </div>

          <div>
            <ElegantSubHeader label="Achievements" />
            <div className="space-y-1.5">
              {data.achievements.slice(0, 3).map((a) => (
                <p key={a} className="text-xs font-sans text-gray-600 flex items-start gap-1.5">
                  <span className="text-amber-400 text-[8px] shrink-0 mt-0.5">◆</span>{a}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ElegantDivider />

      {/* Projects */}
      <Section label="Notable Projects">
        <div className="grid sm:grid-cols-2 gap-5">
          {data.projects.map((p) => (
            <div key={p.name} className="border border-amber-100 rounded-lg p-4">
              <p className="text-sm font-bold text-gray-900">{p.name}</p>
              {p.link && <p className="text-[11px] font-sans text-amber-600 mt-0.5">{p.link}</p>}
              <p className="text-xs font-sans text-gray-600 mt-1 leading-relaxed">{p.description}</p>
              <p className="text-[11px] font-sans text-gray-400 mt-2 italic">{p.tech.join(', ')}</p>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}

function Dot() {
  return <span className="text-amber-400">·</span>;
}

function ElegantDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px flex-1 bg-amber-100" />
      <div className="w-1 h-1 rotate-45 bg-amber-300" />
      <div className="h-px w-8 bg-amber-100" />
      <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
      <div className="h-px w-8 bg-amber-100" />
      <div className="w-1 h-1 rotate-45 bg-amber-300" />
      <div className="h-px flex-1 bg-amber-100" />
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-1">
      <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-amber-600 text-center mb-4">{label}</h2>
      {children}
    </section>
  );
}

function ElegantSubHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-600">{label}</h3>
      <div className="h-px flex-1 bg-amber-100" />
    </div>
  );
}
