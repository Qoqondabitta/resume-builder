'use client';

import { ResumeData } from '@/types/resume';

export default function MinimalistTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800 px-12 py-10">

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{data.name}</h1>
        <p className="text-base text-gray-500 mt-1 font-light">{data.title}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-gray-400">
          <span>{data.email}</span>
          <span>{data.phone}</span>
          <span>{data.location}</span>
          {data.website  && <span>{data.website}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </header>

      <Divider />

      {/* Summary */}
      <Section label="Summary">
        <p className="text-sm text-gray-600 leading-relaxed font-light">{data.summary}</p>
      </Section>

      <Divider />

      {/* Experience */}
      <Section label="Experience">
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.role + exp.company} className="grid grid-cols-[1fr_auto] gap-x-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">{exp.role}</p>
                <p className="text-xs text-gray-500 mt-0.5">{exp.company} &mdash; {exp.location}</p>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b) => (
                    <li key={b} className="text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1 before:h-px before:bg-gray-400">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="text-[11px] text-gray-400 whitespace-nowrap pt-0.5">{exp.period}</span>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Education */}
      <Section label="Education">
        {data.education.map((e) => (
          <div key={e.degree} className="grid grid-cols-[1fr_auto] gap-x-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">{e.degree}</p>
              <p className="text-xs text-gray-500">{e.school} &mdash; {e.location}</p>
              {e.note && <p className="text-xs text-gray-400 font-light mt-0.5">{e.note}</p>}
            </div>
            <span className="text-[11px] text-gray-400 whitespace-nowrap pt-0.5">{e.period}</span>
          </div>
        ))}
      </Section>

      <Divider />

      {/* Skills */}
      <Section label="Skills">
        <p className="text-sm text-gray-600 font-light">{data.skills.join('  ·  ')}</p>
      </Section>

      <Divider />

      {/* Projects */}
      <Section label="Projects">
        <div className="space-y-4">
          {data.projects.map((p) => (
            <div key={p.name}>
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                {p.link && <span className="text-xs text-gray-400">{p.link}</span>}
              </div>
              <p className="text-xs text-gray-600 font-light mt-0.5">{p.description}</p>
              <p className="text-[11px] text-gray-400 mt-1">{p.tech.join(', ')}</p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      {/* Achievements */}
      <Section label="Achievements">
        <ul className="space-y-1">
          {data.achievements.map((a) => (
            <li key={a} className="text-xs text-gray-600 font-light pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1 before:h-px before:bg-gray-400">
              {a}
            </li>
          ))}
        </ul>
      </Section>

      {data.languages && (
        <>
          <Divider />
          <Section label="Languages">
            <p className="text-sm text-gray-600 font-light">{data.languages.join('  ·  ')}</p>
          </Section>
        </>
      )}
    </div>
  );
}

function Divider() {
  return <hr className="border-gray-100 my-5" />;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-x-8 py-1">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 pt-0.5">{label}</p>
      <div>{children}</div>
    </div>
  );
}
