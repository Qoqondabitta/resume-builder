'use client';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import EditableText from './EditableText';
import { CanvasResumeData, ResumeSection } from '@/types/canvas-resume';

interface Props {
  data: CanvasResumeData;
  onDataChange: (d: CanvasResumeData) => void;
}

export default function ModernCanvas({ data, onDataChange }: Props) {
  const { personalInfo: pi, sections, styles } = data;

  const updateInfo = (key: keyof typeof pi, val: string) =>
    onDataChange({ ...data, personalInfo: { ...pi, [key]: val } });

  const updateSection = (id: string, updates: Partial<ResumeSection>) =>
    onDataChange({
      ...data,
      sections: sections.map(s => (s.id === id ? { ...s, ...updates } : s)),
    });

  const visibleLeft = sections.filter(s => s.visible && s.position === 'left');
  const visibleMain = sections.filter(
    s => s.visible && (s.position === 'full' || s.position === 'right'),
  );

  return (
    <div
      className="flex w-full min-h-full"
      style={{
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        color: styles.textColor,
      }}
    >
      {/* ── Sidebar ─────────────────────────── */}
      <div
        className="w-[32%] shrink-0 p-6 flex flex-col gap-5"
        style={{ backgroundColor: styles.accentColor }}
      >
        {/* Profile photo */}
        {pi.photoUrl && (
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 mx-auto">
            <img src={pi.photoUrl} alt="profile" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Name & title */}
        <div>
          <EditableText
            value={pi.name}
            onChange={v => updateInfo('name', v)}
            className="text-xl font-bold text-white leading-tight"
          />
          <EditableText
            value={pi.title}
            onChange={v => updateInfo('title', v)}
            className="text-xs text-white/75 mt-0.5"
          />
        </div>

        {/* Contact */}
        <div className="space-y-1.5">
          <ContactRow icon={<Mail size={10} />} value={pi.email} onChange={v => updateInfo('email', v)} />
          <ContactRow icon={<Phone size={10} />} value={pi.phone} onChange={v => updateInfo('phone', v)} />
          <ContactRow icon={<MapPin size={10} />} value={pi.location} onChange={v => updateInfo('location', v)} />
          {pi.website && (
            <ContactRow icon={<Globe size={10} />} value={pi.website} onChange={v => updateInfo('website', v)} />
          )}
          {pi.linkedin && (
            <ContactRow icon={<Linkedin size={10} />} value={pi.linkedin} onChange={v => updateInfo('linkedin', v)} />
          )}
        </div>

        {/* Left-column sections */}
        {visibleLeft.map(s => (
          <div key={s.id}>
            <EditableText
              value={s.title}
              onChange={v => updateSection(s.id, { title: v })}
              className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1.5"
            />
            <div className="w-6 h-px bg-white/30 mb-2" />
            <EditableText
              value={s.content}
              onChange={v => updateSection(s.id, { content: v })}
              className="text-white/85 leading-relaxed"
            />
          </div>
        ))}
      </div>

      {/* ── Main ────────────────────────────── */}
      <div className="flex-1 p-6 space-y-5">
        {visibleMain.map(s => (
          <div key={s.id}>
            <EditableText
              value={s.title}
              onChange={v => updateSection(s.id, { title: v })}
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: styles.accentColor }}
            />
            <div className="h-px mb-3" style={{ backgroundColor: styles.accentColor + '44' }} />
            <EditableText
              value={s.content}
              onChange={v => updateSection(s.id, { content: v })}
              className="leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-white/60 mt-0.5 shrink-0">{icon}</span>
      <EditableText value={value} onChange={onChange} className="text-white/85 flex-1" />
    </div>
  );
}
