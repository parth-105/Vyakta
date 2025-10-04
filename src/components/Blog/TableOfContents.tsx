'use client';

import { useEffect, useState } from 'react';

type Heading = { id: string; text: string; level: number };

export default function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<Heading[]>([]);

  // Build headings list on client after mount
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const nodes = Array.from(document.querySelectorAll('.prose h2, .prose h3')) as HTMLElement[];
    const mapped: Heading[] = nodes.map((el) => {
      const fallbackId = (el.innerText || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (!el.id) el.id = fallbackId;
      return { id: el.id, text: el.innerText, level: el.tagName === 'H2' ? 2 : 3 };
    });
    setHeadings(mapped);
  }, []);

  // Observe headings to set activeId
  useEffect(() => {
    if (headings.length === 0 || typeof document === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
          }
        });
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block xl:w-64 xl:flex-shrink-0">
      <div className="sticky top-24 p-4 border border-gray-100 rounded-2xl shadow-soft bg-white">
        <p className="text-sm font-semibold text-neutral-700 mb-3">On this page</p>
        <nav className="space-y-1">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block text-sm transition-colors ${
                activeId === h.id ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
              } ${h.level === 3 ? 'pl-4' : ''}`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}


