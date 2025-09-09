'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Props } from '@/app/types';

export default function CustomDropdown({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block mb-2 font-medium text-gray-700">{label}</label>
      {/* ✅ button is no longer implicit submit */}
      <button
        type="button"
        className="w-full border border-gray-300 p-3 rounded-lg bg-white shadow-sm flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{selected || 'Select an option'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-md
                       max-h-72 overflow-y-auto"  // taller scroll box (~18rem)
          >
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
