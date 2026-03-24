'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { type ResumeData } from '@/types/resume';
import { type SectionType } from '@/components/editor/SectionBlock';

export default function CorporateTemplate({ data }: { data: ResumeData; sectionOrder?: SectionType[] }) {
  return (
    <div className="w-full min-h-full bg-white font-sans text-gray-800">

      {/* ── Dark navy header ── */}
      <header className="bg-slate-800 text-white px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
        <div className="flex items-center gap-4">
          {data.photoUrl && (
            <img
              src={data.photoUrl}
              alt={data.name}
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

      {/* ── Body: stack on mobile, side-by-side from sm ── */}
      <div className="flex flex-col sm:flex-row">

        {/* Sidebar */}
        <aside className="w-full sm:w-[180px] lg:w-[200px] shrink-0 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-100 px-4 sm:px-5 lg:px-6 py-5 sm:py-7">
          {/* On mobile: 3-column grid for sections; on sm: stacked */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-5 sm:space-y-6 sm:gap-0">

            <CorporateSideSection label="Skills">
              <div className="flex flex-wrap sm:block gap-x-3 gap-y-0.5">
                {data.skills.map((s) => (
                  <div key={s} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700 mb-1 sm:mb-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </CorporateSideSection>

            <CorporateSideSection label="Education">
              {data.education.map((e) => (
                <div key={e.degree} className="mb-3 last:mb-0">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-800">{e.degree}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">{e.school}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">{e.period}</p>
                  {e.note && (
                    <p className="text-[10px] text-slate-400 mt-0.5 italic">{e.note}</p>
                  )}
                </div>
              ))}
            </CorporateSideSection>

            {data.languages && (
              <CorporateSideSection label="Languages">
                {data.languages.map((l) => (
                  <p key={l} className="text-[11px] sm:text-xs text-slate-600 mb-1">{l}</p>
                ))}
              </CorporateSideSection>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-5 sm:space-y-6 min-w-0">

          <section data-section="summary">
            <div className="section-title"><CorporateHeader label="Executive Summary" /></div>
            <p className="section-content text-xs sm:text-sm text-slate-600 leading-relaxed">{data.summary}</p>
          </section>

          <section data-section="experience">
            <div className="section-title"><CorporateHeader label="Professional Experience" /></div>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div
                  key={exp.role + exp.company}
                  className="group hover:bg-slate-50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                        {exp.role}
                      </p>
                      <p className="text-[11px] sm:text-xs text-blue-600 font-semibold">
                        {exp.company} | {exp.location}
                      </p>
                    </div>
                    <span className="self-start text-[11px] text-slate-500 border border-slate-200 px-2 py-0.5 rounded whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {exp.bullets.map((b) => (
                      <li key={b} className="text-[11px] sm:text-xs text-slate-600 flex items-start gap-2">
                        <span className="mt-[5px] w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section data-section="projects">
            <div className="section-title"><CorporateHeader label="Key Projects" /></div>
            <div className="space-y-3">
              {data.projects.map((p) => (
                <div
                  key={p.name}
                  className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-1
                    hover:border-blue-700 hover:bg-blue-50/30 transition-all rounded-r"
                >
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{p.name}</p>
                    {p.link && (
                      <span className="text-[11px] text-slate-400 break-all">{p.link}</span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">{p.description}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section data-section="achievements">
            <div className="section-title"><CorporateHeader label="Awards & Achievements" /></div>
            <div className="section-content grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.achievements.map((a) => (
                <div key={a} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-600">
                  <span className="shrink-0 mt-0.5 text-blue-500 font-bold">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </section>

          {data.certifications && data.certifications.length > 0 && (
            <section data-section="certifications">
              <div className="section-title"><CorporateHeader label="Certifications" /></div>
              <div className="section-content grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.certifications.map((c) => (
                  <div key={c} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-600">
                    <span className="shrink-0 mt-0.5 text-blue-500 font-bold">✓</span>
                    {c}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function CorporateHeader({ label }: { label: string }) {
  return (
    <div className="mb-2.5 sm:mb-3">
      <h2 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500">
        {label}
      </h2>
      <div className="h-px bg-slate-200 mt-1.5" />
    </div>
  );
}

function CorporateSideSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </h3>
      {children}
    </div>
  );
}
