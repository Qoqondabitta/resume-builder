'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { ResumeData } from '@/types/resume';

export default function CorporateTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800">

      {/* ── Dark navy header ── */}
      <header className="bg-slate-800 text-white px-10 py-8">
        <h1 className="text-3xl font-bold tracking-wide uppercase">{data.name}</h1>
        <p className="text-slate-300 text-sm font-medium tracking-widest uppercase mt-1">{data.title}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-4">
          {[
            { icon: Mail,     val: data.email    },
            { icon: Phone,    val: data.phone    },
            { icon: MapPin,   val: data.location },
            ...(data.website  ? [{ icon: Globe,    val: data.website  }] : []),
            ...(data.linkedin ? [{ icon: Linkedin, val: data.linkedin }] : []),
          ].map(({ icon: Icon, val }) => (
            <div key={val} className="flex items-center gap-1.5 text-slate-300 text-xs">
              <Icon size={11} />
              <span>{val}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Thin accent bar ── */}
      <div className="h-1 bg-gradient-to-r from-slate-600 via-blue-500 to-slate-600" />

      <div className="flex">
        {/* ── Left narrow column ── */}
        <aside className="w-[200px] shrink-0 bg-slate-50 border-r border-slate-100 px-6 py-7 space-y-6">

          <CorporateSideSection label="Skills">
            <ul className="space-y-1.5">
              {data.skills.map((s) => (
                <li key={s} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </CorporateSideSection>

          <CorporateSideSection label="Education">
            {data.education.map((e) => (
              <div key={e.degree} className="mb-3 last:mb-0">
                <p className="text-xs font-semibold text-slate-800">{e.degree}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{e.school}</p>
                <p className="text-[11px] text-slate-400">{e.period}</p>
                {e.note && <p className="text-[10px] text-slate-400 mt-1 italic">{e.note}</p>}
              </div>
            ))}
          </CorporateSideSection>

          {data.languages && (
            <CorporateSideSection label="Languages">
              <ul className="space-y-1">
                {data.languages.map((l) => (
                  <li key={l} className="text-xs text-slate-600">{l}</li>
                ))}
              </ul>
            </CorporateSideSection>
          )}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 px-8 py-7 space-y-6">

          {/* Summary */}
          <section>
            <CorporateHeader label="Executive Summary" />
            <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
          </section>

          {/* Experience */}
          <section>
            <CorporateHeader label="Professional Experience" />
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.role + exp.company}>
                  <div className="flex items-start justify-between flex-wrap gap-1">
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide">{exp.role}</p>
                      <p className="text-xs text-blue-600 font-semibold">{exp.company} | {exp.location}</p>
                    </div>
                    <span className="text-[11px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-right">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {exp.bullets.map((b) => (
                      <li key={b} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <CorporateHeader label="Key Projects" />
            <div className="space-y-3">
              {data.projects.map((p) => (
                <div key={p.name} className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    {p.link && <span className="text-[11px] text-slate-400">{p.link}</span>}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.tech.map((t) => (
                      <span key={t} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <CorporateHeader label="Awards & Achievements" />
            <div className="grid sm:grid-cols-2 gap-2">
              {data.achievements.map((a) => (
                <div key={a} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="shrink-0 mt-0.5 text-blue-500 font-bold">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function CorporateHeader({ label }: { label: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</h2>
      <div className="h-px bg-slate-200 mt-1.5" />
    </div>
  );
}

function CorporateSideSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">{label}</h3>
      {children}
    </div>
  );
}
