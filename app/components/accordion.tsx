// Accordion.tsx
'use client';

import { useState } from 'react';
import type { FAQItem } from '@/data/faqItems';

export default function Accordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="border rounded-md shadow divide-y">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center py-4 px-4 font-medium text-gray-800 hover:text-purple-600 transition-colors"
            >
              <span>{item.title}</span>
              <span className="text-xl">{isOpen ? '-' : '+'}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out px-4 ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="py-2 text-gray-600">{item.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
