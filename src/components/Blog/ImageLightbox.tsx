'use client';

import { useCallback, useEffect, useState } from 'react';

export default function ImageLightbox() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState<string>('');
  const [alt, setAlt] = useState<string>('');

  const handleClick = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG' && target.closest('.prose')) {
      const img = target as HTMLImageElement;
      setSrc(img.src);
      setAlt(img.alt || '');
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [handleClick]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-hover"
      />
    </div>
  );
}


