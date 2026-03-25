'use client';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import EditableText from './EditableText';
import { CanvasResumeData, ResumeSection } from '@/types/canvas-resume';

interface Props {
  data: CanvasResumeData;
  onDataChange: (d: CanvasResumeData) => void;
}

export default function MinimalCanvas({ data, onDataChange }: Props) {
  const { personalInfo: pi, sections, styles } = data;

  const updateInfo = (key: keyof typeof pi, val: string) =>
    onDataChange({ ...data, personalInfo: { ...pi, [key]: val } });

  const updateSection = (id: string, updates: Partial<ResumeSection>) =>
    onDataChange({
      ...data,
      sections: sections.map(s => (s.id === id ? { ...s, ...updates } : s)),
    });

  const fullSections = sections.filter(s => s.visible && s.position === 'full');
  const leftSections = sections.filter(s => s.visible && s.position === 'left');
  const rightSections = sections.filter(s => s.visible && s.position === 'right');

  return (
    <div
      className="w-full min-h-full p-8"
      style={{ fontFamily: styles.fontFamily, fontSize: styles.fontSize, color: styles.textColor }}
    >
      {/* ── Header ──────────────────────────── */}
      <div className="mb-6 pb-5 border-b" style={{ borderColor: styles.accentColor + '44' }}>
        <div className="flex items-start gap-4">
          {pi.photoUrl && (
            <div className="w-14 h-14 rounded-full overflow-hidden border shrink-0" style={{ borderColor: styles.accentColor + '55' }}>
              <img src={pi.photoUrl} alt="profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <EditableText
              value={pi.name}
              onChange={v => updateInfo('name', v)}
              className="text-2xl font-bold leading-tight"
              style={{ color: styles.accentColor }}
            />
            <EditableText
              value={pi.title}
              onChange={v => updateInfo('title', v)}
              className="text-sm text-gray-500 mt-0.5"
            />
          </div>
        </div>

        {/* Contact inline */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {[
            { icon: <Mail size={11} />, key: 'email' as const },
            { icon: <Phone size={11} />, key: 'phone' as const },
            { icon: <MapPin size={11} />, key: 'location' as const },
            { icon: <Globe size={11} />, key: 'website' as const },
            { icon: <Linkedin size={11} />, key: 'linkedin' as const },
          ].map(({ icon, key }) =>
            pi[key] ? (
              <div key={key} className="flex items-center gap-1 text-gray-500">
                <span>{icon}</span>
                <EditableText
                  value={pi[key]}
                  onChange={v => updateInfo(key, v)}
                  className="text-[11px] text-gray-500"
                />
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* ── Full-width sections ──────────────── */}
      {fullSections.map(s => (
        <MinimalSection
          key={s.id}
          section={s}
          accentColor={styles.accentColor}
          onUpdate={u => updateSection(s.id, u)}
        />
      ))}

      {/* ── Two-col sections ─────────────────── */}
      {(leftSections.length > 0 || rightSections.length > 0) && (
        <div className="grid grid-cols-2 gap-6 mt-2">
          <div className="space-y-5">
            {leftSections.map(s => (
              <MinimalSection
                key={s.id}
                section={s}
                accentColor={styles.accentColor}
                onUpdate={u => updateSection(s.id, u)}
              />
            ))}
          </div>
          <div className="space-y-5">
            {rightSections.map(s => (
              <MinimalSection
                key={s.id}
                section={s}
                accentColor={styles.accentColor}
                onUpdate={u => updateSection(s.id, u)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MinimalSection({
  section,
  accentColor,
  onUpdate,
}: {
  section: ResumeSection;
  accentColor: string;
  onUpdate: (u: Partial<ResumeSection>) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
        <EditableText
          value={section.title}
          onChange={v => onUpdate({ title: v })}
          className="text-[11px] font-bold uppercase tracking-wider text-gray-700"
        />
      </div>
      <EditableText
        value={section.content}
        onChange={v => onUpdate({ content: v })}
        className="text-[11px] leading-relaxed text-gray-600 pl-3"
      />
    </div>
  );
}
