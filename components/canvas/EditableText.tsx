'use client';
import { useRef, useEffect, CSSProperties } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * A div that is contentEditable and stays in sync with `value`.
 * Uses a focused-ref guard so React state updates never reset the cursor.
 */
export default function EditableText({
  value,
  onChange,
  placeholder = '',
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  // Sync DOM ← state only when the user is NOT actively typing
  useEffect(() => {
    if (ref.current && !focused.current) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={e => {
        focused.current = false;
        onChange(e.currentTarget.innerHTML);
      }}
      onInput={e => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
      className={`outline-none cursor-text ${className}`}
      style={style}
    />
  );
}
