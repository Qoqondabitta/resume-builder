'use client';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import EditableText from './EditableText';
import { CanvasResumeData, ResumeSection } from '@/types/canvas-resume';

interface Props {
  data: CanvasResumeData;
  onDataChange: (d: CanvasResumeData) => void;
}

export default function ClassicCanvas({ data, onDataChange }: Props) {
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
      className="w-full min-h-full flex flex-col"
      style={{ fontFamily: styles.fontFamily, fontSize: styles.fontSize, color: styles.textColor }}
    >
      {/* ── Header ──────────────────────────── */}
      <div className="px-8 py-6" style={{ backgroundColor: styles.accentColor }}>
        <div className="flex items-center gap-5">
          {pi.photoUrl && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
              <img src={pi.photoUrl} alt="profile" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <EditableText
              value={pi.name}
              onChange={v => updateInfo('name', v)}
              className="text-2xl font-bold text-white leading-tight"
            />
            <EditableText
              value={pi.title}
              onChange={v => updateInfo('title', v)}
              className="text-sm text-white/75 mt-0.5"
            />
          </div>
        </div>

        {/* Contact row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4">
          {[
            { icon: <Mail size={11} />, key: 'email' as const },
            { icon: <Phone size={11} />, key: 'phone' as const },
            { icon: <MapPin size={11} />, key: 'location' as const },
            { icon: <Globe size={11} />, key: 'website' as const },
            { icon: <Linkedin size={11} />, key: 'linkedin' as const },
          ].map(({ icon, key }) =>
            pi[key] ? (
              <div key={key} className="flex items-center gap-1 text-white/80">
                <span>{icon}</span>
                <EditableText
                  value={pi[key]}
                  onChange={v => updateInfo(key, v)}
                  className="text-white/80"
                />
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────── */}
      <div className="flex-1 px-8 py-5 space-y-5">
        {/* Full-width sections */}
        {fullSections.map(s => (
          <SectionBlock
            key={s.id}
            section={s}
            accentColor={styles.accentColor}
            onUpdate={u => updateSection(s.id, u)}
          />
        ))}

        {/* Two-column sections */}
        {(leftSections.length > 0 || rightSections.length > 0) && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-5">
              {leftSections.map(s => (
                <SectionBlock
                  key={s.id}
                  section={s}
                  accentColor={styles.accentColor}
                  onUpdate={u => updateSection(s.id, u)}
                />
              ))}
            </div>
            <div className="space-y-5">
              {rightSections.map(s => (
                <SectionBlock
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
    </div>
  );
}

function SectionBlock({
  section,
  accentColor,
  onUpdate,
}: {
  section: ResumeSection;
  accentColor: string;
  onUpdate: (u: Partial<ResumeSection>) => void;
}) {
  return (
    <div>
      <EditableText
        value={section.title}
        onChange={v => onUpdate({ title: v })}
        className="text-xs font-bold uppercase tracking-wider mb-1"
        style={{ color: accentColor }}
      />
      <div className="h-px mb-2" style={{ backgroundColor: accentColor + '44' }} />
      <EditableText
        value={section.content}
        onChange={v => onUpdate({ content: v })}
        className="leading-relaxed"
      />
    </div>
  );
}
