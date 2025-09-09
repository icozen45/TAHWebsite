'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X } from 'lucide-react';
import type { AssignmentTask } from '@/app/types';
import { showCustomToast } from '@/app/components/ui/customToast';

// Allowed extensions & max size
const ALLOWED_EXT = ['.txt', '.doc', '.docx', '.odt', '.xml'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

interface FileStagerProps {
  stagingTasks: AssignmentTask[];
  setStagingTasks: React.Dispatch<React.SetStateAction<AssignmentTask[]>>;
  pushError: (msg: string) => void;
}

export default function FileStager({
  stagingTasks,
  setStagingTasks,
  pushError
}: FileStagerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [wordInput, setWordInput] = useState('');

  // Helpers
  const extOf = (name: string) => {
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx).toLowerCase() : '';
  };
  const fileBase = (name: string) => {
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(0, idx) : name;
  };

  // File handling
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    handleFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files) handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const newTasks: AssignmentTask[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = extOf(f.name);

      if (!ALLOWED_EXT.includes(ext)) {
        pushError(`Unsupported file type: ${f.name}`);
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        pushError(`File too large (max 10MB): ${f.name}`);
        continue;
      }

      newTasks.push({ id: Date.now() + i, file: f });
    }

    if (newTasks.length > 0) {
      setStagingTasks((p) => [...p, ...newTasks]);
      showCustomToast(
        `Added ${newTasks.length} file${newTasks.length > 1 ? 's' : ''}`,
        `${newTasks.map(f => (f.file ? f.file.name : '')).join(', ')}`
      );
    }
  };

  // Word-count handling
  const addWordTask = () => {
    const trimmed = wordInput.trim();
    if (!trimmed) {
      pushError('Enter a word count before adding.');
      return;
    }
    const n = Number(trimmed.replace(/,/g, ''));
    if (!Number.isFinite(n) || n <= 0) {
      pushError('Enter a valid positive number for words.');
      return;
    }
    const t: AssignmentTask = { id: Date.now(), wordCount: String(Math.round(n)) };
    setStagingTasks((p) => [...p, t]);
    setWordInput('');
    showCustomToast('Task added', `${n} words staged.`);
  };

  // Remove staged
  const removeStaged = (id: number) => {
    setStagingTasks((p) => p.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Word count input */}
      <div className="flex items-center gap-3">
        <input
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
          inputMode="numeric"
          placeholder="Add word count (e.g. 1200)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
        />
        <button
          onClick={addWordTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
        >
          Add Task
        </button>
      </div>

      {/* File upload */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Upload files</p>
            <p className="text-xs text-gray-400">.txt .doc .docx .odt .xml — max 10MB</p>
          </div>
          <p className="text-xs text-gray-500">Click or drop</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.doc,.docx,.odt,.xml"
          className="hidden"
          onChange={handleFilesSelected}
        />
      </div>

      {/* Staging list */}
      <div>
        <AnimatePresence>
          {stagingTasks.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 grid grid-cols-2 gap-2"
            >
              {stagingTasks.map((t) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2 text-sm shadow-sm"
                >
                  {t.file ? (
                    <>
                      <Paperclip size={14} className="text-gray-500" />
                      <div className="flex-1 truncate">
                        <span className="font-medium">{fileBase(t.file.name)}</span>
                        <span className="text-xs text-gray-400 ml-2">{extOf(t.file.name)}</span>
                        <div className="text-xs text-gray-400">
                          {Math.round(t.file.size / 1024)} KB
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">{t.wordCount} words</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeStaged(t.id)}
                    className="p-1 rounded hover:bg-gray-100 transition"
                  >
                    <X size={16} />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-gray-400"
            >
              No tasks staged yet — add a word count or upload files.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
