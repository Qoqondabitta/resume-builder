'use client';

import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Star, FolderGit2, Trophy, type LucideProps } from 'lucide-react';
import { type ComponentType } from 'react';
import { ResumeData } from '@/types/resume';

export default function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-full w-full font-sans text-gray-800 bg-white">

      {/* ── Left sidebar ── */}
      <aside className="w-[220px] shrink-0 bg-primary-600 text-white flex flex-col">
        {/* Name block */}
        <div className="px-6 pt-8 pb-6 border-b border-white/20">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{data.name}</h1>
          <p className="text-blue-200 text-sm font-medium mt-1">{data.title}</p>
        </div>

        {/* Contact */}
        <div className="px-6 py-5 space-y-2.5 border-b border-white/20">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-3">Contact</p>
          {[
            { icon: Mail,     val: data.email    },
            { icon: Phone,    val: data.phone    },
            { icon: MapPin,   val: data.location },
            ...(data.website  ? [{ icon: Globe,    val: data.website  }] : []),
            ...(data.linkedin ? [{ icon: Linkedin, val: data.linkedin }] : []),
          ].map(({ icon: Icon, val }) => (
            <div key={val} className="flex items-start gap-2">
              <Icon size={12} className="mt-0.5 shrink-0 text-blue-300" />
              <span className="text-[11px] leading-tight break-all">{val}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="px-6 py-5 border-b border-white/20">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-3">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s} className="bg-white/15 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="px-6 py-5 border-b border-white/20">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-3">Education</p>
          {data.education.map((e) => (
            <div key={e.degree} className="mb-3 last:mb-0">
              <p className="text-[12px] font-semibold leading-snug">{e.degree}</p>
              <p className="text-blue-200 text-[11px]">{e.school}</p>
              <p className="text-blue-300 text-[10px] mt-0.5">{e.period}</p>
              {e.note && <p className="text-blue-200 text-[10px] mt-1 italic">{e.note}</p>}
            </div>
          ))}
        </div>

        {/* Languages */}
        {data.languages && (
          <div className="px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-3">Languages</p>
            {data.languages.map((l) => (
              <p key={l} className="text-[11px] mb-1">{l}</p>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 px-8 py-8 space-y-6 overflow-hidden">

        {/* Summary */}
        <section>
          <SectionHeader icon={Star} label="Professional Summary" />
          <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
        </section>

        {/* Experience */}
        <section>
          <SectionHeader icon={Briefcase} label="Experience" />
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.role + exp.company}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{exp.role}</p>
                    <p className="text-xs text-primary-600 font-semibold">{exp.company} · {exp.location}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap">{exp.period}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
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
          <SectionHeader icon={FolderGit2} label="Projects" />
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div key={p.name} className="border-l-2 border-primary-200 pl-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  {p.link && <span className="text-[10px] text-primary-500">{p.link}</span>}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <SectionHeader icon={Trophy} label="Achievements" />
          <ul className="space-y-1.5">
            {data.achievements.map((a) => (
              <li key={a} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

interface SectionHeaderProps {
  icon: ComponentType<LucideProps>;
  label: string;
}

function SectionHeader({ icon, label }: SectionHeaderProps) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={15} className="text-primary-600" />}
      <h2 className="text-xs font-bold uppercase tracking-widest text-primary-600">{label}</h2>
      <div className="flex-1 h-px bg-primary-100" />
    </div>
  );
}
