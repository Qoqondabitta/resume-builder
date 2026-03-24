'use client';

import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { type ResumeData } from '@/types/resume';
import { type SectionType } from '@/components/editor/SectionBlock';

const ACCENT = 'from-violet-600 to-blue-600';

export default function CreativeTemplate({ data }: { data: ResumeData; sectionOrder?: SectionType[] }) {
  return (
    <div className="w-full min-h-full bg-gray-50 font-sans text-gray-800">

      {/* ── Gradient header ── */}
      <header className={`bg-gradient-to-r ${ACCENT} text-white px-4 sm:px-8 lg:px-10 py-7 sm:py-10`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {data.photoUrl && (
              <img
                src={data.photoUrl}
                alt={data.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30 shrink-0"
              />
            )}
            <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none break-words">
              {data.name}
            </h1>
            <p className="text-violet-200 text-base sm:text-lg font-light mt-2">{data.title}</p>
            </div>
          </div>
          {/* Contact — left-aligned on mobile, right-aligned on sm */}
          <div className="flex flex-col sm:items-end gap-1 sm:gap-1.5 shrink-0">
            {[
              { icon: Mail,     val: data.email    },
              { icon: Phone,    val: data.phone    },
              { icon: MapPin,   val: data.location },
              ...(data.website  ? [{ icon: Globe,    val: data.website  }] : []),
              ...(data.linkedin ? [{ icon: Linkedin, val: data.linkedin }] : []),
            ].map(({ icon: Icon, val }) => (
              <div
                key={val}
                className="flex items-center gap-1.5 text-violet-100 text-[11px] sm:text-xs sm:flex-row-reverse"
              >
                <Icon size={11} className="shrink-0" />
                <span className="break-all">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Summary */}
        <section data-section="summary">
          <div className="section-title"><CreativeSectionTitle label="About Me" /></div>
          <p className="section-content text-xs sm:text-sm text-gray-600 leading-relaxed">{data.summary}</p>
        </section>

        {/* Skills */}
        <section data-section="skills">
          <div className="section-title"><CreativeSectionTitle label="Skills & Technologies" /></div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {data.skills.map((s, i) => (
              <span
                key={s}
                className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full
                  cursor-default transition-opacity hover:opacity-80 ${
                  i % 4 === 0 ? 'bg-violet-100 text-violet-700' :
                  i % 4 === 1 ? 'bg-blue-100 text-blue-700' :
                  i % 4 === 2 ? 'bg-pink-100 text-pink-700' :
                               'bg-emerald-100 text-emerald-700'
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Experience timeline */}
        <section data-section="experience">
          <div className="section-title"><CreativeSectionTitle label="Work Experience" /></div>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div
                key={exp.role + exp.company}
                className="relative pl-5 border-l-2 border-violet-200 hover:border-violet-400 transition-colors group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-violet-400 group-hover:border-violet-600 transition-colors flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{exp.role}</p>
                    <p className="text-[11px] sm:text-xs font-semibold text-violet-600">{exp.company}</p>
                    <p className="text-[11px] text-gray-400">{exp.location}</p>
                  </div>
                  <span className="self-start text-[11px] bg-violet-50 text-violet-600 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b) => (
                    <li key={b} className="text-[11px] sm:text-xs text-gray-600 flex gap-2">
                      <span className="text-violet-400 shrink-0 font-bold">›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects + Education/Achievements — stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <section data-section="projects">
            <div className="section-title"><CreativeSectionTitle label="Projects" /></div>
            <div className="space-y-3 sm:space-y-4">
              {data.projects.map((p) => (
                <div
                  key={p.name}
                  className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100
                    hover:shadow-md hover:border-violet-100 transition-all"
                >
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{p.name}</p>
                  {p.link && (
                    <p className="text-[10px] text-violet-500 mt-0.5 break-all">{p.link}</p>
                  )}
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-5 sm:space-y-6">
            <section data-section="education">
              <div className="section-title"><CreativeSectionTitle label="Education" /></div>
              {data.education.map((e) => (
                <div
                  key={e.degree}
                  className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100
                    hover:shadow-md transition-shadow"
                >
                  <p className="text-xs sm:text-sm font-bold text-gray-900">{e.degree}</p>
                  <p className="text-[11px] sm:text-xs text-violet-600 font-semibold mt-0.5">
                    {e.school}
                  </p>
                  <p className="text-[11px] text-gray-400">{e.period}</p>
                  {e.note && (
                    <p className="text-[11px] text-gray-500 mt-1 italic">{e.note}</p>
                  )}
                </div>
              ))}
            </section>

            <section data-section="achievements">
              <div className="section-title"><CreativeSectionTitle label="Achievements" /></div>
              <div className="section-content space-y-2">
                {data.achievements.map((a) => (
                  <div key={a} className="flex gap-2 items-start group">
                    <span className="text-yellow-500 shrink-0 text-xs leading-none mt-0.5 group-hover:scale-110 transition-transform">★</span>
                    <p className="text-[11px] sm:text-xs text-gray-600">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            {data.certifications && data.certifications.length > 0 && (
              <section data-section="certifications">
                <div className="section-title"><CreativeSectionTitle label="Certifications" /></div>
                <div className="section-content space-y-2">
                  {data.certifications.map((c) => (
                    <div key={c} className="flex gap-2 items-start group">
                      <span className="text-violet-500 shrink-0 text-xs leading-none mt-0.5">✦</span>
                      <p className="text-[11px] sm:text-xs text-gray-600">{c}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.languages && data.languages.length > 0 && (
              <section data-section="languages">
                <div className="section-title"><CreativeSectionTitle label="Languages" /></div>
                <div className="section-content flex flex-wrap gap-1.5">
                  {data.languages.map((l) => (
                    <span key={l} className="text-[11px] bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">{l}</span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreativeSectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 sm:mb-4">
      <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-900 whitespace-nowrap">
        {label}
      </h2>
      <div className={`flex-1 h-0.5 bg-gradient-to-r ${ACCENT} opacity-30 rounded-full`} />
    </div>
  );
}
