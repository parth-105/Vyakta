'use client';

import { useState, useEffect } from 'react';
import { Share2, X } from 'lucide-react';
import ShareButtons from './ShareButtons';

interface FloatingShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function FloatingShare({ url, title, description }: FloatingShareProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 300); // Show after scrolling 300px
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Floating Share Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Share2 className="w-6 h-6" />
          )}
        </button>

        {/* Share Options */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-soft">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Share this article</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <ShareButtons 
                url={url}
                title={title}
                description={description}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
